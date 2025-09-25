document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar-container');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    height: 'auto',
    headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const res = await fetch(`/api/reservations/BLOM`);
        const data = await res.json();
        successCallback(data);
      } catch (err) {
        console.error('Erreur chargement réservations:', err);
        failureCallback(err);
      }
    },
    dateClick: function (info) {
      alert(`Clique sur une date : ${info.dateStr}`);
      // ici on peut ouvrir modal pour réservation
    }
  });

  calendar.render();
});
