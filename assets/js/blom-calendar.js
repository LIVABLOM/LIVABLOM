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
      selectMirror: true,
      dayMaxEvents: true,
      navLinks: true,
      dateClick: function(info) {
        info.jsEvent.preventDefault(); // bloque popup par défaut
        const clickedDate = info.dateStr;

        const isBlocked = events.some(ev => {
          const evStart = toISODate(ev.start);
          const evEnd = toISODate(ev.end);
          return clickedDate >= evStart && clickedDate < evEnd;
        });

        if (isBlocked) {
          alert("Cette date est déjà réservée !");
        } else {
          // Redirection vers le formulaire avec date et logement
          window.location.href = "reservation-form.html?date=" + clickedDate + "&logement=BLOM";
        }
      }
    });

    calendar.render();
  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
  }
});
