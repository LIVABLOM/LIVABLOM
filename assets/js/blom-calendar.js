function getTarif(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  if(day === 0) return 190;      // Dimanche
  if(day === 5 || day === 6) return 169; // Vendredi & Samedi
  return 150;                     // Autres jours
}

document.addEventListener("DOMContentLoaded", function() {
  const el = document.getElementById("calendar");
  if(!el) return;

  const backendUrl = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,

    select: async info => {
      const start = info.startStr, end = info.endStr;
      let total = 0, cur = new Date(start), fin = new Date(end);
      while(cur < fin) {
        total += getTarif(cur.toISOString().split("T")[0]);
        cur.setDate(cur.getDate() + 1);
      }

      let montant = window.TEST_PAYMENT ? 1 : total;
      if(!confirm(`Réserver BLŌM du ${start} au ${end} pour ${montant} € ?`)) return;

      try {
        const res = await fetch(`${backendUrl}/api/checkout`, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ logement:"BLOM", startDate:start, endDate:end, amount:montant })
        });
        const data = await res.json();
        if(data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch(err) {
        console.error(err);
        alert("Erreur lors de la création de la réservation.");
      }
    },

    events: async (fetchInfo, success, failure) => {
      try {
        const res = await fetch(`${backendUrl}/api/reservations/BLOM?ts=${Date.now()}`);
        if(!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();

        console.log("Événements récupérés:", evts); // debug

        const fcEvents = evts.map(e => ({
          start: e.start,
          end: e.end,
          display: "background",
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          title: e.title || "Réservé",
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
