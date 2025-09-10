document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar-container");

  // Modal elements
  const modal = document.getElementById("reservationModal");
  const modalDateEl = document.getElementById("modalDate");
  const modalNightsInput = document.getElementById("modalNights");
  const modalPricePerNightEl = document.getElementById("modalPricePerNight");
  const modalTotalEl = document.getElementById("modalTotal");
  const modalPayBtn = document.getElementById("modalPayBtn");
  const modalCancelBtn = document.getElementById("modalCancelBtn");

  // Fonction pour formater les dates
  const toISODate = (d) => {
    const x = new Date(d);
    const y = x.getFullYear();
    const m = String(x.getMonth() + 1).padStart(2, "0");
    const day = String(x.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  // Récupérer les réservations BLOM
  let events = [];
  try {
    const res = await fetch("https://livablom-stripe-production.up.railway.app/api/reservations/BLOM");
    const data = await res.json();
    events = data.map(ev => ({
      title: "Réservé",
      start: toISODate(ev.start),
      end: toISODate(ev.end),
      allDay: true,
      display: "block"
    }));
  } catch (err) {
    console.error("Erreur chargement réservations BLOM :", err);
  }

  // Prix par jour
  function getPriceForDate(date) {
    const day = date.getDay(); // 0=Dim, 1=Lun ... 6=Sam
    if (day === 0) return 190; // Dimanche
    if (day === 5 || day === 6) return 169; // Vendredi & Samedi
    return 150; // Lun → Jeu
  }

  let selectedDate = null;
  let selectedNights = 1;

  // Créer le calendrier
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    locale: "fr",
    firstDay: 1,
    headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
    events: events,
    displayEventTime: false,
    eventColor: "#e63946",
    selectable: true,
    dayMaxEvents: true,
    navLinks: true,

    // Afficher le prix dans les cellules
    dayCellDidMount: function(info) {
      if (info.view.type !== "dayGridMonth") return;
      const topEl = info.el.querySelector(".fc-daygrid-day-top");
      if (!topEl) return;
      const price = getPriceForDate(info.date);
      if (topEl.querySelector(".price-tag")) return;
      const priceEl = document.createElement("span");
      priceEl.className = "price-tag";
      priceEl.textContent = price + " €";
      topEl.appendChild(priceEl);
    },

    // Clic sur une date
    dateClick: function(info) {
      const clickedDate = info.dateStr;
      const isBlocked = events.some(ev => {
        return clickedDate >= ev.start && clickedDate < ev.end;
      });

      if (isBlocked) {
        alert("Cette date est déjà réservée !");
      } else {
        // Affiche le modal
        selectedDate = clickedDate;
        selectedNights = 1;
        const pricePerNight = getPriceForDate(new Date(selectedDate));

        modalDateEl.textContent = selectedDate;
        modalNightsInput.value = selectedNights;
        modalPricePerNightEl.textContent = pricePerNight;
        modalTotalEl.textContent = pricePerNight * selectedNights;

        modal.style.display = "flex";
      }
    }
  });

  calendar.render();

  // Met à jour le total quand on change le nombre de nuits
  modalNightsInput.addEventListener("input", () => {
    selectedNights = parseInt(modalNightsInput.value) || 1;
    const pricePerNight = getPriceForDate(new Date(selectedDate));
    modalTotalEl.textContent = pricePerNight * selectedNights;
  });

  // Bouton annuler
  modalCancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Bouton payer
  modalPayBtn.addEventListener("click", async () => {
    const prix = getPriceForDate(new Date(selectedDate)) * selectedNights;
    try {
      const res = await fetch('https://livablom-stripe-production.up.railway.app/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, logement: 'BLŌM', nuits: selectedNights, prix, email: 'client@example.com' })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la réservation.");
    }
  });

});
