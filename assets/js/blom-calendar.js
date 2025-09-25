// public/assets/js/blom-calendar.js
document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar-container');

  // --- FullCalendar ---
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    selectable: true,
    selectMirror: true,
    select: function (info) {
      // Affiche modal réservation
      const modal = document.getElementById('reservationModal');
      const modalDate = document.getElementById('modalDate');
      const modalNights = document.getElementById('modalNights');
      const modalPrice = document.getElementById('modalPricePerNight');
      const modalTotal = document.getElementById('modalTotal');

      const pricePerNight = 169; // Par défaut, peut être dynamique selon jour
      modalDate.innerText = info.startStr;
      modalNights.value = 1;
      modalPrice.innerText = pricePerNight;
      modalTotal.innerText = pricePerNight;

      modal.style.display = 'flex';

      // Mise à jour total si changement nuits
      modalNights.oninput = () => {
        const nuits = parseInt(modalNights.value || 1, 10);
        modalTotal.innerText = pricePerNight * nuits;
      };
    },
    eventColor: '#e63946',
    events: `/api/reservations/BLOM`, // Récupère toutes les réservations locales + iCal externes
  });

  calendar.render();

  // --- Modal ---
  const modal = document.getElementById('reservationModal');
  const btnCancel = document.getElementById('modalCancelBtn');
  btnCancel.onclick = () => { modal.style.display = 'none'; };

  // --- Paiement Stripe ---
  const payBtn = document.getElementById('modalPayBtn');
  payBtn.onclick = async () => {
    const nights = parseInt(document.getElementById('modalNights').value, 10);
    const total = parseFloat(document.getElementById('modalTotal').innerText);
    const date = document.getElementById('modalDate').innerText;
    const logement = 'BLŌM'; // ou LIVA selon la page

    try {
      const response = await fetch("https://livablom-stripe-production.up.railway.app/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logement, nuits: nights, total, date })
      });

      const session = await response.json();

      if (session.url) {
        window.location.href = session.url; // Redirection Stripe
      } else {
        alert("Erreur : impossible de créer la session de paiement.");
        console.error(session);
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Problème de connexion avec le serveur de paiement.");
    }
  };
});
