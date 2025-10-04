function getTarif(date, nbPersonnes = 2) {
  const base = 79; // 2 personnes
  return nbPersonnes <= 2 ? base : base + (nbPersonnes - 2) * 20;
}

document.addEventListener("DOMContentLoaded", function() {
  const el = document.getElementById("calendar");
  if (!el) return;

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,

    select: async function(info) {
      const start = info.startStr;
      const end = info.endStr;
      let montant = window.TEST_PAYMENT ? 1 : getTarif(start, 2);

      if (!confirm(`Réserver LIVA du ${start} au ${end} pour ${montant} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logement:"LIVA", startDate:start, endDate:end, amount:montant })
        });
        const data = await res.json();
        if(data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch(err) {
        console.error(err);
        alert("Erreur lors de la création de la réservation.");
      }
    },

    events: async function(fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if(!res.ok) throw new Error("Erreur serveur");
        const evts = await res.json();

        const fcEvents = evts.map(e => ({
          title: e.title || "Réservé",
          start: e.start,
          end: e.end,
          display: "background",
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          allDay: true
        }));

        success(fcEvents);
      } catch(err) {
        console.error(err);
        failure(err);
      }
    }
  });

  cal.render();
});
