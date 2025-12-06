// ========================================================
// 🌸 BLŌM Calendar JS - multi-date & mobile/desktop
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
    console.error("getConfig error:", err);
    return { testPayment: true };
  }
}

// Tarif BLŌM selon le jour de la semaine
function getTarif(dateStr, nbPersonnes = 2, testPayment = false) {
  if (testPayment) return 1; // Paiement test toujours 1 €

  const date = new Date(dateStr);
  const day = date.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi

  let tarifBase = 150; // Lundi à jeudi
  if (day === 5 || day === 6) tarifBase = 169; // Vendredi et samedi
  if (day === 0) tarifBase = 190; // Dimanche

  return tarifBase;
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

  // Validation
  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    btnConfirm.disabled = !(
      name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 2
    );
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach((i) => {
    i.addEventListener("input", () => {
      validateForm();
      updatePrice();
    });
  });

  // Prix
  function updatePrice() {
    if (!selectedStart || !selectedEnd) return;
    const nbPersons = parseInt(inputPersons.value) || 2;
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    priceDisplay.textContent = `Montant total : ${total} €`;
  }

  // Initialisation FullCalendar
  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    selectMirror: true,
    firstDay: 1,
    height: "100%",
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        if (start < range.end && end > range.start) return false;
      }
      return true;
    },
    events: async function (fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur calendrier");
        const evts = await res.json();

        reservedRanges = evts.map(e => ({
          start: new Date(e.start),
          end: new Date(e.end),
        }));

        const fcEvents = reservedRanges.map(r => ({
          title: "Réservé",
          start: r.start,
          end: r.end,
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
    dayCellDidMount: function (info) {
      // Bloquer les dates réservées
      for (let r of reservedRanges) {
        if (info.date >= r.start && info.date < r.end) {
          info.el.style.pointerEvents = "none";
          info.el.title = "Date réservée";
          return;
        }
      }

      // ✅ Mobile tap rapide (1 jour)
      info.el.addEventListener("pointerup", (e) => {
        if (e.pointerType !== "touch") return;

        const start = new Date(info.date);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        // Vérifie que la date est autorisée
        const allow = info.view.calendar.opt('selectAllow')({ start, end });
        if (!allow) return;

        info.view.calendar.select({ start, end, allDay: true });
      });
    },
    select: function (info) {
      selectedStart = info.startStr.split("T")[0];
      selectedEnd = info.endStr.split("T")[0];
      modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
      inputName.value = "";
      inputEmail.value = "";
      inputPhone.value = "";
      inputPersons.value = 2;
      validateForm();
      updatePrice();
      modal.style.display = "flex";
    },
  });

  cal.render();

  // Modal buttons
  btnCancel.addEventListener("click", () => {
    modal.style.display = "none";
    cal.unselect();
  });

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
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }

    if (!confirm(`Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${total} € ?`)) return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "BLŌM",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: total,
          personnes: nbPersons,
          name,
          email,
          phone,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Impossible de créer la réservation.");
    } catch (err) {
      console.error("checkout error:", err);
      alert("Erreur lors de la création de la réservation.");
    }
  });
});
