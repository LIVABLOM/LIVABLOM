(async function(){

  const isBlom = document.body.classList.contains("blom"); // pour choisir style et tarifs

  // -----------------------------
  // Styles dynamiques
  // -----------------------------
  const css = isBlom
    ? `/* BLŌM sombre */
      #calendar, #calendar * { touch-action: manipulation !important; user-select: none !important; }
      #calendar .fc { background:#111 !important; color:#fff; font-family:"Inter",sans-serif; }
      #calendar .fc-daygrid-day { background:#181818 !important; border-color:#222 !important; pointer-events:auto; transition:0.15s; }
      @media(hover:hover){ #calendar .fc-daygrid-day:hover:not([data-reserved="true"]){ background:#242424 !important; cursor:pointer; } }
      #calendar .fc-daygrid-day[data-reserved="true"] { background:#4a0000 !important; pointer-events:none; opacity:0.8; }
      #calendar .fc-day-disabled { opacity:0.35 !important; }
      #reservationModal { z-index:2000; display:none; justify-content:center; align-items:center; padding:20px; background:rgba(0,0,0,0.75); backdrop-filter:blur(4px); }
      #reservationModal .modal-content { background:#1b1b1b; padding:20px; border-radius:10px; width:90%; max-width:420px; color:#fff; border:1px solid #333; }
      #reservationModal input, #reservationModal select { width:100%; padding:8px; margin:6px 0 12px; border-radius:6px; background:#2a2a2a; border:1px solid #444; color:#fff; }
      #reservationModal button { width:100%; padding:12px; border-radius:8px; margin-top:8px; border:none; }
      #res-confirm { background:#6f4cff; color:#fff; } #res-cancel{background:#333;color:#fff;}`
    : `/* LIVA clair */
      #calendar, #calendar * { touch-action: manipulation !important; user-select: none !important; }
      #calendar .fc-daygrid-day { background:#fff; border:1px solid #ddd; pointer-events:auto; transition:0.15s; }
      @media(hover:hover){ #calendar .fc-daygrid-day:hover:not([data-reserved="true"]){ background:#eee !important; cursor:pointer; } }
      #calendar .fc-daygrid-day[data-reserved="true"] { background:#ffcccc !important; pointer-events:none; opacity:0.6; }
      #reservationModal { z-index:2000; display:none; justify-content:center; align-items:center; padding:20px; background:rgba(0,0,0,0.5); backdrop-filter:blur(4px); }
      #reservationModal .modal-content { background:#fff; padding:20px; border-radius:10px; width:90%; max-width:420px; color:#000; border:1px solid #ccc; }
      #reservationModal input, #reservationModal select { width:100%; padding:8px; margin:6px 0 12px; border-radius:6px; border:1px solid #ccc; color:#000; background:#f9f9f9; }
      #reservationModal button { width:100%; padding:12px; border-radius:8px; margin-top:8px; border:none; }
      #res-confirm { background:#6f4cff; color:#fff; } #res-cancel{background:#ccc;color:#000;}`;
  const styleNode=document.createElement("style"); styleNode.type="text/css"; styleNode.appendChild(document.createTextNode(css)); document.head.appendChild(styleNode);

  // -----------------------------
  // Helpers
  // -----------------------------
  function getTarif(dateStr, nbPersonnes=2){ return isBlom ? ((new Date(dateStr).getDay()===0?190:([5,6].includes(new Date(dateStr).getDay())?169:150))) : 79 + Math.max(0,nbPersonnes-2)*15; }
  function sumPrice(startStr,endStr,nbPersonnes){ let total=0, cur=new Date(startStr), end=new Date(endStr); while(cur<end){ total+=getTarif(cur.toISOString().split("T")[0],nbPersonnes); cur.setDate(cur.getDate()+1);} return total; }
  function formatDate(d){ const dt=new Date(d); return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,"0")}-${String(dt.getDate()).padStart(2,"0")}`; }

  document.addEventListener("DOMContentLoaded",async ()=>{
    const el=document.getElementById("calendar"); if(!el) return;

    const calendarBackend = location.hostname.includes("localhost") ? "http://localhost:4000" : "https://calendar-proxy-production-ed46.up.railway.app";
    const stripeBackend = location.hostname.includes("localhost") ? "http://localhost:3000" : "https://livablom-stripe-production.up.railway.app";

    const modal=document.getElementById("reservationModal"), modalDates=document.getElementById("modal-dates"),
          inputName=document.getElementById("res-name"), inputEmail=document.getElementById("res-email"),
          inputPhone=document.getElementById("res-phone"), inputPersons=document.getElementById("res-persons"),
          priceDisplay=document.getElementById("modal-price"),
          btnCancel=document.getElementById("res-cancel"), btnConfirm=document.getElementById("res-confirm");

    let reservedRanges=[], selectedStart=null, selectedEnd=null;

    function updatePrice(){ if(!selectedStart||!selectedEnd) return; const nbP=parseInt(inputPersons.value)||2; priceDisplay.textContent=`Montant total : ${sumPrice(selectedStart,selectedEnd,nbP)} €`; }
    function validateForm(){ const name=inputName.value.trim(),email=inputEmail.value.trim(),phone=inputPhone.value.trim(),nbP=parseInt(inputPersons.value); btnConfirm.disabled=!(name&&email&&phone&&nbP>=1&&nbP<=(isBlom?2:5)); }
    [inputName,inputEmail,inputPhone,inputPersons].forEach(i=>i.addEventListener("input",()=>{ validateForm(); updatePrice(); }));

    // -----------------------------
    // FullCalendar
    // -----------------------------
    const cal=new FullCalendar.Calendar(el,{
      initialView:"dayGridMonth",
      selectable:true,
      selectMirror:true,
      firstDay:1,
      height:"auto",
      locale:"fr",
      selectAllow(sel){
        const today=new Date(); today.setHours(0,0,0,0);
        if(sel.start<today) return false;
        return !reservedRanges.some(r=>sel.start<r.end && sel.end>r.start);
      },
      select(info){
        selectedStart=info.startStr;
        selectedEnd=info.endStr;
        modalDates.textContent=`Du ${formatDate(selectedStart)} au ${formatDate(selectedEnd)}`;
        inputName.value=""; inputEmail.value=""; inputPhone.value=""; inputPersons.value=2;
        validateForm(); updatePrice();
        modal.style.display="flex";
      },
      events: async (fetchInfo, success, failure)=>{
        try{
          const res=await fetch(`${calendarBackend}/api/reservations/${isBlom?"BLOM":"LIVA"}?ts=${Date.now()}`);
          const evts=await res.json();
          reservedRanges=evts.map(e=>({ start:new Date(e.start), end:new Date(e.end) }));
          success(reservedRanges.map(r=>({title:"Réservé", start:r.start, end:r.end, display:"background", backgroundColor:isBlom?"#900":"#ff0000", borderColor:isBlom?"#900":"#ff0000", allDay:true})));
        } catch(err){ failure(err); console.error(err); }
      },
      dayCellDidMount(info){
        const isReserved=reservedRanges.some(r=>info.date>=r.start && info.date<r.end);
        if(isReserved){ info.el.setAttribute("data-reserved","true"); info.el.style.pointerEvents="none"; return; }

        info.el.addEventListener("pointerup",ev=>{ if(ev.pointerType==="touch"){ const s=new Date(info.el.getAttribute("data-date")), e=new Date(s); e.setDate(e.getDate()+1); if(!cal.opt("selectAllow")({start:s,end:e})) return; cal.select({start:s,end:e,allDay:true}); }},{passive:true});
        info.el.addEventListener("click",()=>{ const s=new Date(info.el.getAttribute("data-date")), e=new Date(s); e.setDate(e.getDate()+1); if(!cal.opt("selectAllow")({start:s,end:e})) return; cal.select({start:s,end:e,allDay:true}); });
      }
    });

    cal.render();

    // -----------------------------
    // Modal buttons
    // -----------------------------
    btnCancel.addEventListener("click",()=>{ modal.style.display="none"; cal.unselect(); });
    btnConfirm.addEventListener("click",async ()=>{
      const name=inputName.value.trim(), email=inputEmail.value.trim(), phone=inputPhone.value.trim(), nbP=parseInt(inputPersons.value);
      if(!name||!email||!phone||isNaN(nbP)||nbP<1||nbP>(isBlom?2:5)){ alert("Veuillez remplir tous les champs correctement"); return; }
      const total=sumPrice(selectedStart,selectedEnd,nbP);
      if(!confirm(`Réserver ${isBlom?"BLŌM":"LIVA"} du ${formatDate(selectedStart)} au ${formatDate(selectedEnd)} pour ${total} € ?`)) return;
      try{
        const res=await fetch(`${stripeBackend}/api/checkout`,{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({logement:isBlom?"BLŌM":"LIVA",startDate:selectedStart,endDate:selectedEnd,amount:total,personnes:nbP,name,email,phone})});
        const data=await res.json(); if(data.url) location.href=data.url; else alert("Impossible de créer la réservation.");
      } catch(err){ console.error(err); alert("Erreur lors de la création de la réservation."); }
    });

  });

})();
