// Ouvrir et fermer modal
function closeCalendarBlom() {
  const modal = document.getElementById("calendarModalBlom");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

// Charger le calendrier après click sur Réserver
document.getElementById("reserveBlom").addEventListener("click", async () => {
  const modal = document.getElementById("calendarModalBlom");
  const html = await fetch("/assets/html/blom-calendar.html").then(r => r.text());
  modal.innerHTML = html;
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Charger FullCalendar CSS/JS si pas déjà inclus
  if (!window.FullCalendarLoaded) {
    const link = document.createElement("link");
    link.href = "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js";
    script.onload = () => { window.FullCalendarLoaded = true; initCalendarBlom(); };
    document.body.appendChild(script);
  } else {
    initCalendarBlom();
  }
});

// ======= JS du calendrier ======= //
function addDays(date, days) { const d = new Date(date); d.setDate(d.getDate()+days); return d; }

async function initCalendarBlom() {
  const calendarEl = document.getElementById("calendar-container-blom");
  if (!calendarEl) return;

  // récupérer événements depuis le serveur
  let eventsRaw = [];
  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    eventsRaw = await res.json();
  } catch(e) { console.error(e); }

  const events = (eventsRaw || []).map(ev => {
    const s = new Date(ev.start), e = new Date(ev.end);
    return { title: "Réservé", start: s.toISOString().split("T")[0], end: e.toISOString().split("T")[0], allDay:true, display:"block" };
  });

  window.blockedDatesBlom = new Set();
  for (const ev of events) {
    let d = new Date(ev.start+"T00:00:00");
    const end = new Date(ev.end+"T00:00:00");
    while(d<end){ window.blockedDatesBlom.add(d.toISOString().split("T")[0]); d=addDays(d,1); }
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    locale: "fr",
    firstDay:1,
    events,
    selectable:true,
    dateClick: (info)=>onDateClickBlom(info)
  });
  calendar.render();
}

function onDateClickBlom(info){
  const dateStr = info.dateStr;
  if(window.blockedDatesBlom.has(dateStr)){ alert("Cette date est déjà réservée."); return; }

  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;

  const d = new Date(dateStr); d.setDate(d.getDate()+1);
  document.getElementById("departureBlom").value = d.toISOString().split("T")[0];

  document.getElementById("bookingPanelBlom").classList.remove("hidden");
}

function adjustNightsBlom(delta){
  const nightsInput = document.getElementById("nightsBlom");
  let nights = parseInt(nightsInput.value)+delta;
  if(nights<1)nights=1;
  nightsInput.value=nights;

  const arrival=document.getElementById("arrivalBlom").value;
  if(arrival){ const d=new Date(arrival); d.setDate(d.getDate()+nights); document.getElementById("departureBlom").value=d.toISOString().split("T")[0]; }
}
