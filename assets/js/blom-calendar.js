document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.getElementById("calendar");
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const modalPrice = document.getElementById("modal-price");
  const nameInput = document.getElementById("res-name");
  const emailInput = document.getElementById("res-email");
  const phoneInput = document.getElementById("res-phone");
  const personsInput = document.getElementById("res-persons");
  const cancelBtn = document.getElementById("res-cancel");
  const confirmBtn = document.getElementById("res-confirm");

  let startDate = null;
  let endDate = null;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    selectMirror: true,
    longPressDelay: 50, // rend le tap plus réactif sur mobile
    unselectAuto: false,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek",
    },
    validRange: {
      start: new Date(),
    },
    select: function (info) {
      startDate = info.start;
      endDate = new Date(info.end.getTime() - 86400000); // corrige la date de fin (exclusive)
      openModal();
    },
    events: [
      {
        title: "Occupé",
        start: "2025-10-25",
        end: "2025-10-27",
        display: "background",
        color: "#900",
      },
    ],
  });

  calendar.render();

  // ✅ Correction mobile : permet la sélection d’un seul jour avec un simple tap
  calendarEl.addEventListener("touchend", function (e) {
    const targetCell = e.target.closest(".fc-daygrid-day");
    if (targetCell) {
      const dateStr = targetCell.getAttribute("data-date");
      if (dateStr) {
        const date = new Date(dateStr);
        startDate = date;
        endDate = date;
        openModal();
      }
    }
  });

  function openModal() {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const start = startDate.toLocaleDateString("fr-FR", options);
    const end = endDate.toLocaleDateString("fr-FR", options);
    const sameDay = startDate.getTime() === endDate.getTime();

    modalDates.textContent = sameDay
      ? `Date : ${start}`
      : `Du ${start} au ${end}`;

    const nights = sameDay
      ? 1
      : Math.round((endDate - startDate) / 86400000) + 1;

    let pricePerNight = 150;
    const day = startDate.getDay();
    if (day === 0) pricePerNight = 190; // dimanche
    else if (day === 5 || day === 6) pricePerNight = 169; // vendredi/samedi

    const totalPrice = pricePerNight * nights;
    modalPrice.textContent = `Montant total : ${totalPrice} €`;

    modal.style.display = "flex";
    confirmBtn.disabled = true;
  }

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
  });

  [nameInput, emailInput, phoneInput].forEach((input) => {
    input.addEventListener("input", () => {
      confirmBtn.disabled = !(
        nameInput.value.trim() &&
        emailInput.value.trim() &&
        phoneInput.value.trim()
      );
    });
  });

  confirmBtn.addEventListener("click", () => {
    alert("Réservation enregistrée ! (simulation)");
    modal.style.display = "none";
  });
});
