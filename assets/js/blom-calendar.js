document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');

  const reservedDates = [
    '2025-10-05', '2025-10-06',
    '2025-10-19', '2025-10-20'
  ]; // exemple, remplace par ton vrai tableau de réservations

  // Fonction pour vérifier si une date est réservée
  const isReserved = (dateStr) => reservedDates.includes(dateStr);

  // Fonction pour bloquer les dates passées et réservées
  const isSelectable = (date) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const current = new Date(date);
    current.setHours(0,0,0,0);
    return current >= today && !isReserved(date.toISOString().split('T')[0]);
  };

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    selectable: true,
    unselectAuto: true,
    longPressDelay: 150,   // améliore la réactivité sur mobile
    selectLongPressDelay: 150,
    height: 'auto',
    fixedWeekCount: false,
    showNonCurrentDates: false,

    // Événements réservés (en rouge)
    events: reservedDates.map(date => ({
      start: date,
      end: date,
      display: 'background',
      color: '#a00'
    })),

    // Empêche la sélection de dates passées / réservées
    selectAllow: function(selectionInfo) {
      const start = selectionInfo.start;
      const end = selectionInfo.end;
      const today = new Date();
      today.setHours(0,0,0,0);

      // Vérifie si une date réservée se trouve dans la sélection
      let valid = true;
      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (isReserved(dateStr) || d < today) {
          valid = false;
          break;
        }
      }
      return valid;
    },

    // Correction tactile pour mobile
    dateClick: function(info) {
      const dateStr = info.dateStr;
      if (!isSelectable(info.date)) return; // ignore clic si date non valide
      // Sur mobile, on ne “glisse” pas bien → on va gérer les clics unitaires
      openModal(dateStr, dateStr);
    },

    // Sélection de plusieurs jours (desktop)
    select: function(info) {
      if (!isSelectable(info.start)) return;
      openModal(info.startStr, info.endStr);
    }
  });

  calendar.render();

  /* ====== Modal ====== */
  const modalBg = document.querySelector('.modal-bg');
  const modalStart = document.getElementById('start-date');
  const modalEnd = document.getElementById('end-date');
  const modalPrice = document.getElementById('modal-price');
  const modalCancel = document.getElementById('modal-cancel');
  const modalConfirm = document.getElementById('modal-confirm');

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

  // Calcul automatique du prix selon le jour
  function updatePrice() {
    const startDate = new Date(modalStart.value);
    const endDate = new Date(modalEnd.value);
    const diff = Math.ceil((endDate - startDate) / (1000*60*60*24)) || 1;
    const weekday = startDate.getDay();
    let price = 150; // base semaine

    if (weekday === 0) price = 190; // dimanche
    if (weekday === 5 || weekday === 6) price = 169; // vendredi/samedi

    modalPrice.textContent = `Prix estimé : ${price * diff} €`;
  }
});
