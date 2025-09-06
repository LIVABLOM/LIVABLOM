document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar-container");

  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const events = await res.json();

    const toISODate = (d) => {
      const x = new Date(d);
      const y = x.getFullYear();
      const m = String(x.getMonth()+1).padStart(2,"0");
      const day = String(x.getDate()).padStart(2,"0");
      return `${y}-${m}-${day}`;
    };

    // Fonction qui retourne le prix selon le jour de la semaine
    function getPriceForDate(date) {
      const day = date.getDay(); // 0=Dim, 1=Lun...
      if (day === 0) return 190; // Dimanche
      if (day === 5 || day === 6) return 169; // Ven-Sam
      return 150; // Lun-Jeu
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
        const dateObj = new Date(info.date);
        const price = getPriceForDate(dateObj);
        const priceEl = document.createElement("span");
        priceEl.classList.add("price-tag");
        priceEl.innerText = price + " €";
        info.el.querySelector(".fc-daygrid-day-number").after(priceEl);
      },
      dateClick: function(info) {
        const clickedDate = info.dateStr;

        // Vérifie si la date est déjà réservée
        const isBlocked = events.some(ev => {
          const evStart = toISODate(ev.start);
          const evEnd = toISODate(ev.end);
          return clickedDate >= evStart && clickedDate < evEnd;
        });

        if (isBlocked) {
          alert("Cette date est déjà réservée !");
        } else {
          // Redirection vers formulaire avec prix inclus
          window.location.href = `/reservation-form.html?date=${clickedDate}&logement=BLOM`;
        }
      }
    });

    calendar.render();
  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
  }
});
