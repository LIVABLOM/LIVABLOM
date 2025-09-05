document.addEventListener("DOMContentLoaded", async () => {
  const calendarEl = document.getElementById("calendar-container");

  try {
    // 🔗 Charger les réservations depuis ton API
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const events = await res.json();

    // Helper pour formater les dates en YYYY-MM-DD
    const toISODate = (d) => {
      const x = new Date(d);
      const y = x.getFullYear();
      const m = String(x.getMonth() + 1).padStart(2, "0");
      const day = String(x.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    // 🎨 Initialiser le calendrier
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek"
      },
      events: events.map(ev => ({
        title: "Réservé",
        start: toISODate(ev.start),
        end: toISODate(ev.end),
        allDay: true,
        display: "block"
      })),
      displayEventTime: false,
      eventColor: "#e63946",   // 🔴 tes réservations en rouge
      selectable: true,        // ✅ cellule entière cliquable
      selectMirror: true,
      dayMaxEvents: true,
      navLinks: true,

      // 📅 Gérer le clic sur une date
      dateClick: function(info) {
        const clickedDate = info.dateStr;

        // Vérifier si la date est déjà réservée
        const isBlocked = events.some(ev => {
          const evStart = toISODate(ev.start);
          const evEnd = toISODate(ev.end);
          return clickedDate >= evStart && clickedDate < evEnd;
        });

        if (isBlocked) {
          alert("❌ Cette date est déjà réservée !");
        } else {
          // 👉 Ici, tu peux rediriger vers ton formulaire de réservation
          // Exemple : envoi direct vers une page avec la date choisie
          window.location.href = `/reservation-form.html?date=${clickedDate}&logement=BLOM`;

          // Pour tester sans formulaire, tu peux garder l'alert :
          // alert("✅ Date sélectionnée : " + clickedDate);
        }
      }
    });

    calendar.render();
  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier. Vérifie la connexion au serveur.");
  }
});
