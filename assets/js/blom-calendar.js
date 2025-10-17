// ========================================================
// 🌸 BLOM Calendar JS - version adaptative avec blocage des dates réservées
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
    return { testPayment: false }; // fallback sécurisé
  }
}

function getTarif(date, nbPersonnes = 2) {
  const jour = new Date(date).getDay(); // 0 = dimanche, 1 = lundi ... 6 = samedi
  let base;

  if (jour === 0) base = 190;        // Dimanche
  else if (jour === 5 || jour === 6) base = 169; // Vendredi et samedi
  else base = 150;                   // Lundi → Jeudi

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

  const config = await getConfig();
  const testPayment = config.testPayment;
  console.log("💻 Front testPayment :", testPayment);

  let reservedRanges = [];

  // Modal
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

  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid =
      name &&
      email &&
      phone &&
      !isNaN(nbPersons) &&
      nbPersons >= 1 &&
      nbPersons <= 2;
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

  // --- Fonction pour vérifier si une date est réservée ---
  function isReserved(date) {
    return reservedRanges.some(range => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      end.setDate(end.getDate() - 1); // FullCalendar exclut le dernier jour
      return date >= start && date <= end;
    });
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
      today.setHours(0,0,0,0);
      if (start < today) return false;

      // Bloquer toute sélection qui inclut une date réservée
      let cur = new Date(start);
      while (cur < end) {
        if (isReserved(cur)) return false;
        cur.setDate(cur.getDate() + 1);
      }
      return true;
    },

    select: function (info) {
      selectedStart = info.startStr;
      selectedEnd = info.endStr;

      // Vérification supplémentaire au cas où une date réservée passerait
      let cur = new Date(selectedStart);
      const fin = new Date(selectedEnd);
      while (cur < fin) {
        if (isReserved(cur)) {
          alert("Certaines dates sélectionnées sont déjà réservées.");
          return;
        }
        cur.setDate(cur.getDate() + 1);
      }

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
        const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
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
        console.error(err);
        failure(err);
      }
    }
  });

  cal.render();

  btnCancel.addEventListener("click", () => (modal.style.display = "none"));

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    let nbPersons = parseInt(inputPersons.value);

    if (!name || !email || !phone || isNaN(nbPersons) || nbPersons < 1 || nbPersons > 2) {
      alert("Veuillez remplir tous les champs correctement (max 2 personnes).");
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

    if (!confirm(`Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${montant} € pour ${nbPersons} personne(s) ?`)) return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "BLŌM",
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
