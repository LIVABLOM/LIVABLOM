document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar-container');

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    firstDay: 1,
    events: async function (fetchInfo, successCallback, failureCallback) {
      try {
        const response = await fetch(
          'https://livablom-stripe-production.up.railway.app/api/reservations/LIVA'
        );
        const data = await response.json();

        const events = data.map(ev => ({
          title: ev.summary || 'Réservé',
          start: ev.start,
          end: ev.end,
          allDay: true,
          color: '#e63946'
        }));

        successCallback(events);
      } catch (err) {
        console.error('Erreur chargement réservations LIVA :', err);
        failureCallback(err);
      }
    },
    dateClick: function (info) {
      const modal = document.getElementById('reservationModal');
      const modalDate = document.getElementById('modalDate');
      const modalPricePerNight = document.getElementById('modalPricePerNight');
      const modalNights = document.getElementById('modalNights');
      const modalTotal = document.getElementById('modalTotal');

      // 💰 Tarifs LIVA (exemple, adapte selon tes vrais prix)
      let price = 120; // par défaut
      const day = new Date(info.dateStr).getDay();

      if (day === 5 || day === 6) price = 150; // vendredi/samedi
      else if (day === 0) price = 130; // dimanche

      modalDate.textContent = info.dateStr;
      modalPricePerNight.textContent = price;
      modalNights.value = 1;
      modalTotal.textContent = price;

      modal.style.display = 'flex';

      modalNights.oninput = () => {
        modalTotal.textContent = modalNights.value * price;
      };

      document.getElementById('modalCancelBtn').onclick = () => {
        modal.style.display = 'none';
      };

      document.getElementById('modalPayBtn').onclick = async () => {
        try {
          const res = await fetch(
            'https://livablom-stripe-production.up.railway.app/create-checkout-session',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                date: info.dateStr,
                logement: 'LIVA',
                nuits: parseInt(modalNights.value, 10),
                prix: price,
                email: 'client@example.com'
              })
            }
          );

          const data = await res.json();

          if (data.url) {
            window.location.href = data.url;
          }
        } catch (err) {
          console.error('Erreur Stripe LIVA :', err);
          alert('Impossible de créer la réservation.');
        }
      };
    }
  });

  calendar.render();
});
