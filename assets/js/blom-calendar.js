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

    // Prix par jour
    function getPriceForDate(date) {
      const day = date.getDay(); // 0=Dim, 1=Lun ... 6=Sam
      if (day === 0) return 190;            // Dimanche
      if (day === 5 || day === 6) return 169; // Vendredi & Samedi
      return 150;                           // Lundi à Jeudi
    }

    // Fonction pour appeler Stripe
    async function reserver(date, logement, nuits, prix) {
      try {
        const res = await fetch('https://TON-SERVER-STRIPE-URL/create-checkout-session', {
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

      // Prix affichés sous le numéro de jour
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
      },

      // Toute la cellule cliquable
      dateClick: function(info) {
        info.jsEvent.preventDefault();
        const clickedDate = info.dateStr;

        const isBlocked = events.some(ev => {
          const evStart = toISODate(ev.start);
          const evEnd = toISODate(ev.end);
          return clickedDate >= evStart && clickedDate < evEnd;
        });

        if (isBlocked) {
          alert("Cette date est déjà réservée !");
        } else {
          const nuits = parseInt(prompt("Combien de nuits ?", "1"));
          if (!nuits || nuits <= 0) {
            alert("Veuillez saisir un nombre de nuits valide !");
            return;
          }
          const prix = getPriceForDate(new Date(clickedDate)) * nuits;
          reserver(clickedDate, 'BLŌM', nuits, prix);
        }
      }
    });

    calendar.render();

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
