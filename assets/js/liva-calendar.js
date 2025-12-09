// ========================================================
// 🌿 LIVA Calendar JS - Version Finale (Desktop + Mobile)
// ========================================================

(async function () {

  // -------------------------------
  // 1) CSS : style + mobile safe
  // -------------------------------
  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc { background: #fff !important; color: #000 !important; font-family: "Inter", sans-serif; }
    #calendar .fc-daygrid-day { background: #fdfdfd !important; border-color: #ddd !important; transition: background 0.15s ease; pointer-events: auto !important; }
    @media (hover: hover) {
      #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) { background: #eee !important; cursor: pointer; }
    }
    #calendar .fc-day-disabled { opacity: 0.35 !important; }
    #calendar .fc-daygrid-day[data-reserved="true"] { background: #ffcccc !important; opacity: 0.8; pointer-events: none !important; }

    #reservationModal {
      z-index: 2000;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      display: none;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    #reservationModal .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      width: 90%;
      max-width: 420px;
      color: #000;
      border: 1px solid #ccc;
    }
    #reservationModal input, #reservationModal select {
      width: 100%;
      padding: 8px;
      margin: 6px 0 12px;
      border-radius: 6px;
      background: #f9f9f9;
      border: 1px solid #ccc;
      color: #000;
    }
    #reservationModal button { padding: 12px; border-radius: 8px; border: none; margin-top: 8px; width: 100%; }
    #res-confirm { background: #6f4cff; color: #fff; }
    #res-cancel { background: #333; color: #fff; }
  `;

  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // -------------------------------
  // 2) Helpers
  // -------------------------------
  function getTarif(dateStr, nbPersonnes = 2, testPayment = false) {
    if (testPayment) return 1;
    const base = 79;
    const supplement = nbPersonnes > 2 ? (nbPersonnes - 2) * 15 : 0;
    return base + supplement;
  }

  async function getConfig() {
    try {
      const stripeBackend = location.hostname.includes("localhost")
        ? "http://localhost:3000"
        : "https://livablom-stripe-production.up.railway.app";
      const res = await fetch(`${stripeBackend}/api/config`);
      return await res.json();
    } catch {
      return { testPayment: true };
    }
  }

  function sumPrice(startStr, endStr, nbPersons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    const end = new Date(endStr);
    while (cur < end) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    return total;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // -------------------------------
  // 3) DOM READY
  // -------------------------------
  document.addEventListener("DOMContentLoaded", async () => {
    const el = document.getElementById("calendar");
    if (!el) return;

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";
    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";
    const config = await getConfig();
    const testPayment = config.testPayment;

    // Modal refs
    const modal = document.getElementById("reservationModal");
    const modalDates = document.getElementById("modal-dates");
    const inputName = document.getElementById("res-name");
    const inputEmail = document.getElementById("res-email");
    const inputPhone = document.getElementById("res-phone");
    const inputPersons = document.getElementById("res-persons");
    const priceDisplay = document.getElementById("modal-price");
    const btnCancel = document.getElementById("res-cancel");
    const btnConfirm = document.getElementById("res-confirm");

    let reservedRanges = [];
    let selectedStart = null;
    let selectedEnd = null;

    function updatePriceDisplay() {
      if (!selectedStart || !selectedEnd) return;
      const nbPers = parseInt(inputPersons.value) || 2;
      priceDisplay.textContent =
        `Montant total : ${sumPrice(selectedStart, selectedEnd, nbPers, testPayment)} €`;
    }

    function validateForm() {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);
      btnConfirm.disabled = !(name && email && phone && nbP >= 1 && nbP <= 5);
    }

    [inputName, inputEmail, inputPhone, inputPersons].forEach(el => {
      el.addEventListener("input", () => { validateForm(); updatePriceDisplay(); });
    });

    // -------------------------------
    // 4) FullCalendar
    // -------------------------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: true,
      firstDay: 1,
      locale: "fr",
      height: "auto",

      selectAllow(sel) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (sel.start < today) return false;
        return !reservedRanges.some(r => sel.start < r.end && sel.end > r.start);
      },

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA`);
          const data = await res.json();
          reservedRanges = data.map(e => ({ start: new Date(e.start), end: new Date(e.end) }));
          success(reservedRanges.map(r => ({
            title: "Réservé",
            start: r.start,
            end: r.end,
            display: "background",
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            allDay: true
          })));
        } catch (err) {
          failure(err);
        }
      },

      dayCellDidMount(info) {
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) {
          info.el.setAttribute("data-reserved", "true");
          return;
        }

        // Mobile touch
        info.el.addEventListener("pointerup", ev => {
          if (ev.pointerType === "touch") {
            const dateStr = info.el.getAttribute("data-date");
            const s = new Date(dateStr);
            const e = new Date(s); e.setDate(e.getDate() + 1);
            if (!cal.getOption("selectAllow")({ start: s, end: e })) return;
            cal.select({ start: s, end: e, allDay: true });
          }
        }, { passive: true });
      },

      select(info) {
        selectedStart = info.startStr.split("T")[0];
        selectedEnd = info.endStr.split("T")[0];

        modalDates.textContent = `Du ${formatDate(selectedStart)} au ${formatDate(selectedEnd)}`;
        inputName.value = "";
        inputEmail.value = "";
        inputPhone.value = "";
        inputPersons.value = 2;

        validateForm();
        updatePriceDisplay();
        modal.style.display = "flex";
      }
    });

    cal.render();

    // -------------------------------
    // 5) Modal buttons
    // -------------------------------
    btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
      cal.unselect();
    });

    btnConfirm.addEventListener("click", async () => {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);

      const total = sumPrice(selectedStart, selectedEnd, nbP, testPayment);

      if (!confirm(`Confirmer la réservation du ${formatDate(selectedStart)} au ${formatDate(selectedEnd)} pour ${total} € ?`))
        return;

      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "LIVA",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: total,
          personnes: nbP,
          name,
          email,
          phone
        })
      });

      const data = await res.json();
      if (data.url) location.href = data.url;
      else alert("Impossible de créer la réservation.");
    });

  });

})();
