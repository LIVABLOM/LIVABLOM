function getTarif(date, nbPersonnes = 2) {
  // Tarif de base : 79€ pour 2 personnes
  const base = 79;
  if (nbPersonnes <= 2) return base;
  // +20€ par personne supplémentaire
  return base + (nbPersonnes - 2) * 20;
}

document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("calendar");
  if (!el) return;

  // 🔹 Backends séparés (proxy calendrier et backend Stripe)
  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  // Liste des périodes réservées
  let reservedRanges = [];

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1, // Lundi

    // 🔹 Vérifie si la date sélectionnée chevauche une période réservée
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;
      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        if (start < rangeEnd && end > rangeStart) {
          // Chevauchement : réservation interdite
          return false;
        }
      }
      return true;
    },

    select: async function (info) {
      const start = info.startStr;
      const end = info.endStr;

      // 🔸 Demande du nombre de personnes
      let nbPersonnes = prompt("Combien de personnes ?");
      if (!nbPersonnes) return;
      nbPersonnes = parseInt(nbPersonnes);
      if (isNaN(nbPersonnes) || nbPersonnes < 1) {
        alert("Veuillez entrer un nombre valide de personnes.");
        return;
      }

      // 🔸 Calcul du tarif total (79€ pour 2 personnes, +20€/personne supplémentaire)
      let montant = window.TEST_PAYMENT ? 1 : getTarif(start, nbPersonnes);

      // 🔸 Confirmation utilisateur
      if (!confirm(`Réserver LIVA du ${start} au ${end} pour ${montant} € ?`)) return;

      // 🔸 Envoi vers le backend Stripe
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
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert("Impossible de créer la réservation.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la création de la réservation.");
      }
    },

    // 🔹 Récupération des réservations (Airbnb/Booking)
    events: async function (fetchInfo, success, failure) {
      console.log("📡 Chargement des événements depuis le backend LIVA...");
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();
        console.log("📅 Événements récupérés :", evts);

        // Stocke les périodes réservées pour bloquer la sélection
        reservedRanges = evts.map(e => ({
          start: e.start,
          end: e.end
        }));

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
