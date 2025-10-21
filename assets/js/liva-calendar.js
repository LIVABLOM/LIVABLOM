// ========================================================
// 🌸 LIVA Calendar JS - Sélection multiple & mobile friendly
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

// Tarif LIVA : 79€ pour 1 ou 2 personnes, +15€ par personne supplémentaire
function getTarif(date, nbPersonnes = 2) {
  const base = 79;
  const supplement = nbPersonnes > 2 ? (nbPersonnes - 2) * 15 : 0;
  return base + supplement;
}

document.addEventListener("DOMContentLoaded", async function () {
  const el = document.getElementById("calendar");
  if (!el) {
    console.warn("Calendrier introuvable (#calendar)");
    return;
  }

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  const config = await getConfig();
  const testPayment = config.testPayment;
  let reservedRanges = [];

  // Modal références
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const inputName = document.getElementById("res-name");
  const inputEmail = document.getElementById("res-email");
  const inputPhone = document.getElementById("res-phone");
  const inputPersons = document.getElementById("res-persons");
  const priceDisplay = document.getElementById("modal-price");
  const btnCancel = document.getElementById("res-cancel");
  const btnConfirm = document.getElementById("res-confirm");

  let selectedDates = new Set(); // 🟢 Ensemble des dates sélectionnées

  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid =
      name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 5;
    btnConfirm.disabled = !valid;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach((i) => {
    i.addEventListener("input", () => {
      validateForm();
      updatePrice();
    });
  });

  function updatePrice() {
    if (selectedDates.size === 0) return;
    const nbPersons = parseInt(inputPersons.value) || 2;
    let total = 0;
    for (let date of selectedDates) {
      total += getTarif(date, nbPersons);
    }
    const displayAmount = testPayment ? 1 : total;
    priceDisplay.textContent = `Montant total : ${displayAmount} €`;
  }

  // Initialisation du calendrier
  let cal;
  try {
    cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "fr",
      selectable: false,
      firstDay: 1,
      height: "100%",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "",
      },
      events: async function (fetchInfo, success, failure) {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
          if (!res.ok) throw new Error("Erreur serveur calendrier");
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

          // Désactive les jours réservés
          setTimeout(() => {
            document.querySelectorAll(".fc-daygrid-day").forEach((day) => {
              const date = day.getAttribute("data-date");
              if (!date) return;
              const isReserved = reservedRanges.some((r) => {
                const s = new Date(r.start);
                const e = new Date(r.end);
                e.setDate(e.getDate() - 1);
                return new Date(date) >= s && new Date(date) <= e;
              });
              if (isReserved) {
                day.style.pointerEvents = "none";
                day.style.opacity = "0.4";
                day.style.cursor = "not-allowed";
              }
            });
          }, 300);
        } catch (err) {
          console.error("events fetch error:", err);
          failure(err);
        }
      },
    });
    cal.render();
  } catch (err) {
    console.error("Erreur initialisation FullCalendar :", err);
    return;
  }

  // ========================================================
  // 🗓️ SÉLECTION MULTIPLE (clic ou appui long)
  // ========================================================
  let multiSelectMode = false;
  let touchStartTime = 0;

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType !== "touch") return;
      touchStartTime = Date.now();
      setTimeout(() => {
        if (Date.now() - touchStartTime > 500) {
          multiSelectMode = true;
          console.log("📱 Mode multi-sélection activé");
        }
      }, 550);
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerup",
    (e) => {
      if (e.pointerType !== "touch" && e.pointerType !== "mouse") return;
      const cell = e.target.closest(".fc-daygrid-day");
      if (!cell || cell.style.pointerEvents === "none") return;

      const dateStr = cell.getAttribute("data-date");
      if (!dateStr) return;

      // Mode multi-sélection
      if (multiSelectMode) {
        if (selectedDates.has(dateStr)) {
          selectedDates.delete(dateStr);
          cell.classList.remove("fc-day-selected-custom");
        } else {
          selectedDates.add(dateStr);
          cell.classList.add("fc-day-selected-custom");
        }
      } else {
        // Sélection simple
        selectedDates.clear();
        document
          .querySelectorAll(".fc-day-selected-custom")
          .forEach((d) => d.classList.remove("fc-day-selected-custom"));
        selectedDates.add(dateStr);
        cell.classList.add("fc-day-selected-custom");
      }

      updateSelectedDisplay();
    },
    { passive: true }
  );

  // Désactive le mode multi après 5 secondes
  setInterval(() => {
    if (multiSelectMode) multiSelectMode = false;
  }, 5000);

  function updateSelectedDisplay() {
    if (selectedDates.size === 0) return;

    const dates = Array.from(selectedDates).sort();
    modalDates.textContent =
      dates.length > 1 ? dates.join(", ") : `Le ${dates[0]}`;

    modal.style.display = "flex";
    validateForm();
    updatePrice();
  }

  // ========================================================
  // 🔘 Gestion du modal
  // ========================================================
  btnCancel.addEventListener("click", () => {
    modal.style.display = "none";
    selectedDates.clear();
    document
      .querySelectorAll(".fc-day-selected-custom")
      .forEach((d) => d.classList.remove("fc-day-selected-custom"));
  });

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    let nbPersons = parseInt(inputPersons.value);

    if (!name || !email || !phone || isNaN(nbPersons) || nbPersons < 1 || nbPersons > 5) {
      alert("Veuillez remplir tous les champs correctement (max 5 personnes).");
      return;
    }

    const total = Array.from(selectedDates).reduce(
      (sum, d) => sum + getTarif(d, nbPersons),
      0
    );
    const montant = testPayment ? 1 : total;

    if (!confirm(`Réserver LIVA pour ${selectedDates.size} jour(s), total ${montant} € ?`))
      return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "LIVA",
          dates: Array.from(selectedDates),
          amount: montant,
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

  // Sécurité CSS runtime
  const style = document.createElement("style");
  style.innerHTML = `
    .fc-daygrid-day, .fc-daygrid-day-frame { pointer-events: auto !important; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    #calendar { -webkit-overflow-scrolling: touch; }
  `;
  document.head.appendChild(style);
});
