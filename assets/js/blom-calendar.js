function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

function formatFR(date) {
  return date.toLocaleDateString('fr-FR', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
}

window.blockedDatesBlom = new Set();
window.calendars = {};

async function initCalendarBlom() {
  const calendarEl = document.getElementById("calendar-container-blom");
  if (!calendarEl) return;

  // fetch reservations
  let events = [];
  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const data = await res.json();
    events = data.map(ev => {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      return { title:"Réservé", start: ymd(s), end: ymd(e), allDay:true, display:"block" };
    });

    // bloquer dates
    window.blockedDatesBlom = new Set();
    for (const ev of events) {
      let d = new Date(ev.start + "T00:00:00");
      const end = new Date(ev.end + "T00:00:00");
      while(d < end) {
        window.blockedDatesBlom.add(ymd(d));
        d = addDays(d, 1);
      }
    }
  } catch(e){ console.error("Erreur fetch events:", e); }

  // destroy previous calendar
  if (window.calendars["BLOM"]) window.calendars["BLOM"].destroy();

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    locale: "fr",
    firstDay: 1,
    headerToolbar: { left:"prev,next today", center:"title", right:"" },
    events,
    displayEventTime:false,
    selectable:true,
    dateClick: onDateClickBlom
  });

  calendar.render();
  window.calendars["BLOM"] = calendar;
}

// clic sur date
function onDateClickBlom(info) {
  const dateStr = info.dateStr || info.date;
  if (window.blockedDatesBlom.has(dateStr)) { alert("Cette date est déjà réservée."); return; }

  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;

  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  document.getElementById("departureBlom").value = ymd(d);

  document.getElementById("bookingPanelBlom").classList.remove("hidden");

  // bouton confirmer
  document.getElementById("confirmBlom").onclick = () => {
    const nights = parseInt(document.getElementById("nightsBlom").value,10);
    const dep = addDays(new Date(dateStr), nights);
    alert(`Simulation réservation\nArrivée: ${dateStr}\nNuits: ${nights}\nDépart: ${ymd(dep)}`);
  };
}

function adjustNightsBlom(delta) {
  const nightsInput = document.getElementById("nightsBlom");
  let nights = parseInt(nightsInput.value) + delta;
  if (nights < 1) nights = 1;
  nightsInput.value = nights;

  const arrival = document.getElementById("arrivalBlom").value;
  if(arrival){
    const dep = addDays(new Date(arrival), nights);
    document.getElementById("departureBlom").value = ymd(dep);
  }
}
