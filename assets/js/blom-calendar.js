// utilitaires
function addDays(date, days){ const d = new Date(date); d.setDate(d.getDate()+days); return d; }
function ymd(date){ const y=date.getFullYear(), m=String(date.getMonth()+1).padStart(2,'0'), d=String(date.getDate()).padStart(2,'0'); return `${y}-${m}-${d}`; }

window.blockedDatesBlom = new Set();
window.calendars = {};

// Ouvrir/Fermer le modal
function openCalendarBlom(){ document.getElementById("calendarModalBlom").classList.remove("hidden"); document.getElementById("calendarModalBlom").classList.add("flex"); initCalendarBlom(); }
function closeCalendarBlom(event){ if(event && event.target!==event.currentTarget) return; document.getElementById("calendarModalBlom").classList.add("hidden"); document.getElementById("bookingPanelBlom").classList.add("hidden"); }

// initialisation du calendrier
async function initCalendarBlom(){
  const calendarEl = document.getElementById("calendar-container-blom");
  if(!calendarEl) return;

  let events=[];
  try{
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const data = await res.json();
    events = data.map(ev=>{
      const s=new Date(ev.start), e=new Date(ev.end);
      return { title:"Réservé", start: ymd(s), end: ymd(e), allDay:true, display:"background", backgroundColor:"#e63946" };
    });

    // blocage dates
    window.blockedDatesBlom.clear();
    for(const ev of events){
      let d=new Date(ev.start+"T00:00:00"), end=new Date(ev.end+"T00:00:00");
      while(d<end){ window.blockedDatesBlom.add(ymd(d)); d=addDays(d,1); }
    }
  } catch(e){ console.error("Erreur fetch events:", e); }

  // destroy old
  if(window.calendars["BLOM"]) window.calendars["BLOM"].destroy();

  const calendar=new FullCalendar.Calendar(calendarEl,{
    initialView:"dayGridMonth",
    height:"auto",
    locale:"fr",
    firstDay:1,
    headerToolbar:{ left:"prev,next today", center:"title", right:"" },
    events,
    displayEventTime:false,
    selectable:true,
    dateClick:onDateClickBlom
  });

  calendar.render();
  window.calendars["BLOM"]=calendar;

  // délégation clic sur toute la cellule
  calendarEl.addEventListener("click", e=>{
    if(e.target.closest(".fc-event")) return;
    const dayCell = e.target.closest("[data-date]");
    if(!dayCell) return;
    const dateStr = dayCell.getAttribute("data-date");
    if(!dateStr || window.blockedDatesBlom.has(dateStr)) return;
    onDateClickBlom({ dateStr });
  });
}

// gestion clic date
function onDateClickBlom(info){
  const dateStr=info.dateStr||info.date;
  if(window.blockedDatesBlom.has(dateStr)){ alert("Cette date est déjà réservée."); return; }

  document.getElementById("arrivalBlom").value=dateStr;
  document.getElementById("nightsBlom").value=1;

  const dep = addDays(new Date(dateStr),1);
  document.getElementById("departureBlom").value = ymd(dep);

  document.getElementById("bookingPanelBlom").classList.remove("hidden");

  document.getElementById("confirmBlom").onclick=()=>{
    const nights=parseInt(document.getElementById("nightsBlom").value,10);
    const dep2=addDays(new Date(dateStr), nights);
    alert(`Simulation réservation\nArrivée: ${dateStr}\nNuits: ${nights}\nDépart: ${ymd(dep2)}`);
  };
}

// ajuster nuits
function adjustNightsBlom(delta){
  const nightsInput=document.getElementById("nightsBlom");
  let nights=parseInt(nightsInput.value)+delta;
  if(nights<1) nights=1;
  nightsInput.value=nights;

  const arrival=document.getElementById("arrivalBlom").value;
  if(arrival){
    const dep=addDays(new Date(arrival), nights);
    document.getElementById("departureBlom").value=ymd(dep);
  }
}
