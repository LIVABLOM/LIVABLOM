function getTarif(date, nbPersonnes = 2) {
  const base = 79;
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
    unselectAuto: false,
    selectMirror: true,
    selectLongPressDelay: 0, // 📱 active la sélection immédiate sur mobile
    longPressDelay: 0,
    firstDay: 1, // lundi

    // 🔒 Interdire sélection de dates passées et dates réservées
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false; // pas avant aujourd'hui

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        rangeEnd.setDate(rangeEnd.getDate() - 1); // fin exclusive

        // Si chevauchement, interdit sauf si commence pile le jour du départ
        if (start <= rangeEnd && end > rangeStart) {
          if (start.getTime() === rangeEnd.getTime()) continue;
          return false;
        }
      }
      return true;
    },

    select: async function (info) {
      const start = info.startStr;
      const end = info.endStr;

      let nbPersonnes = prompt("Combien de personnes pour tout le séjour ?");
      if (!nbPersonnes) return;
      nbPersonnes = parseInt(nbPersonnes);
      if (isNaN(nbPersonnes) || nbPersonnes < 1) {
        alert("Veuillez entrer un nombre valide de personnes.");
        return;
      }

      // Calcul du prix total pour tout le séjour
      let cur = new Date(start);
      const fin = new Date(end);
      let total = 0;
      while (cur < fin) {
        total += getTarif(cur.toISOString().split("T")[0], nbPersonnes);
        cur.setDate(cur.getDate() + 1);
      }

      let montant = window.TEST_PAYMENT ? 1 : total;

      if (!confirm(`Réserver LIVA du ${start} au ${end} pour ${montant} € pour ${nbPersonnes} personne(s) ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "LIVA",
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

    events: async function (fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();
        reservedRanges = evts.map(e => ({
          start: e.start,
          end: e.end
        }));

        const fcEvents = evts.map(e => {
          const endDate = new Date(e.end);
          endDate.setDate(endDate.getDate() - 1);
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
