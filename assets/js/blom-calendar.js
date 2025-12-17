// ========================================================
// 🌸 BLŌM Calendar JS — VERSION STABLE DÉFINITIVE
// (fix bug intermittent bouton confirmer / dates / cache)
// ========================================================

(async function () {

  /* ===============================
     1) CSS — BLŌM (fond noir)
  =============================== */
  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc {
      background: #111 !important;
      color: #fff !important;
      font-family: Inter, sans-serif;
    }

    #calendar .fc-daygrid-day {
      background: #181818 !important;
      border-color: #222 !important;
      pointer-events: auto !important;
    }

    #calendar .fc-daygrid-day[data-reserved="true"] {
      background: #5a0000 !important;
      opacity: 0.8;
      pointer-events: none !important;
    }

    #reservationModal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 2000;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    #reservationModal .modal-content {
      background: #1b1b1b;
      color: #fff;
      border-radius: 10px;
      padding: 20px;
      width: 100%;
      max-width: 480px;
      border: 1px solid #333;
    }

    #reservationModal input {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border-radius: 6px;
      border: 1px solid #444;
      background: #2a2a2a;
      color: #fff;
    }

    #res-confirm {
      background: #6f4cff;
      color: #fff;
      padding: 12px;
      border-radius: 8px;
      width: 100%;
      border: none;
      margin-top: 10px;
    }

    #res-cancel {
      background: #333;
      color: #fff;
      padding: 10px;
      border-radius: 8px;
      width: 100%;
      border: none;
      margin-top: 6px;
    }

    #res-error {
      color: #ff8b8b;
      display: none;
      margin-top: 6px;
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  /* ===============================
     2) Helpers
  =============================== */
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(0,0,0,0);
    return d;
  }

  function formatDate(d) {
    return d.toISOString().split("T")[0];
  }

  function getTarif(dateStr, test) {
    if (test) return 1;
    const day = new Date(dateStr).getDay();
    if (day === 5 || day === 6) return 169;
    if (day === 0) return 190;
    return 150;
  }

  function isRangeAvailable(start, nights, ranges) {
    const s = new Date(start); s.setHours(0,0,0,0);
    const e = addDays(s, nights);
    for (const r of ranges) {
      if (s < r.end && e > r.start) return false;
    }
    return true;
  }

  /* ===============================
     3) DOM READY
  =============================== */
  document.addEventListener("DOMContentLoaded", async () => {

    const calendarEl = document.getElementById("calendar");
    if (!calendarEl) return;

    const modal = document.getElementById("reservationModal");
    const modalStart = document.getElementById("modal-start");
    const nightsInput = document.getElementById("res-nights");
    const personsInput = document.getElementById("res-persons");
    const priceEl = document.getElementById("modal-price");
    const nameInput = document.getElementById("res-name");
    const emailInput = document.getElementById("res-email");
    const phoneInput = document.getElementById("res-phone");
    const btnConfirm = document.getElementById("res-confirm");
    const btnCancel = document.getElementById("res-cancel");
    const errorBox = document.getElementById("res-error");

    const calendarAPI = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";

    const stripeAPI = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    let reservedRanges = [];
    let startDate = null;
    let testPayment = false;

    try {
      const cfg = await fetch(`${stripeAPI}/api/config`).then(r => r.json());
      testPayment = cfg.testPayment;
    } catch {}

    nightsInput.value = 1;
    personsInput.value = 2;

    const calendar = new FullCalendar.Calendar(calendarEl, {
      locale: "fr",
      firstDay: 1,
      initialView: "dayGridMonth",

      events: async (_, success, failure) => {
        try {
          const data = await fetch(`${calendarAPI}/api/reservations/BLOM`).then(r => r.json());
          reservedRanges = data.map(e => ({
            start: new Date(e.start),
            end: new Date(e.end)
          }));
          success(reservedRanges.map(r => ({
            start: r.start,
            end: r.end,
            display: "background",
            backgroundColor: "#700"
          })));
        } catch (e) { failure(e); }
      },

      dayCellDidMount(info) {
        if (reservedRanges.some(r => info.date >= r.start && info.date < r.end)) {
          info.el.setAttribute("data-reserved", "true");
        }
      },

      dateClick(info) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (info.date < today) return;
        if (reservedRanges.some(r => info.date >= r.start && info.date < r.end)) return;

        startDate = new Date(info.date);
        modalStart.textContent = formatDate(startDate);
        nightsInput.value = 1;
        personsInput.value = 2;
        modal.style.display = "flex";

        /* 🔥 FIX CRITIQUE */
        setTimeout(updateModal, 0);
      }
    });

    calendar.render();

    function updateModal() {
      if (!startDate) return;

      let nights = Math.max(1, parseInt(nightsInput.value) || 1);
      let persons = Math.min(2, Math.max(1, parseInt(personsInput.value) || 1));

      nightsInput.value = nights;
      personsInput.value = persons;

      const ok = isRangeAvailable(startDate, nights, reservedRanges);
      errorBox.style.display = ok ? "none" : "block";
      errorBox.textContent = ok ? "" : "Période indisponible.";

      let total = 0;
      let cur = new Date(startDate);
      for (let i = 0; i < nights; i++) {
        total += getTarif(formatDate(cur), testPayment);
        cur.setDate(cur.getDate() + 1);
      }

      priceEl.textContent = `Montant total : ${total} €`;

      btnConfirm.disabled = !ok;
      btnConfirm.style.pointerEvents = ok ? "auto" : "none";
      btnConfirm.style.opacity = ok ? "1" : "0.5";
    }

    nightsInput.addEventListener("input", updateModal);
    personsInput.addEventListener("input", updateModal);

    btnCancel.addEventListener("click", () => modal.style.display = "none");

    btnConfirm.addEventListener("click", async () => {
      if (btnConfirm.disabled) return;

      const nights = parseInt(nightsInput.value);
      const persons = parseInt(personsInput.value);
      const start = formatDate(startDate);
      const end = formatDate(addDays(startDate, nights));

      const amount = nights * getTarif(start, testPayment);

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      if (!name || !email || !phone) {
        errorBox.style.display = "block";
        errorBox.textContent = "Veuillez remplir tous les champs.";
        return;
      }

      const res = await fetch(`${stripeAPI}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "BLŌM",
          startDate: start,
          endDate: end,
          amount,
          personnes: persons,
          name,
          email,
          phone
        })
      }).then(r => r.json());

      if (res.url) location.href = res.url;
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });

  });

})();
