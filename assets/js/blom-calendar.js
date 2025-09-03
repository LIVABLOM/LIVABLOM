// Ouvre le modal et charge le HTML depuis _includes
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("reserveBlom");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const modal = document.getElementById("calendarModalBlom");
    if (!modal) return;

    // Charger le contenu HTML
    const html = await fetch("/_includes/blom-calendar.html").then(r => r.text());
    modal.innerHTML = html;
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Initialiser le calendrier après l’injection
    if (typeof initCalendarBlom === "function") {
      initCalendarBlom();
    }
  });
});

// Ferme le modal
function closeCalendarBlom() {
  const modal = document.getElementById("calendarModalBlom");
  if (modal) {
    modal.classList.add("hidden");
    modal.innerHTML = ""; // vider pour éviter les doublons
  }
}

// === FONCTIONS DU CALENDRIER ===

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function initCalendarBlom() {
  try {
    console.log("[BLŌM] initCalendarBlom: fetching events...");
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    if (!res.ok) throw new Error("Erreur HTTP " + res.status);
    const eventsRaw = await res.json();

    const toISODate = d => {
      const x = new Date(d);
      return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`;
    };

    const events = (eventsRaw || []).map(ev => {
      const s = new Date(ev.start);
      const e = new Date(ev.end);
      return {
        title: "Réservé",
        start: toISODate(s),
        end: toISODate(e),
        allDay: true,
        display: "background" // affiche en fond plutôt qu’en bloc
      };
    });

    // Bloquer les jours réservés
    window.blockedDatesBlom = new Set();
    for (const ev of events) {
      let d = new Date(ev.start + "T00:00:00");
      const end = new Date(ev.end + "T00:00:00");
      while (d < end) {
        window.blockedDatesBlom.add(
          d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,'0') + "-" + String(d.getDate()).padStart(2,'0')
        );
        d = addDays(d, 1);
      }
    }

    const calendarEl = document.getElementById("calendar-container-blom");
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: { left: "prev,next today", center: "title", right: "" },
      events,
      displayEventTime: false,
      selectable: false,
      navLinks: false,
      dateClick: (info) => {
        onDateClickBlom(info);
      }
    });

    calendar.render();
  } catch (err) {
    console.error("[BLŌM] initCalendar error:", err);
  }
}

function onDateClickBlom(info) {
  const dateStr = info.dateStr;
  if (window.blockedDatesBlom && window.blockedDatesBlom.has(dateStr)) {
    alert("Cette date est déjà réservée.");
    return;
  }

  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;

  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  document.getElementById("departureBlom").value = d.toISOString().split("T")[0];

  document.getElementById("bookingPanelBlom").classList.remove("hidden");
}

function adjustNightsBlom(delta) {
  const nightsInput = document.getElementById("nightsBlom");
  let nights = parseInt(nightsInput.value) + delta;
  if (nights < 1) nights = 1;
  nightsInput.value = nights;

  const arrival = document.getElementById("arrivalBlom").value;
  if (arrival) {
    const d = new Date(arrival);
    d.setDate(d.getDate() + nights);
    document.getElementById("departureBlom").value = d.toISOString().split("T")[0];
  }
}
