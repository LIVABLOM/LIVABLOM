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

  const modal = document.getElementById("reservationModal");
  const form = document.getElementById("reservationForm");
  const reservationDates = document.getElementById("reservationDates");

  let selectedStart = null;
  let selectedEnd = null;
  let reservedRanges = [];

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;

      const today = new Date();
      today.setHours(0,0,0,0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        rangeEnd.setDate(rangeEnd.getDate() - 1);

        if (start <= rangeEnd && end > rangeStart) {
          if (start.getTime() === rangeEnd.getTime()) continue;
          return false;
        }
      }
      return true;
    },
    select: function(info) {
      selectedStart = info.startStr;
      selectedEnd = info.endStr;

      reservationDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
      modal.style.display = "flex";
    },
    events: async function(fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");
        const evts = await res.json();
        reservedRanges = evts.map(e => ({ start: e.start, end: e.end }));

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
        console.error(err);
        failure(err);
      }
    }
  });

  cal.render();

  document.getElementById("cancelModal").addEventListener("click", () => modal.style.display="none");

  form.addEventListener("submit", async function(e){
    e.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    let people = parseInt(formData.get("people"));
    if (isNaN(people) || people < 1 || people > 5) { alert("Nombre de personnes invalide"); return; }

    // Calcul du prix total
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while(cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], people);
      cur.setDate(cur.getDate()+1);
    }
    let montant = window.TEST_PAYMENT ? 1 : total;

    // Envoi des infos sur Formspree
    try {
      await fetch("https://formspree.io/f/{TON_ID}", {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: JSON.stringify({ name, email, phone, people, logement:"LIVA", start:selectedStart, end:selectedEnd })
      });
    } catch(err){ console.error("Erreur Formspree", err); }

    // Redirection vers Stripe
    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ logement:"LIVA", startDate:selectedStart, endDate:selectedEnd, amount:montant, personnes:people })
      });
      const data = await res.json();
      if(data.url) window.location.href = data.url;
      else alert("Impossible de créer la réservation.");
    } catch(err){ console.error(err); alert("Erreur Stripe"); }

    modal.style.display="none";
  });
});
