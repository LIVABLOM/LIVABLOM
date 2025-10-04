function getTarif(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  if (day === 0) return 190;      // Dimanche
  if (day === 5 || day === 6) return 169; // Vendredi & Samedi
  return 150;                     // Lundi-Jeudi
}

document.addEventListener("DOMContentLoaded", function() {
  const el = document.getElementById("calendar");
  if (!el) return;

  // 🔹 Backends séparés
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
    firstDay: 1, // Lundi

    // 🔹 Sélection d'une date pour paiement
    select: async function(info) {
      const start = info.startStr;
      const end = info.endStr;
      let total = 0;
      let cur = new Date(start);
      const fin = new Date(end);

      while (cur < fin) {
        total += getTarif(cur.toISOString().split("T")[0]);
        cur.setDate(cur.getDate() + 1);
      }

      const montant = window.TEST_PAYMENT ? 1 : total;
      if (!confirm(`Réserver BLŌM du ${start} au ${end} pour ${montant} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLOM",
            startDate: start,
            endDate: end,
            amount: montant
          }),
        });

        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la création de la réservation.");
      }
    },

    // 🔹 Chargement des événements depuis le backend
    events: async function(fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();
        console.log("📅 Événements récupérés :", evts);

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
      } catch (err) {
        console.error("❌ Erreur lors du chargement des événements :", err);
        failure(err);
      }
    }
  });

  cal.render();
});
