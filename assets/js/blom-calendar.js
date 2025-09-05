function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

window.blockedDatesBlom = new Set();
window.calendars = {};

async function initCalendarBlom() {
  const calendarEl = document.getElementById("calendar-container-blom");
  if (!calendarEl) return;

  // Récupération des réservations
  let events = [];
  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const data = await res.json();

    events = data.map(ev => {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      return {
        title: "Réservé",
        start: ymd(s),
        end: ymd(e),
        allDay: true,
        display: "block",
        color: "#e63946" // rouge
      };
    });

    // Marquer les dates réservées
    window.blockedDatesBlom = new Set();
    for (const ev of events) {
      let d = new Date(ev.start + "T00:00:00");
      const end = new Date(ev.end + "T00:00:00");
      while (d < end) {
        window.blockedDatesBlom.add(ymd(d));
        d = addDays(d, 1);
      }
    }
  } catch (e) {
    console.error("Erreur fetch events:", e);
  }

  // Détruire l'ancien calendrier si présent
  if (window.calendars["BLOM"]) window.calendars["BLOM"].destroy();

  // Initialiser FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    locale: "fr",
    firstDay: 1,
    headerToolbar: { left: "prev,next today", center: "title", right: "" },
    events,
    displayEventTime: false,
    selectable: true,
    dayCellClassNames: function (arg) {
      if (window.blockedDatesBlom.has(arg.dateStr)) return ["blocked-date"];
      return [];
    },
    dateClick: onDateClickBlom
  });

  calendar.render();
  window.calendars["BLOM"] = calendar;

  // Rendez toute la cellule cliquable
  calendarEl.addEventListener("click", e => {
    if (e.target.closest(".fc-event")) return; // ignorer clic sur événement
    const dayCell = e.target.closest("[data-date]");
    if (!dayCell) return;
    const dateStr = dayCell.getAttribute("data-date");
    if (!dateStr) return;
    if (window.blockedDatesBlom.has(dateStr)) return; // ignorer dates réservées
    onDateClickBlom({ dateStr });
  });

  // Gestion bouton fermer
  const closeBtn = document.getElementById("closeBlom");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const modal = document.getElementById("calendarModalBlom");
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    });
  }
}

// Gestion du clic sur une date
function onDateClickBlom(info) {
  const dateStr = info.dateStr || info.date;
  if (window.blockedDatesBlom.has(dateStr)) {
    alert("Cette date est déjà réservée.");
    return;
  }

  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;

  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  document.getElementById("departureBlom").value = ymd(d);

  document.getElementById("bookingPanelBlom").classList.remove("hidden");

  // Confirmation
  document.getElementById("confirmBlom").onclick = () => {
    const nights = parseInt(document.getElementById("nightsBlom").value, 10);
    const dep = addDays(new Date(dateStr), nights);
    alert(`Simulation réservation\nArrivée: ${dateStr}\nNuits: ${nights}\nDépart: ${ymd(dep)}`);
  };
}

// Ajustement du nombre de nuits
function adjustNightsBlom(delta) {
  const nightsInput = document.getElementById("nightsBlom");
  let nights = parseInt(nightsInput.value) + delta;
  if (nights < 1) nights = 1;
  nightsInput.value = nights;

  const arrival = document.getElementById("arrivalBlom").value;
  if (arrival) {
    const dep = addDays(new Date(arrival), nights);
    document.getElementById("departureBlom").value = ymd(dep);
  }
}
