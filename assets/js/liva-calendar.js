// ========================================================
// 🌿 LIVA Calendar JS - version stable + rouge foncé
// ========================================================

async function getConfig() {
  try {
    const stripeBackend = window.location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const res = await fetch(`${stripeBackend}/api/config?ts=${Date.now()}`);
    if (!res.ok) throw new Error("Impossible de récupérer la config");
    const data = await res.json();
    console.log("💻 Front config =", data);
    console.log("💻 Front testPayment =", data.testPayment);
    return data;
  } catch (err) {
    console.error(err);
    return { testPayment: true }; // fallback sécurisé
  }
}

function getTarif(date, nbPersonnes = 2) {
  const base = 79; // Tarif de base LIVA
  if (nbPersonnes <= 2) return base;
  return base + (nbPersonnes - 2) * 20;
}

document.addEventListener("DOMContentLoaded", async function () {
  const el = document.getElementById("calendar");
  if (!el) return;

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  // Récupération config serveur
  const config = await getConfig();
  const testPayment = config.testPayment;
  console.log("💻 Front testPayment :", testPayment);

  // Variables
  window.reservedRanges = [];
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const inputName = document.getElementById("res-name");
  const inputEmail = document.getElementById("res-email");
  const inputPhone = document.getElementById("res-phone");
  const inputPersons = document.getElementById("res-persons");
  const priceDisplay = document.getElementById("modal-price");
  const btnCancel = document.getElementById("res-cancel");
  const btnConfirm = document.getElementById("res-confirm");

  let selectedStart = null;
  let selectedEnd = null;

  // Validation du formulaire
  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid = name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 5;
    btnConfirm.disabled = !valid;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach(input => {
    input.addEventListener("input", () => {
      validateForm();
      updatePrice();
    });
  });

  function updatePrice() {
    if (!selectedStart || !selectedEnd) return;
    const nbPersons = parseInt(inputPersons.value) || 2;
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate() + 1);
    }
    const displayAmount = testPayment ? 1 : total;
    priceDisplay.textContent = `Montant total : ${displayAmount} €`;
  }

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;

      for (let range of window.reservedRanges) {
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
    select: function (info) {
      selectedStart = info.startStr;
      selectedEnd = info.endStr;
      modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
      inputName.value = "";
      inputEmail.value = "";
      inputPhone.value = "";
      inputPersons.value = 2;
      validateForm();
      updatePrice();
      modal.style.display = "flex";
    },
    events: async function (fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();
        window.reservedRanges = evts.map(e => ({ start: e.start, end: e.end }));

        const fcEvents = evts.map(e => ({
          title: "Réservé",
          start: e.start,
          end: e.end,
          display: "background",
          backgroundColor: "#7a0000", // Rouge foncé
          borderColor: "#7a0000",
          allDay: true
        }));

        success(fcEvents);
      } catch (err) {
        console.error(err);
        failure(err);
      }
    }
  });

  cal.render();

  btnCancel.addEventListener("click", () => modal.style.display = "none");

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    let nbPersons = parseInt(inputPersons.value);

    if (!name || !email || !phone || isNaN(nbPersons) || nbPersons < 1 || nbPersons > 5) {
      alert("Veuillez remplir tous les champs correctement (max 5 personnes).");
      return;
    }

    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate() + 1);
    }

    const montant = testPayment ? 1 : total;

    if (!confirm(`Réserver LIVA du ${selectedStart} au ${selectedEnd} pour ${montant} € pour ${nbPersons} personne(s) ?`)) return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "LIVA",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: montant,
          personnes: nbPersons,
          name,
          email,
          phone
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Impossible de créer la réservation.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la réservation.");
    }
  });
});

// --- Correctif visuel et blocage des dates réservées ---
document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = `
    /* Rouge foncé pour les dates réservées */
    .fc-daygrid-day.reserved-day {
      background-color: #7a0000 !important;
      opacity: 0.8 !important;
      cursor: not-allowed !important;
    }
    /* Empêche toute interaction sur les jours réservés */
    .fc-daygrid-day.reserved-day * {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);

  // Marquer les jours réservés dynamiquement
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".fc-daygrid-day").forEach(day => {
      const dateStr = day.getAttribute("data-date");
      if (!dateStr) return;
      const isReserved = window.reservedRanges?.some(r => {
        const start = new Date(r.start);
        const end = new Date(r.end);
        end.setDate(end.getDate() - 1);
        const d = new Date(dateStr);
        return d >= start && d <= end;
      });
      if (isReserved) day.classList.add("reserved-day");
      else day.classList.remove("reserved-day");
    });
  });

  const calendarEl = document.getElementById("calendar");
  if (calendarEl) observer.observe(calendarEl, { childList: true, subtree: true });
});
