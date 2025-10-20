// ========================================================
// 🌸 BLOM Calendar JS - version robuste (tap mobile + drag)
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
    return { testPayment: false };
  }
}

// === Tarifs BLŌM ===
function getTarif(dateStr, nbPersonnes = 2) {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 = Dimanche, 1 = Lundi ... 6 = Samedi
  let base;
  if (day === 5 || day === 6) base = 169; // Vendredi ou Samedi
  else if (day === 0) base = 190;          // Dimanche
  else base = 150;                          // Lundi à Jeudi
  return base; // maximum 2 personnes incluses
}

document.addEventListener("DOMContentLoaded", async function () {
  const el = document.getElementById("calendar");
  if (!el) {
    console.warn("Calendrier introuvable (#calendar)");
    return;
  }

  // Backends
  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  const config = await getConfig();
  const testPayment = config.testPayment;
  let reservedRanges = [];

  // === Modal refs ===
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

  // === Form validation ===
  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid =
      name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 2;
    btnConfirm.disabled = !valid;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach((i) => {
    i.addEventListener("input", () => {
      validateForm();
      updatePrice();
    });
  });

  function updatePrice() {
    if (!selectedStart || !selectedEnd) return;
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    const displayAmount = testPayment ? 1 : total;
    priceDisplay.textContent = `Montant total : ${displayAmount} €`;
  }

  // === FullCalendar init ===
  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    selectMirror: true,
    firstDay: 1,
    height: "100%",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek",
    },
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        rangeEnd.setDate(rangeEnd.getDate() - 1);
        if (start <= rangeEnd && end > rangeStart) return false;
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
        const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
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

        // === Empêcher clic sur jours réservés ===
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
              day.style.opacity = "0.5";
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

  // === Modal buttons ===
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
      total += getTarif(cur.toISOString().split("T")[0]);
      cur.setDate(cur.getDate() + 1);
    }
    const montant = testPayment ? 1 : total;

    if (!confirm(`Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${montant} € ?`)) return;

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

  // ----------- Mobile tap short (1 jour) -------------
  let touchStartTime = 0;
  let touchMoved = false;

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (e.pointerType !== "touch") return;
      touchStartTime = Date.now();
      touchMoved = false;
    },
    { passive: true }
  );

  document.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "touch") return;
      touchMoved = true;
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerup",
    (e) => {
      if (e.pointerType !== "touch") return;
      const duration = Date.now() - touchStartTime;
      if (!touchMoved && duration < 300) {
        const dayCell = e.target.closest && e.target.closest(".fc-daygrid-day");
        if (!dayCell) return;
        const dateStr = dayCell.getAttribute("data-date");
        if (!dateStr) return;
        if (dayCell.style.pointerEvents === "none") return;

        const start = new Date(dateStr);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        try {
          cal.select({ start, end, allDay: true });
        } catch {
          dayCell.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        }
      }
    },
    { passive: true }
  );

  // === CSS runtime sécurité ===
  const style = document.createElement("style");
  style.innerHTML = `
    .fc-daygrid-day, .fc-daygrid-day-frame { pointer-events: auto !important; touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
    #calendar { -webkit-overflow-scrolling: touch; }
  `;
  document.head.appendChild(style);

  // === Info Formule journée ===
  const infoDiv = document.createElement("div");
  infoDiv.style.textAlign = "center";
  infoDiv.style.marginBottom = "10px";
  infoDiv.style.color = "#fff";
  infoDiv.innerHTML = `<strong>Formule journée (11h–16h) : 130 €</strong> — Merci de nous contacter pour réserver.`;
  el.parentNode.insertBefore(infoDiv, el);
});
