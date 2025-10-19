document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const reservedDates = [
    "2025-10-20",
    "2025-10-21",
    "2025-10-28",
    "2025-10-29",
    "2025-11-04",
  ];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    selectMirror: true,
    timeZone: "local",
    locale: "fr",
    height: "auto",
    themeSystem: "standard",

    // Désactive les dates passées
    validRange: function () {
      return { start: new Date().toISOString().split("T")[0] };
    },

    // Coloration des jours réservés
    events: reservedDates.map((date) => ({
      start: date,
      end: date,
      display: "background",
      backgroundColor: "#660000",
      classNames: ["reserved-day"],
    })),

    // Sélection de date
    select: function (info) {
      const start = info.startStr;
      const end = info.endStr;

      // Vérifie si les dates sélectionnées sont valides
      const selectedDates = [];
      let current = new Date(info.start);
      const endDate = new Date(info.end);

      while (current < endDate) {
        const dateStr = current.toISOString().split("T")[0];
        selectedDates.push(dateStr);
        current.setDate(current.getDate() + 1);
      }

      // Vérifie si une des dates est réservée
      const hasReservedDate = selectedDates.some((d) =>
        reservedDates.includes(d)
      );

      if (hasReservedDate) {
        alert("⚠️ Une ou plusieurs dates sont déjà réservées.");
        calendar.unselect();
        return;
      }

      // Affiche la modale de réservation
      const modal = document.getElementById("reservationModal");
      const modalDates = document.getElementById("modal-dates");
      const confirmBtn = document.getElementById("res-confirm");

      modalDates.textContent = `Du ${start} au ${end}`;
      modal.style.display = "flex";

      confirmBtn.disabled = false;

      confirmBtn.onclick = () => {
        window.location.href = `/paiement.html?start=${start}&end=${end}`;
      };

      document.getElementById("res-cancel").onclick = () => {
        modal.style.display = "none";
      };
    },

    // Amélioration mobile : clic fluide
    dayCellDidMount: function (arg) {
      const dateStr = arg.date.toISOString().split("T")[0];
      const day = arg.el;

      // Désactiver les jours réservés
      if (reservedDates.includes(dateStr)) {
        day.style.pointerEvents = "none";
        day.classList.add("reserved-day");
      }

      // Empêche le clic sur les dates passées
      const today = new Date().toISOString().split("T")[0];
      if (dateStr < today) {
        day.style.pointerEvents = "none";
        day.style.opacity = "0.4";
      }
    },
  });

  calendar.render();
});
