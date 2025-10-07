function getTarif(date, nbPersonnes = 2) {
  // Tarif de base BLŌM par nuitée
  const base = 150;
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
    firstDay: 1, // lundi

    // 🔒 Bloquer dates passées et dates déjà réservées
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;

      // Interdire dates passées
      const today = new Date();
      today.setHours(0,0,0,0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        const rangeEndMinusOne = new Date(rangeEnd);
        rangeEndMinusOne.setDate(rangeEndMinusOne.getDate() - 1);

        // Interdire chevauchement, sauf si on commence pile le jour du départ
        if (start <= rangeEndMinusOne && end > rangeStart) {
          if (start.getTime() === rangeEnd.getTime()) continue;
          return false;
        }
      }
      return true;
    },

    select: async function (info) {
      const start = info.startStr;
      const end = info.endStr;

      // 🔹 Popup formulaire
      let nom = prompt("Votre nom ?");
      if (!nom) return;

      let email = prompt("Votre email ?");
      if (!email) return;

      let tel = prompt("Votre numéro de téléphone ?");
      if (!tel) return;

      let nbPersonnes = prompt("Nombre de personnes (max 2) ?");
      if (!nbPersonnes) return;
      nbPersonnes = parseInt(nbPersonnes);
      if (isNaN(nbPersonnes) || nbPersonnes < 1 || nbPersonnes > 2) {
        alert("Veuillez entrer un nombre valide (1 ou 2).");
        return;
      }

      // Calcul du prix total pour le séjour
      let cur = new Date(start);
      const fin = new Date(end);
      let total = 0;
      while (cur < fin) {
        total += getTarif(cur.toISOString().split("T")[0], nbPersonnes);
        cur.setDate(cur.getDate() + 1);
      }

      let montant = window.TEST_PAYMENT ? 1 : total;

      if (!confirm(
        `Réserver BLŌM du ${start} au ${end} pour ${montant} € pour ${nbPersonnes} personne(s) ?`
      )) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLOM",
            startDate: start,
            endDate: end,
            amount: montant,
            personnes: nbPersonnes,
            nom: nom,
            email: email,
            tel: tel
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
        reservedRanges = evts.map(e => ({
          start: e.start,
          end: e.end
        }));

        const fcEvents = evts.map(e => {
          const endDate = new Date(e.end);
          // On colorie jusqu'à la veille du départ
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
