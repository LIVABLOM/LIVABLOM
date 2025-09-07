document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar-container");

  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const events = await res.json();

    const toISODate = (d) => {
      const x = new Date(d);
      const y = x.getFullYear();
      const m = String(x.getMonth() + 1).padStart(2, "0");
      const day = String(x.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    function getPriceForDate(date) {
      const day = date.getDay(); // 0=Dim, 1=Lun ... 6=Sam
      if (day === 0) return 190;            // Dimanche
      if (day === 5 || day === 6) return 169; // Vendredi & Samedi
      return 150;                           // Lun → Jeu
    }

    async function reserver(date, logement, nuits, prix) {
      try {
        const res = await fetch('https://livablom-stripe-production.up.railway.app/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, logement, nuits, prix })
        });

        const data = await res.json();
        window.location.href = data.url; // redirige vers Stripe Checkout
      } catch (err) {
        console.error(err);
        alert('Erreur lors de la réservation.');
      }
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
      events: events.map(ev => ({
        title: "Réservé",
        start: toISODate(ev.start),
        end: toISODate(ev.end),
        allDay: true,
        display: "block"
      })),
      displayEventTime: false,
      eventColor: "#e63946",
      selectable: true,
      dayMaxEvents: true,
      navLinks: true,
      dayCellDidMount: function(info) {
        if (info.view.type !== "dayGridMonth") return;
        const topEl = info.el.querySelector(".fc-daygrid-day-top");
        if (!topEl) return;
        const price = getPriceForDate(info.date);
        if (topEl.querySelector(".price-tag")) return;
        const priceEl = document.createElement("span");
        priceEl.className = "price-tag";
        priceEl.textContent = price + " €";
        topEl.appendChild(priceEl);
      }
    });

    calendar.render();

    // --- Modal de réservation ---
    const modal = document.getElementById('reservationModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalDateEl = document.getElementById('modalDate');
    const modalNightsInput = document.getElementById('modalNights');
    const modalPricePerNightEl = document.getElementById('modalPricePerNight');
    const modalTotalEl = document.getElementById('modalTotal');
    const modalPayBtn = document.getElementById('modalPayBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');

    function openModal(dateStr) {
      const pricePerNight = getPriceForDate(new Date(dateStr));
      modalDateEl.textContent = dateStr;
      modalNightsInput.value = 1;
      modalPricePerNightEl.textContent = pricePerNight;
      modalTotalEl.textContent = pricePerNight;
      modal.style.display = 'block';

      modalNightsInput.oninput = () => {
        const nights = parseInt(modalNightsInput.value) || 1;
        modalTotalEl.textContent = pricePerNight * nights;
      }

      modalCancelBtn.onclick = () => modal.style.display = 'none';

      modalPayBtn.onclick = async () => {
        const nuits = parseInt(modalNightsInput.value);
        const prix = pricePerNight * nuits;
        await reserver(dateStr, 'BLŌM', nuits, prix);
        modal.style.display = 'none';
      }
    }

    // Remplacer le clic sur la date
    calendar.setOption('dateClick', function(info) {
      const clickedDate = info.dateStr;
      const isBlocked = events.some(ev => {
        const evStart = toISODate(ev.start);
        const evEnd = toISODate(ev.end);
        return clickedDate >= evStart && clickedDate < evEnd;
      });

      if (isBlocked) {
        alert("Cette date est déjà réservée !");
      } else {
        openModal(clickedDate);
      }
    });

    // Forcer le clic sur le numéro du jour à agir comme une cellule complète
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('fc-daygrid-day-number')) {
        const cell = e.target.closest('.fc-daygrid-day');
        if (cell) {
          const dateStr = cell.getAttribute('data-date');
          if (dateStr) {
            calendar.trigger('dateClick', { date: new Date(dateStr), allDay: true, dayEl: cell, jsEvent: e });
          }
        }
      }
    });

  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
  }
});
