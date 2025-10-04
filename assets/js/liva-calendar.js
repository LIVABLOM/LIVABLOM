function getTarif(basePrice, nbPersonnes) {
  // 🔹 79 € minimum pour 2 personnes
  if (nbPersonnes <= 2) return basePrice;
  const suppl = (nbPersonnes - 2) * 20; // +20 € / pers / nuit
  return basePrice + suppl;
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

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,

    select: async function (info) {
      const start = info.startStr;
      const end = info.endStr;

      const nbPersonnes = parseInt(
        prompt("Combien de personnes séjourneront ?", "2"),
        10
      );
      if (isNaN(nbPersonnes) || nbPersonnes < 1) return alert("Nombre invalide.");

      let total = 0;
      let cur = new Date(start);
      let fin = new Date(end);

      while (cur < fin) {
        total += getTarif(79, nbPersonnes);
        cur.setDate(cur.getDate() + 1);
      }

      const montant = window.TEST_PAYMENT ? 1 : total;

      if (
        !confirm(
          `Réserver LIVA du ${start} au ${end} pour ${nbPersonnes} personnes (${montant} €) ?`
        )
      )
        return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "LIVA",
            startDate: start,
            endDate: end,
            amount: montant,
            personnes: nbPersonnes,
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

    events: async function (fetchInfo, success, failure) {
      try {
        const res = await fetch(
          `${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`
        );
        if (!res.ok) throw new Error("Erreur serveur");
        const evts = await res.json();

        const fcEvents = evts.map((e) => ({
          title: e.title || "Réservé",
          start: e.start,
          end: e.end,
          display: "background",
          color: "#ff0000",
        }));

        success(fcEvents);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        failure(err);
      }
    },
  });

  cal.render();
});
