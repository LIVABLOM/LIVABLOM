// ========================================================
// 🌸 BLOM Calendar JS - version adaptative + mobile fix
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
    return data;
  } catch (err) {
    console.error(err);
    return { testPayment: false };
  }
}

function getTarif(date, nbPersonnes = 2) {
  const jour = new Date(date).getDay();
  let base;
  if (jour === 0) base = 190;
  else if (jour === 5 || jour === 6) base = 169;
  else base = 150;
  return nbPersonnes <= 2 ? base : base + (nbPersonnes - 2) * 20;
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
  const testPayment = config.testPayment ?? false;

  let reservedRanges = [];

  // Modal & formulaire
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
    const nb = parseInt(inputPersons.value);
    btnConfirm.disabled = !(name && email && phone && nb >= 1 && nb <= 2);
  }

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
    const montant = testPayment ? 1 : total;
    priceDisplay.textContent = `Montant total : ${montant} €`;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach((input) => {
    input.addEventListener("input", () => {
      validateForm();
      updatePrice();
    });
  });

  function isReserved(date) {
    return reservedRanges.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      end.setDate(end.getDate() - 1);
      return date >= start && date <= end;
    });
  }

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,

    selectAllow(info) {
      const start = info.start;
      const end = info.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;
      for (let range of reservedRanges) {
        const rs = new Date(range.start);
        const re = new Date(range.end);
        re.setDate(re.getDate() - 1);
        if (start <= re && end > rs) return false;
      }
      return true;
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

    dateClick(info) {
      const date = info.date;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today || isReserved(date)) return;

      selectedStart = info.dateStr;
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      selectedEnd = endDate.toISOString().split("T")[0];

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
        reservedRanges = evts.map((e) => ({ start: e.start, end: e.end }));
        const fcEvents = evts.map((e) => ({
          title: "Réservé",
          start: e.start,
          end: e.end,
          display: "background",
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          allDay: true,
        }));
        success(fcEvents);
      } catch (err) {
        console.error(err);
        failure(err);
      }
    },
  });

  cal.render();

  btnCancel.addEventListener("click", () => (modal.style.display = "none"));

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nb = parseInt(inputPersons.value);
    if (!name || !email || !phone || isNaN(nb) || nb < 1 || nb > 2) {
      alert("Veuillez remplir tous les champs correctement (max 2 personnes).");
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

    if (!confirm(`Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${montant} € pour ${nb} personne(s) ?`))
      return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "BLŌM",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: montant,
          personnes: nb,
          name,
          email,
          phone,
        }),
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
