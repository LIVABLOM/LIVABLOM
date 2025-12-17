// ========================================================
// 🌿 LIVA Calendar JS - Version stable corrigée
// ========================================================

(async function () {

  // -------------------------------
  // 1) CSS : style + mobile safe
  // -------------------------------
  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc { 
      background: #ffffff !important;
      color: #000 !important;
      font-family: "Inter", sans-serif; 
    }

    #calendar .fc-daygrid-day { 
      background: #ffffff !important;
      border-color: #ddd !important; 
      transition: background 0.15s ease; 
      pointer-events: auto !important; 
      color: #000 !important;
    }

    @media (hover: hover) {
      #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) { 
        background: #eee !important; 
        cursor: pointer; 
      }
    }

    #calendar .fc-day-disabled { opacity: 0.35 !important; }

    #calendar .fc-daygrid-day[data-reserved="true"] { 
      background: #900 !important; 
      opacity: 0.9; 
      pointer-events: none !important; 
      color: #fff !important;
    }

    #reservationModal {
      z-index: 2000;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    #reservationModal .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      width: 90%;
      max-width: 480px;
      color: #000;
      border: 1px solid #ccc;
    }

    #reservationModal input, #reservationModal select {
      width: 100%;
      padding: 8px;
      margin: 6px 0 12px;
      border-radius: 6px;
      background: #fafafa;
      border: 1px solid #ccc;
      color: #000;
    }

    #reservationModal button { 
      padding: 12px; 
      border-radius: 8px; 
      border: none; 
      margin-top: 8px; 
      width: 100%; 
    }

    #res-confirm { background: #0077ff; color: #fff; }
    #res-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
    #res-cancel { background: #ccc; color: #000; }
    #res-error { color: #c00; margin-top: 6px; display: none; }
  `;

  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // -------------------------------
  // 2) Helpers
  // -------------------------------
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(0,0,0,0);
    return d;
  }

  function formatLocalDate(date) {
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }

  function getTarif(dateStr, nbPersonnes = 2, testPayment = false) {
    if (testPayment) return 1;
    const base = 79;
    const supplement = nbPersonnes > 2 ? (nbPersonnes - 2) * 15 : 0;
    return base + supplement;
  }

  async function getConfig() {
    try {
      const stripeBackend = location.hostname.includes("localhost")
        ? "http://localhost:3000"
        : "https://livablom-stripe-production.up.railway.app";
      const res = await fetch(`${stripeBackend}/api/config`);
      return await res.json();
    } catch {
      return { testPayment: true };
    }
  }

  function sumPriceByNights(startStr, nights, nbPersons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    for (let i=0;i<nights;i++){
      total += getTarif(formatLocalDate(cur), nbPersons, testPayment);
      cur.setDate(cur.getDate()+1);
    }
    return total;
  }

  function isRangeAvailable(startDate, nights, reservedRanges){
    const selStart = new Date(startDate); selStart.setHours(0,0,0,0);
    const selEnd = addDays(selStart,nights);
    const today = new Date(); today.setHours(0,0,0,0);
    if(selStart<today) return false;
    return !reservedRanges.some(r => selStart<r.end && selEnd>r.start);
  }

  // -------------------------------
  // 3) DOM READY
  // -------------------------------
  document.addEventListener("DOMContentLoaded", async ()=>{
    const el = document.getElementById("calendar"); if(!el) return;

    const modal = document.getElementById("reservationModal");
    const modalStart = document.getElementById("modal-start")||document.getElementById("modal-dates");
    const inputNights = document.getElementById("res-nights");
    const inputPersons = document.getElementById("res-persons");
    const priceDisplay = document.getElementById("modal-price");
    const inputName = document.getElementById("res-name");
    const inputEmail = document.getElementById("res-email");
    const inputPhone = document.getElementById("res-phone");
    const btnCancel = document.getElementById("res-cancel");
    const btnConfirm = document.getElementById("res-confirm");
    const errorBox = document.getElementById("res-error");

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";

    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const config = await getConfig();
    const testPayment = config.testPayment;

    let reservedRanges=[]; 
    let clickedStart=null;

    if(inputNights) inputNights.value=1;
    if(inputPersons) inputPersons.value=2;

    const MAX_PERSONS=5;
    const MAX_NIGHTS=30;

    function clampNumberInput(el,min,max){
      if(!el) return;
      el.setAttribute('min',min); el.setAttribute('max',max);
      el.addEventListener('input',()=>{
        let n=parseInt(el.value.replace(/[^\d]/g,''),10);
        if(isNaN(n)||n<min) n=min;
        if(n>max) n=max;
        el.value=n; el.dispatchEvent(new Event('input',{bubbles:true}));
      });
      el.addEventListener('blur',()=>{
        let n=parseInt(el.value,10);
        if(isNaN(n)||n<min) n=min;
        if(n>max) n=max;
        el.value=n; el.dispatchEvent(new Event('input',{bubbles:true}));
      });
    }

    clampNumberInput(inputNights,1,MAX_NIGHTS);
    clampNumberInput(inputPersons,1,MAX_PERSONS);

    const cal=new FullCalendar.Calendar(el,{
      initialView:"dayGridMonth",
      selectable:false,
      firstDay:1,
      locale:"fr",
      height:"auto",
      events: async (_,success,failure)=>{
        try{
          const res=await fetch(`${calendarBackend}/api/reservations/LIVA`);
          const data=await res.json();
          reservedRanges=data.map(e=>{
            const s=new Date(e.start); s.setHours(0,0,0,0);
            const exEnd=new Date(e.end); exEnd.setHours(0,0,0,0);
            return {start:s,end:exEnd};
          });
          success(reservedRanges.map(r=>({start:r.start,end:r.end,display:"background",backgroundColor:"#900"})));
        }catch(err){failure(err);}
      },
      dayCellDidMount(info){
        if(reservedRanges.some(r=>info.date>=r.start && info.date<r.end)) info.el.setAttribute("data-reserved","true");
      },
      dateClick(info){
        const today=new Date(); today.setHours(0,0,0,0);
        const dateClicked=new Date(info.date.getFullYear(),info.date.getMonth(),info.date.getDate());
        if(dateClicked<today) return;
        if(reservedRanges.some(r=>dateClicked>=r.start && dateClicked<r.end)) return;

        clickedStart=dateClicked;
        if(modalStart) modalStart.textContent=`Arrivée : ${formatLocalDate(clickedStart)}`;
        if(inputNights) inputNights.value=1;
        if(inputPersons) inputPersons.value=2;
        if(errorBox){ errorBox.style.display='none'; errorBox.textContent=''; }

        if(priceDisplay) priceDisplay.textContent=`Montant total : ${sumPriceByNights(formatLocalDate(clickedStart),1,parseInt(inputPersons.value,10),testPayment)} €`;
        if(modal) modal.style.display='flex';

        // 🔹 correction : mise à jour immédiate de l'état du bouton confirmer
        updateModalPriceAndAvailability();
      }
    });

    cal.render();

    function updateModalPriceAndAvailability(){
      if(!clickedStart){ if(btnConfirm) btnConfirm.disabled=true; return; }
      let nights=Math.max(1,parseInt(inputNights.value,10)||1);
      let persons=Math.max(1,Math.min(parseInt(inputPersons.value,10)||1,MAX_PERSONS));
      inputNights.value=nights; inputPersons.value=persons;

      const ok=isRangeAvailable(clickedStart,nights,reservedRanges);

      if(errorBox){
        if(!ok){ errorBox.style.display='block'; errorBox.textContent='La période sélectionnée chevauche une réservation existante.'; }
        else{ errorBox.style.display='none'; errorBox.textContent=''; }
      }

      if(priceDisplay) priceDisplay.textContent=`Montant total : ${sumPriceByNights(formatLocalDate(clickedStart),nights,persons,testPayment)} €`;
      if(btnConfirm) btnConfirm.disabled=!ok;
    }

    if(inputNights) inputNights.addEventListener('input',updateModalPriceAndAvailability);
    if(inputPersons) inputPersons.addEventListener('input',updateModalPriceAndAvailability);

    if(btnCancel) btnCancel.addEventListener('click',()=>{ if(modal) modal.style.display='none'; clickedStart=null; });
    if(btnConfirm) btnConfirm.addEventListener('click',async ()=>{
      if(!clickedStart) return;
      const nights=Math.max(1,parseInt(inputNights.value,10)||1);
      const persons=Math.max(1,Math.min(parseInt(inputPersons.value,10)||1,MAX_PERSONS));
      if(!isRangeAvailable(clickedStart,nights,reservedRanges)){ if(errorBox){ errorBox.style.display='block'; errorBox.textContent='Période non disponible.'; } return; }

      const name=inputName?inputName.value.trim():'';
      const email=inputEmail?inputEmail.value.trim():'';
      const phone=inputPhone?inputPhone.value.trim():'';
      if(!name||!email||!phone){ if(errorBox){ errorBox.style.display='block'; errorBox.textContent='Veuillez remplir tous les champs.';} return; }

      const startDate=formatLocalDate(clickedStart);
      const endDate=formatLocalDate(addDays(clickedStart,nights));
      const total=sumPriceByNights(startDate,nights,persons,testPayment);
      if(!confirm(`Confirmer la réservation du ${startDate} au ${endDate} (${nights} nuits) pour ${total} € ?`)) return;

      try{
        const res=await fetch(`${stripeBackend}/api/checkout`,{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({logement:'LIVA',startDate,endDate,amount:total,personnes:persons,name,email,phone})
        });
        const data=await res.json();
        if(data.url){ if(modal) modal.style.display='none'; location.href=data.url; } else alert("Erreur lors de la création de la réservation.");
      }catch{ alert("Erreur réseau lors de la réservation."); }
    });

    if(modal) modal.addEventListener('click',ev=>{ if(ev.target===modal){ modal.style.display='none'; clickedStart=null; } });

  });

})();
