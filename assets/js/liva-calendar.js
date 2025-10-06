function getTarif(date, nbPersonnes = 2) {
  const base = 79; // Tarif de base LIVA pour 2 personnes
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
    selectMirror: true,

    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;

      const today = new Date();
      today.setHours(0,0,0,0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        const rangeEndMinusOne = new Date(rangeEnd);
        rangeEndMinusOne.setDate(rangeEndMinusOne.getDate() - 1);

        if (start <= rangeEndMinusOne && end > rangeStart) {
          if (start.getTime() === rangeEnd.getTime()) continue;
          return false;
        }
      }
      return true;
    },

    dateClick: async function(info) {
      const start = info.dateStr;

      // 🔒 Bloquer les dates passées
      const today = new Date();
      today.setHours(0,0,0,0);
      const clickedDate = new Date(start);
      if (clickedDate < today) return;

      // 🔒 Bloquer les dates déjà réservées
      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        if (clickedDate >= rangeStart && clickedDate < rangeEnd) return;
      }

      // Nombre de personnes
      let nbPersonnes = prompt("Combien de personnes ?");
      if (!nbPersonnes) return;
      nbPersonnes = parseInt(nbPersonnes);
      if (isNaN(nbPersonnes) || nbPersonnes < 1) {
        alert("Veuillez entrer un nombre valide de personnes.");
        return;
      }

      // Date de fin
      let end = prompt("Date de fin (YYYY-MM-DD) ?");
      if (!end) return;

      const startDate = new Date(start);
      const endDate = new Date(end);
      if (endDate <= startDate) {
        alert("La date de fin doit être après la date de début.");
        return;
      }

      // Calcul du tarif total
      let total = 0;
      let cur = new Date(startDate);
      while (cur < endDate) {
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

    events: async function(fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();
        reservedRanges = evts.map(e => ({ start: e.start, end: e.end }));

        const fcEvents = evts.map(e => ({
          title: "Réservé",
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
