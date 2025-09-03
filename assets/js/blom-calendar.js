function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function ymd(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function formatFR(date) {
  return date.toLocaleDateString('fr-FR', { weekday:'short', day:'2-digit', month:'short', year:'numeric' });
}

window.blockedDatesBlom = new Set();
window.calendars = {};
window.selectionEventBlom = null;
window.startBlom = null;
window.maxNightsBlom = 1;

async function initCalendarBlom() {
  const calendarEl = document.getElementById("calendar-container-blom");
  if (!calendarEl) return;

  // Fetch reservations
  const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
  const eventsRaw = await res.json();
  
  const toISO = d => {
    const x = new Date(d);
    return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
  };

  const events = (eventsRaw || []).map(ev => ({
    title: "Réservé",
    start: toISO(ev.start),
    end: toISO(ev.end),
    allDay: true,
    display: "block"
  }));

  // build blocked dates set
  window.blockedDatesBlom.clear();
  events.forEach(ev => {
    let d = new Date(ev.start + "T00:00:00");
    const end = new Date(ev.end + "T00:00:00");
    while (d < end) {
      window.blockedDatesBlom.add(ymd(d));
      d = addDays(d, 1);
    }
  });

  // destroy previous
  if (window.calendars["BLOM"]) window.calendars["BLOM"].destroy();

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "fr",
    height: "auto",
    firstDay: 1,
    events,
    displayEventTime: false,
    navLinks: true,
    dateClick: info => onDateClickBlom(info)
  });

 calendar.render();
window.calendars["BLOM"] = calendar;

// --- rendre toute la cellule cliquable ---
const calendarEl = document.getElementById("calendar-container-blom");

calendarEl.addEventListener("click", (e) => {
  // Ignore si on clique sur un événement existant (réservé)
  if (e.target.closest(".fc-event")) return;

  // Cherche la cellule de jour la plus proche
  const dayCell = e.target.closest("[data-date]");
  if (!dayCell) return;

  const dateStr = dayCell.getAttribute("data-date");
  if (!dateStr) return;

  // Déclenche le même handler que dateClick
  onDateClickBlom({ dateStr });
});
