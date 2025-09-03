function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function initCalendarBlom() {
  try {
    console.log("[BLŌM] Chargement des réservations...");

    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    if (!res.ok) throw new Error("Erreur HTTP " + res.status);
    const eventsRaw = await res.json();

    // Transformer en format ISO (aaaa-mm-jj)
    const toISODate = d => {
      const x = new Date(d);
      return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    };

    // Convertir en événements FullCalendar
    const events = (eventsRaw || []).map(ev => {
      return {
        title: "Réservé",
        start: toISODate(new Date(ev.start)),
        end: toISODate(new Date(ev.end)),
        allDay: true,
        display: "background", // fond coloré
        color: "red"           // en rouge
      };
    });

    // Construire la liste des jours bloqués
    window.blockedDatesBlom = new Set();
    for (const ev of events) {
      let d = new Date(ev.start + "T00:00:00");
      const end = new Date(ev.end + "T00:00:00");
      while (d < end) {
        window.blockedDatesBlom.add(
          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
        );
        d = addDays(d, 1);
      }
    }

    const calendarEl = document.getElementById("calendar-container-blom");
    if (!calendarEl) {
      console.error("⚠️ Élément #calendar-container-blom introuvable");
      return;
    }

    // Détruire l’ancien calendrier si présent
    if (window.calendars && window.calendars["BLOM"]) {
      try { window.calendars["BLOM"].destroy(); } catch (e) {}
      window.calendars["BLOM"] = null;
    }

    // Créer le calendrier
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: ""
      },
      events,
      displayEventTime: false,
      selectable: false,
      navLinks: false,
      dateClick: info => {
        onDateClickBlom(info);
      }
    });

    calendar.render();
    window.calendars = window.calendars || {};
    window.calendars["BLOM"] = calendar;
    console.log("[BLŌM] Calendrier affiché ✅");

    // --- Rendre toute la cellule cliquable ---
    calendarEl.addEventListener("click", e => {
      if (e.target.closest(".fc-event")) return; // ignorer les clics sur un événement
      const dayCell = e.target.closest("[data-date]");
      if (!dayCell) return;
      const dateStr = dayCell.getAttribute("data-date");
      if (!dateStr) return;
      onDateClickBlom({ dateStr });
    });

  } catch (err) {
    console.error("[BLŌM] Erreur initCalendar :", err);
    alert("Impossible de charger le calendrier BLŌM. Vérifie la console.");
  }
}

// Quand on clique sur une date
function onDateClickBlom(info) {
  const dateStr = info.dateStr;
  if (window.blockedDatesBlom && window.blockedDatesBlom.has(dateStr)) {
    alert("Cette date est déjà réservée.");
    return;
  }

  console.log("[BLŌM] Date choisie :", dateStr);

  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;

  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);
  document.getElementById("departureBlom").value = d.toISOString().split("T")[0];

  document.getElementById("bookingPanelBlom").classList.remove("hidden");
}

// Ajuster le nombre de nuits
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
