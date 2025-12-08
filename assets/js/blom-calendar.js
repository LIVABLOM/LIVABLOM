// ========================================================
// 🌸 BLŌM Calendar JS - Version Finale (Desktop + Mobile)
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

    #calendar .fc { background: #111 !important; color: #fff !important; font-family: "Inter", sans-serif; }
    #calendar .fc-daygrid-day { background: #181818 !important; border-color: #222 !important; transition: background 0.15s ease; pointer-events: auto !important; }
    @media (hover: hover) {
      #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) { background: #242424 !important; cursor: pointer; }
    }
    #calendar .fc-day-disabled { opacity: 0.35 !important; }
    #calendar .fc-daygrid-day[data-reserved="true"] { background: #4a0000 !important; opacity: 0.8; pointer-events: none !important; }

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
      background: #1b1b1b;
      padding: 20px;
      border-radius: 10px;
      width: 90%;
      max-width: 420px;
      color: #fff;
      border: 1px solid #333;
    }
    #reservationModal input, #reservationModal select {
      width: 100%;
      padding: 8px;
      margin: 6px 0 12px;
      border-radius: 6px;
      background: #2a2a2a;
      border: 1px solid #444;
      color: #fff;
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
    const d = new Date(dateStr);
    const day = d.getDay();
    if (day === 5 || day === 6) return 169;
    if (day === 0) return 190;
    return 150;
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
      btnConfirm.disabled = !(name && email && phone && nbP >= 1 && nbP <= 2);
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

      // -------------------------------
      // Select logic
      // -------------------------------
      selectAllow(sel) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (sel.start < today) return false;

        // Bloquer la sélection uniquement si elle chevauche les réservations,
        // mais autoriser le début sur le jour de départ d'une réservation précédente
        return !reservedRanges.some(r => {
          const selStart = sel.start;
          const selEnd = sel.end;
          const resStart = r.start;
          const resEnd = r.end;
          return selStart < resEnd && selEnd > resStart && selStart.getTime() !== resEnd.getTime();
        });
      },

      // -------------------------------
      // Récupérer les réservations
      // -------------------------------
      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM`);
          const data = await res.json();
          reservedRanges = data.map(e => ({ start: new Date(e.start), end: new Date(e.end) }));
          success(reservedRanges.map(r => ({
            title: "Réservé",
            start: r.start,
            end: r.end,
            display: "background",
            backgroundColor: "#900",
            borderColor: "#900",
            allDay: true
          })));
        } catch (err) {
          failure(err);
        }
      },

      // -------------------------------
      // Marquer les jours réservés
      // -------------------------------
      dayCellDidMount(info) {
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) info.el.setAttribute("data-reserved", "true");
      },

      // -------------------------------
      // Action à la sélection
      // -------------------------------
      select(info) {
        selectedStart = info.startStr.split("T")[0];
        selectedEnd = info.endStr.split("T")[0];

        modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
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

      if (!confirm(`Confirmer la réservation du ${selectedStart} au ${selectedEnd} pour ${total} € ?`))
        return;

      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "BLŌM",
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
