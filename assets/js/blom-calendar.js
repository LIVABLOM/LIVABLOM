// /assets/js/blom-calendar.js
// Script pour blom-calendar.html — ne modifie pas blom-calendar.html lui-même.

document.addEventListener('DOMContentLoaded', async () => {
  // éléments du DOM
  const calendarContainer = document.getElementById('calendar-container');
  const reservationModal = document.getElementById('reservationModal');
  const modalDateEl = document.getElementById('modalDate');
  const modalNights = document.getElementById('modalNights');
  const modalPricePerNight = document.getElementById('modalPricePerNight');
  const modalTotal = document.getElementById('modalTotal');
  const modalPayBtn = document.getElementById('modalPayBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');

  // stocke les réservations (ranges) pour vérifications
  let reservedRanges = []; // [{ start: "YYYY-MM-DD", end: "YYYY-MM-DD" }, ...]
  let fullCalendarEvents = []; // events pour FullCalendar
  let selectedDateStr = null;

  // Helper: format ISO date -> dd/mm/yyyy
  function formatDisplayDate(iso) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
  }

  // Prix selon jour de la semaine (0=Dimanche, 1=Lundi, ..., 6=Samedi)
  function getPriceForDate(dateObj) {
    const dow = dateObj.getDay();
    if (dow === 5 || dow === 6) return 169; // Vendredi, Samedi
    if (dow === 0) return 190; // Dimanche
    return 150; // Lundi -> Jeudi
  }

  // Récupère les réservations depuis le serveur
  async function loadReservations() {
    try {
      const res = await fetch('/api/reservations/BLOM');
      if (!res.ok) throw new Error('Erreur récupération réservations');
      const events = await res.json();

      reservedRanges = [];
      fullCalendarEvents = [];

      (events || []).forEach(ev => {
        // ev.start / ev.end peuvent être string ISO ou objets Date
        const start = (ev.start && typeof ev.start === 'string') ? ev.start.split('T')[0] : (ev.start instanceof Date ? ev.start.toISOString().split('T')[0] : null);
        const end = (ev.end && typeof ev.end === 'string') ? ev.end.split('T')[0] : (ev.end instanceof Date ? ev.end.toISOString().split('T')[0] : null);

        if (start && end) {
          reservedRanges.push({ start, end }); // end is exclusive per server logic
          fullCalendarEvents.push({
            title: ev.summary || 'Réservé',
            start,
            end,
            allDay: true,
            display: 'auto',
            backgroundColor: '#e63946',
            borderColor: '#e63946',
            textColor: '#fff'
          });
        }
      });
    } catch (err) {
      console.error('Impossible de charger les réservations :', err);
      reservedRanges = [];
      fullCalendarEvents = [];
    }
  }

  // Vérifie si une date ISO (YYYY-MM-DD) est dans une réservation existante
  function isDateReserved(isoDate) {
    const dt = new Date(isoDate + 'T00:00:00');
    for (const r of reservedRanges) {
      const start = new Date(r.start + 'T00:00:00');
      const end = new Date(r.end + 'T00:00:00'); // end est exclusif
      if (dt >= start && dt < end) return true;
    }
    return false;
  }

  // Calcul total
  function updateTotal() {
    const nights = parseInt(modalNights.value, 10) || 1;
    const pricePerNight = parseInt(modalPricePerNight.dataset.price || modalPricePerNight.innerText, 10) || 0;
    const total = pricePerNight * nights;
    modalTotal.innerText = total;
    modalTotal.dataset.total = total;
  }

  // Insère champ email dans le modal s'il n'existe pas (on évite modifier l'HTML original)
  function ensureEmailField() {
    if (document.getElementById('modalEmail')) return;
    const container = document.getElementById('reservationModalContent');
    const emailLabel = document.createElement('label');
    emailLabel.innerText = 'Votre email :';
    emailLabel.setAttribute('for', 'modalEmail');
    emailLabel.style.display = 'block';
    emailLabel.style.marginTop = '8px';

    const emailInput = document.createElement('input');
    emailInput.id = 'modalEmail';
    emailInput.type = 'email';
    emailInput.placeholder = 'prenom@exemple.com';
    emailInput.style.width = '100%';
    emailInput.style.padding = '6px';
    emailInput.style.margin = '6px 0 12px';
    emailInput.style.borderRadius = '6px';
    emailInput.style.border = 'none';

    // insert before the Pay/Cancel buttons
    const buttons = modalPayBtn.parentNode;
    container.insertBefore(emailLabel, buttons);
    container.insertBefore(emailInput, buttons);
  }

  // Ouvre le modal et le pré-remplit
  function openModalForDate(isoDate) {
    if (isDateReserved(isoDate)) {
      alert('Désolé, cette date est déjà réservée.');
      return;
    }
    selectedDateStr = isoDate;
    modalDateEl.innerText = formatDisplayDate(isoDate);

    // calcul prix par nuit selon le jour
    const pricePerNight = getPriceForDate(new Date(isoDate + 'T00:00:00'));
    modalPricePerNight.innerText = pricePerNight;
    modalPricePerNight.dataset.price = pricePerNight;

    modalNights.value = 1;
    updateTotal();

    ensureEmailField();

    // show modal
    reservationModal.style.display = 'flex';
  }

  // Fermeture modal
  function closeModal() {
    reservationModal.style.display = 'none';
  }

  // Initialisation FullCalendar et handlers
  async function initCalendar() {
    await loadReservations();

    const calendar = new FullCalendar.Calendar(calendarContainer, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      height: 'auto',
      events: fullCalendarEvents,
      dateClick: function(info) {
        const clickedISO = info.dateStr; // YYYY-MM-DD
        // si la case cliquée contient un événement (réservé), isDateReserved le gère
        openModalForDate(clickedISO);
      },
      // Affiche le prix par nuit dans la case (FullCalendar v6 -> dayCellDidMount)
      dayCellDidMount: function(info) {
        // retirer éventuel price-tag déjà présent
        const existing = info.el.querySelector('.price-tag');
        if (existing) existing.remove();

        // afficher le prix
        const price = getPriceForDate(info.date);
        const dayNumber = info.el.querySelector('.fc-daygrid-day-number');
        if (dayNumber) {
          const span = document.createElement('span');
          span.className = 'price-tag';
          span.innerText = `${price} €`;
          span.style.display = 'block';
          span.style.fontSize = '0.8rem';
          span.style.color = '#aaa';
          span.style.marginTop = '2px';
          dayNumber.appendChild(span);
        }
      },
      // empêcher de sélectionner des zones déjà réservées via dragging/selection
      selectable: false,
    });

    calendar.render();

    // Met à jour le calendrier si on recharge les réservations (utile après tests)
    window.blomCalendarReload = async function() {
      await loadReservations();
      calendar.removeAllEventSources();
      calendar.addEventSource(fullCalendarEvents);
      calendar.render();
    };
  }

  // Boutons modal : calcul total à chaque changement de nuits
  modalNights.addEventListener('input', updateTotal);

  modalCancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });

  // Paiement : envoie au serveur et redirection vers Stripe
  modalPayBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const nights = parseInt(modalNights.value, 10) || 1;
    const total = parseInt(modalTotal.dataset.total || modalTotal.innerText, 10) || 0;
    const emailInput = document.getElementById('modalEmail');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!selectedDateStr) {
      alert('Date invalide.');
      return;
    }
    if (!email) {
      alert('Merci de renseigner votre email.');
      return;
    }

    // double-vérif que la date n'a pas été réservée entre-temps
    if (isDateReserved(selectedDateStr)) {
      alert('Désolé, cette date vient d’être réservée par un autre client.');
      closeModal();
      return;
    }

    const payload = {
      date: selectedDateStr,
      logement: 'BLOM',
      nuits: nights,
      prix: total,
      email: email
    };

    modalPayBtn.disabled = true;
    modalPayBtn.innerText = 'Ouverture Stripe...';

    try {
      const res = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error('Erreur serveur création session Stripe: ' + (text || res.status));
      }

      const data = await res.json();
      if (data && data.url) {
        // redirection vers Stripe Checkout (ne rien exécuter après)
        window.location.href = data.url;
      } else {
        throw new Error('Pas d\'URL Stripe renvoyée');
      }
    } catch (err) {
      console.error('Erreur lors de la création de la session Stripe :', err);
      alert('Impossible de démarrer le paiement. Regarde la console pour plus d\'infos.');
      modalPayBtn.disabled = false;
      modalPayBtn.innerText = 'Payer';
    }
  });

  // click hors du modal pour fermer (optionnel)
  reservationModal.addEventListener('click', (e) => {
    if (e.target === reservationModal) closeModal();
  });

  // Init
  await initCalendar();
});
