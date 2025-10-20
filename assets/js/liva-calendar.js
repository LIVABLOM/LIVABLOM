// ========================================================
// 🌿 LIVA Calendar JS - version stable & mobile-friendly
// ========================================================

async function getConfig() {
  try {
    const stripeBackend = window.location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const res = await fetch(`${stripeBackend}/api/config?ts=${Date.now()}`);
    if (!res.ok) throw new Error("Impossible de récupérer la config");
    return await res.json();
  } catch (err) {
    console.error(err);
    return { testPayment: true };
  }
}

// --- Tarification LIVA ---
function getTarif(date, nbPersonnes = 2) {
  const base = 79; // tarif de base
  return nbPersonnes <= 2 ? base : base + (nbPersonnes - 2) * 20;
}

document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("calendar");
  if (!el) return;

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  const config = await getConfig();
  const testPayment = config.testPayment;
  console.log("✅ Config LIVA récupérée :", config);

  let reservedRanges = [];
  let selectedStart = null;
  let selectedEnd = null;

  // --- Modal elements ---
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const inputName = document.getElementById("res-name");
  const inputEmail = document.getElementById("res-email");
  const inputPhone = document.getElementById("res-phone");
  const inputPersons = document.getElementById("res-persons");
  const priceDisplay = document.getElementById("modal-price");
  const btnCancel = document.getElementById("res-cancel");
  const btnConfirm = document.getElementById("res-confirm");

  // --- Validation formulaire ---
  function validateForm() {
    const valid =
      inputName.value.trim() &&
      inputEmail.value.trim() &&
      inputPhone.value.trim() &&
      !isNaN(parseInt(inputPersons.value)) &&
      parseInt(inputPersons.value) >= 1 &&
      parseInt(inputPersons.value) <= 5;
    btnConfirm.disabled = !valid;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach(input =>
    input.addEventListener("input", () => {
      validateForm();
      updatePrice();
    })
  );

  function updatePrice() {
    if (!selectedStart || !selectedEnd) return;
    const nb = parseInt(inputPersons.value) || 2;
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nb);
      cur.setDate(cur.getDate() + 1);
    }
    priceDisplay.textContent = `Montant total : ${testPayment ? 1 : total} €`;
  }

  // --- FullCalendar config ---
  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,
    handleWindowResize: true,
    height: "auto",
    aspectRatio: 1,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: ""
    },

    // ✅ Autorise la sélection même sur mobile
    selectAllow(selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        rangeEnd.setDate(rangeEnd.getDate() - 1);
        if (start <= rangeEnd && end > rangeStart) {
          return false;
        }
      }
      return true;
    },

    // ✅ Gestion du clic tactile sur mobile
    dateClick(info) {
      selectedStart = info.dateStr;
      const nextDay = new Date(info.date);
      nextDay.setDate(nextDay.getDate() + 1);
      selectedEnd = nextDay.toISOString().split("T")[0];

      modalDates.textContent = `Nuit du ${selectedStart}`;
      inputName.value = "";
      inputEmail.value = "";
      inputPhone.value = "";
      inputPersons.value = 2;
      validateForm();
      updatePrice();
      modal.style.display = "flex";
    },

    select(info) {
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

    events: async (fetchInfo, success, failure) => {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur calendrier LIVA");

        const evts = await res.json();
        reservedRanges = evts.map(e => ({ start: e.start, end: e.end }));

        const fcEvents = evts.map(e => ({
          title: "Réservé",
          start: e.start,
          end: e.end,
          display: "background",
          backgroundColor: "#800000", // 🔴 rouge foncé
          borderColor: "#800000",
          allDay: true
        }));

        success(fcEvents);
      } catch (err) {
        console.error("Erreur chargement réservations :", err);
        failure(err);
      }
    }
  });

  cal.render();

  // --- Actions modal ---
  btnCancel.addEventListener("click", () => (modal.style.display = "none"));

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nb = parseInt(inputPersons.value);

    if (!name || !email || !phone || isNaN(nb) || nb < 1 || nb > 5) {
      alert("Veuillez remplir tous les champs correctement (max 5 personnes).");
      return;
    }

    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nb);
      cur.setDate(cur.getDate() + 1);
    }

    const montant = testPayment ? 1 : total;

    if (!confirm(`Confirmer la réservation LIVA du ${selectedStart} au ${selectedEnd} pour ${montant} € ?`)) return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "LIVA",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: montant,
          personnes: nb,
          name,
          email,
          phone
        })
      });

      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur : paiement non initialisé.");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la création de la réservation.");
    }
  });
});
