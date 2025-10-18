document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");

  const cal = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    selectable: true,
    selectMirror: true,
    locale: "fr",
    firstDay: 1,
    height: "100%",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek",
    },

    // 📅 Exemple d'événements bloqués
    events: [
      { start: "2025-10-12", end: "2025-10-14", display: "background", color: "#800" },
      { start: "2025-10-20", end: "2025-10-22", display: "background", color: "#800" },
    ],

    // ✅ Quand une plage est sélectionnée
    select: function (info) {
      const start = info.startStr;
      const end = new Date(info.end);
      end.setDate(end.getDate() - 1); // ajuster pour affichage inclusif

      const modal = document.getElementById("reservationModal");
      const modalDates = document.getElementById("modal-dates");
      const modalPrice = document.getElementById("modal-price");
      const confirmBtn = document.getElementById("res-confirm");

      modalDates.textContent = `Du ${start} au ${end.toISOString().split("T")[0]}`;

      // 💰 Calcul du prix simple
      const nights = (info.end - info.start) / (1000 * 60 * 60 * 24);
      const pricePerNight = 169;
      modalPrice.textContent = `Montant total : ${nights * pricePerNight} €`;

      modal.style.display = "flex";

      // Validation de formulaire simple
      const name = document.getElementById("res-name");
      const email = document.getElementById("res-email");

      function checkForm() {
        confirmBtn.disabled = !(name.value && email.value);
      }

      name.addEventListener("input", checkForm);
      email.addEventListener("input", checkForm);

      document.getElementById("res-cancel").onclick = () => {
        modal.style.display = "none";
        cal.unselect();
      };

      confirmBtn.onclick = () => {
        alert("Réservation envoyée !");
        modal.style.display = "none";
        cal.unselect();
      };
    },
  });

  cal.render();

  // ✅ FIX MOBILE TAP SELECTION + PRÉSERVE DRAG SUR DESKTOP
  let touchStartTime = 0;

  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return; // uniquement tactile
    touchStartTime = Date.now();
  });

  document.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "touch") return; // uniquement tactile
    const duration = Date.now() - touchStartTime;

    // Si le doigt est resté peu de temps (tap simple, pas glissement)
    if (duration < 300) {
      const dayCell = e.target.closest(".fc-daygrid-day");
      if (!dayCell) return;
      const dateStr = dayCell.getAttribute("data-date");
      if (!dateStr) return;

      const start = new Date(dateStr);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      cal.select({ start, end, allDay: true });
    }
  });
});
