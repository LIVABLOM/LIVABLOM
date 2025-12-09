// ========================================================
// 🌿 LIVA Calendar JS - Mode "Date départ -> Nuits" (Desktop + Mobile)
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

    #calendar .fc { background: #f9f9f9 !important; color: #000 !important; font-family: "Inter", sans-serif; }
    #calendar .fc-daygrid-day { background: #fff !important; border-color: #ddd !important; transition: background 0.15s ease; pointer-events: auto !important; }
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
    #res-error { color: #ff8b8b; margin-top: 6px; display: none; }
  `;

  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // -------------------------------
  // 2) Helpers
  // -------------------------------
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(0,0,0,0);
    return d;
  }

  function formatDateISO(date) {
    return date.toISOString().split('T')[0];
  }

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

  function sumPriceByNights(startStr, nights, nbPersons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    for (let i = 0; i < nights; i++) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    return total;
  }

  function isRangeAvailable(startDate, nights, reservedRanges) {
    const selStart = new Date(startDate);
    selStart.setHours(0,0,0,0);
    const selEnd = addDays(selStart, nights); // exclusive

    const today = new Date(); today.setHours(0,0,0,0);
    if (selStart < today) return false;

    for (const r of reservedRanges) {
      if (selStart < r.end && selEnd > r.start) {
        return false;
      }
    }
    return true;
  }

  // -------------------------------
  // 3) DOM READY
  // -------------------------------
  document.addEventListener("DOMContentLoaded", async () => {
    const el = document.getElementById("calendar");
    if (!el) return;

    const modal = document.getElementById("reservationModal");
    const modalDates = document.getElementById("modal-dates");
    const inputName = document.getElementById("res-name");
    const inputEmail = document.getElementById("res-email");
    const inputPhone = document.getElementById("res-phone");
    const inputPersons = document.getElementById("res-persons");
    const priceDisplay = document.getElementById("modal-price");
    const btnCancel = document.getElementById("res-cancel");
    const btnConfirm = document.getElementById("res-confirm");
    const errorBox = document.getElementById("res-error");

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";
    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const config = await getConfig();
    const testPayment = config.testPayment;

    let reservedRanges = [];
    let clickedStart = null;

    if (inputPersons) inputPersons.value = 2;

    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: false,
      firstDay: 1,
      locale: "fr",
      height: "auto",

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA`);
          const data = await res.json();
          reservedRanges = data.map(e => {
            const s = new Date(e.start);
            const rawEnd = new Date(e.end);
            const exEnd = addDays(rawEnd, 1); // end exclusive
            s.setHours(0,0,0,0);
            exEnd.setHours(0,0,0,0);
            return { start: s, end: exEnd };
          });
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
        if (isReserved) info.el.setAttribute("data-reserved", "true");

        // mobile touch
        info.el.addEventListener("pointerup", ev => {
          if (ev.pointerType === "touch") {
            const dateStr = info.el.getAttribute("data-date");
            const s = new Date(dateStr);
            const e = new Date(s); e.setDate(e.getDate() + 1);
            if (reservedRanges.some(r => s >= r.start && s < r.end)) return;
            clickedStart = s;
            modalDates.textContent = `Date de départ : ${formatDateISO(clickedStart)}`;
            inputName.value = "";
            inputEmail.value = "";
            inputPhone.value = "";
            inputPersons.value = 2;
            const price = sumPriceByNights(formatDateISO(clickedStart), 1, 2, testPayment);
            if (priceDisplay) priceDisplay.textContent = `Montant total : ${price} €`;
            if (modal) modal.style.display = 'flex';
          }
        }, { passive: true });
      },

      dateClick(info) {
        const dateClicked = new Date(info.dateStr);
        dateClicked.setHours(0,0,0,0);
        if (reservedRanges.some(r => dateClicked >= r.start && dateClicked < r.end)) return;

        clickedStart = dateClicked;
        modalDates.textContent = `Date de départ : ${formatDateISO(clickedStart)}`;
        inputName.value = "";
        inputEmail.value = "";
        inputPhone.value = "";
        inputPersons.value = 2;
        const price = sumPriceByNights(formatDateISO(clickedStart), 1, 2, testPayment);
        if (priceDisplay) priceDisplay.textContent = `Montant total : ${price} €`;
        if (modal) modal.style.display = 'flex';
      }
    });

    cal.render();

    // -------------------------------
    // Modal buttons
    // -------------------------------
    if (btnCancel) btnCancel.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      clickedStart = null;
    });

    if (btnConfirm) btnConfirm.addEventListener('click', async () => {
      if (!clickedStart) return;
      const persons = parseInt(inputPersons.value) || 2;
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      if (!name || !email || !phone) {
        if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Veuillez remplir tous les champs.'; }
        return;
      }
      const startDate = formatDateISO(clickedStart);
      const endDate = addDays(clickedStart, 1);
      const endDateStr = formatDateISO(endDate);
      const total = sumPriceByNights(startDate, 1, persons, testPayment);

      if (!confirm(`Confirmer la réservation du ${startDate} au ${endDateStr} (${1} nuit) pour ${total} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "LIVA",
            startDate,
            endDate: endDateStr,
            amount: total,
            personnes: persons,
            name,
            email,
            phone
          })
        });
        const data = await res.json();
        if (data.url) {
          if (modal) modal.style.display = 'none';
          location.href = data.url;
        } else {
          alert("Impossible de créer la réservation.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur réseau lors de la création de la réservation.");
      }
    });

    if (modal) modal.addEventListener('click', ev => {
      if (ev.target === modal) {
        modal.style.display = 'none';
        clickedStart = null;
      }
    });

  });

})();
cd