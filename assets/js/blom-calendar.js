function getTarif(date, nbPersonnes = 2) {
  const base = 150; // Tarif de base BLŌM par nuitée
  if (nbPersonnes <= 2) return base;
  return base + (nbPersonnes - 2) * 20;
}

document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("calendar");
  if (!el) return;

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  let reservedRanges = [];

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,

    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);

        // On réduit la fin de la réservation d’un jour
        const rangeEndMinusOne = new Date(rangeEnd);
        rangeEndMinusOne.setDate(rangeEndMinusOne.getDate() - 1);

        // Si la sélection chevauche une date réservée → interdit
        if (start <= rangeEndMinusOne && end > rangeStart) {
          // MAIS on autorise si la sélection commence pile le jour du départ
          if (start.getTime() === rangeEnd.getTime()) continue;
          return false;
        }
      }
      // On interdit les dates passées
      const today = new Date();
      today.setHours(0,0,0,0);
      if (start < today) return false;

      return true;
    },

    select: async function (info) {
      const start = info.startStr;
      const end = info.endStr;

      let nbPersonnes = prompt("Combien de personnes ?");
      if (!nbPersonnes) return;
      nbPersonnes = parseInt(nbPersonnes);
      if (isNaN(nbPersonnes) || nbPersonnes < 1) {
        alert("Veuillez entrer un nombre valide de personnes.");
        return;
      }

      let montant = window.TEST_PAYMENT ? 1 : getTarif(start, nbPersonnes);

      if (!confirm(`Réserver BLŌM du ${start} au ${end} pour ${montant} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLOM",
            startDate: start,
            endDate: end,
            amount: montant,
            personnes: nbPersonnes
          })
        });

        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la création de la réservation.");
      }
    },

    events: async function(fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();

        // On stocke les plages réservées
        reservedRanges = evts.map(e => ({
          start: e.start,
          end: e.end
        }));

        const fcEvents = evts.map(e => {
          const end = new Date(e.end);
          end.setDate(end.getDate()); // fin exclusive
          return {
            title: "Réservé",
            start: e.start,
            end: e.end,
            display: "background",
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            allDay: true
          };
        });

        success(fcEvents);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des événements :", err);
        failure(err);
      }
    }
  });

  cal.render();
});
