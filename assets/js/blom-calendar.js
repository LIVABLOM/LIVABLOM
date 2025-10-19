document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const modalBg = document.querySelector('.modal-bg');
  const modalStart = document.getElementById('start-date');
  const modalEnd = document.getElementById('end-date');
  const modalPrice = document.getElementById('modal-price');
  const modalCancel = document.getElementById('modal-cancel');
  const modalConfirm = document.getElementById('modal-confirm');

  const reservedDates = ['2025-10-05', '2025-10-06', '2025-10-19', '2025-10-20'];

  const isReserved = dateStr => reservedDates.includes(dateStr);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isSelectable = date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= today && !isReserved(d.toISOString().split('T')[0]);
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    selectable: true,
    longPressDelay: 150,
    selectLongPressDelay: 150,
    height: 'auto',
    fixedWeekCount: false,
    showNonCurrentDates: false,

    events: reservedDates.map(date => ({
      start: date,
      end: date,
      display: 'background',
      color: '#a00'
    })),

    // Empêche sélection sur dates interdites
    selectAllow: function(selection) {
      const start = new Date(selection.start);
      const end = new Date(selection.end);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const ds = d.toISOString().split('T')[0];
        if (!isSelectable(d)) return false;
      }
      return true;
    },

    // Clic simple (mobile ou desktop)
    dateClick: function(info) {
      if (!isSelectable(info.date)) {
        alert('Date non disponible.');
        return;
      }

      // Sur mobile, le "drag" ne marche pas bien → sélection simple
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        openModal(info.dateStr, info.dateStr);
      }
    },

    // Sélection multiple (desktop)
    select: function(info) {
      if (!isSelectable(info.start)) return;
      openModal(info.startStr, info.endStr);
    }
  });

  calendar.render();

  /* === MODAL === */
  function openModal(start, end) {
    modalStart.value = start;
    modalEnd.value = end;
    updatePrice();
    modalBg.style.display = 'flex';
  }

  modalCancel.addEventListener('click', () => {
    modalBg.style.display = 'none';
  });

  modalConfirm.addEventListener('click', () => {
    alert(`Demande envoyée pour :\nDu ${modalStart.value} au ${modalEnd.value}`);
    modalBg.style.display = 'none';
  });

  function updatePrice() {
    const startDate = new Date(modalStart.value);
    const endDate = new Date(modalEnd.value);
    const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;
    const weekday = startDate.getDay();
    let price = 150;

    if (weekday === 0) price = 190;
    if (weekday === 5 || weekday === 6) price = 169;

    modalPrice.textContent = `Prix estimé : ${price * diff} €`;
  }
});
