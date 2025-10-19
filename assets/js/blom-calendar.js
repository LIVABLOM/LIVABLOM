document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    selectMirror: true,
    unselectAuto: true,
    displayEventTime: false,
    locale: 'fr',
    timeZone: 'local',
    height: '100%',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },

    // Empêche de sélectionner des dates passées
    validRange: {
      start: new Date()
    },

    // Réservations déjà prises
    events: [
      {
        start: '2025-10-24',
        end: '2025-10-26',
        display: 'background',
        color: '#ff0000'
      },
      {
        start: '2025-11-02',
        end: '2025-11-03',
        display: 'background',
        color: '#ff0000'
      }
    ],

    // ✅ Correction mobile : gestion améliorée du tap et du glisser
    selectAllow: function (selectionInfo) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectionInfo.start >= today;
    },

    // ✅ Clic unique sur mobile + desktop
    dateClick: function (info) {
      const date = info.date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (date < today) return; // Bloque les dates passées

      const reservedDates = calendar.getEvents().filter(e =>
        e.display === 'background' && date >= e.start && date < e.end
      );
      if (reservedDates.length > 0) return; // Bloque les dates déjà réservées

      openReservationModal(date, date);
    },

    // ✅ Glisser / sélection multiple sur mobile & desktop
    select: function (info) {
      const start = info.start;
      const end = new Date(info.end);
      end.setDate(end.getDate() - 1);

      openReservationModal(start, end);
    }
  });

  calendar.render();

  // ===== MODAL =====
  const modal = document.getElementById('reservationModal');
  const modalDates = document.getElementById('modal-dates');
  const modalPrice = document.getElementById('modal-price');
  const cancelBtn = document.getElementById('res-cancel');
  const confirmBtn = document.getElementById('res-confirm');

  const nameInput = document.getElementById('res-name');
  const emailInput = document.getElementById('res-email');
  const phoneInput = document.getElementById('res-phone');
  const personsInput = document.getElementById('res-persons');

  let startDate, endDate;

  function openReservationModal(start, end) {
    startDate = start;
    endDate = end;

    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedStart = start.toLocaleDateString('fr-FR', options);
    const formattedEnd = end.toLocaleDateString('fr-FR', options);

    modalDates.textContent =
      formattedStart === formattedEnd
        ? `Date : ${formattedStart}`
        : `Du ${formattedStart} au ${formattedEnd}`;

    // Calcul du prix
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const pricePerNight = 169; // par défaut
    const totalPrice = nights * pricePerNight;
    modalPrice.textContent = `Montant total : ${totalPrice} €`;

    confirmBtn.disabled = false;
    modal.style.display = 'flex';
  }

  cancelBtn.addEventListener('click', () => (modal.style.display = 'none'));

  confirmBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    if (!name || !email || !phone) {
      alert('Merci de remplir tous les champs.');
      return;
    }

    // ✅ Redirection Stripe conservée
    const nights = Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const totalPrice = nights * 169;
    const stripeURL = `https://buy.stripe.com/test_XXXXXX?amount=${totalPrice}&name=${encodeURIComponent(
      name
    )}&email=${encodeURIComponent(email)}&dates=${encodeURIComponent(
      startDate.toISOString()
    )}`;

    window.location.href = stripeURL;
  });
});
