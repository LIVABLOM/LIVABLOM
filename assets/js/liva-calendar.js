// ========================================================
// 🌿 LIVA Calendar JS – VERSION FINALE (UTC SAFE / PROD)
// ========================================================

(async function () {

  // ------------------------------------------------
  // 1) CSS
  // ------------------------------------------------
  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc {
      background: #ffffff !important;
      color: #000 !important;
      font-family: "Inter", sans-serif;
    }

    #calendar .fc-daygrid-day {
      background: #ffffff !important;
      border-color: #ddd !important;
      transition: background 0.15s ease;
      pointer-events: auto !important;
    }

    @media (hover: hover) {
      #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) {
        background: #eee !important;
        cursor: pointer;
      }
    }

    #calendar .fc-day-disabled {
      opacity: 0.35 !important;
    }

    #calendar .fc-daygrid-day[data-reserved="true"] {
      background: #900 !important;
      opacity: 0.9;
      pointer-events: none !important;
      color: #fff !important;
    }

    #reservationModal {
      z-index: 2000;
      background: rgba(0,0,0,0.4);
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
      max-width: 480px;
      color: #000;
      border: 1px solid #ccc;
    }

    #reservationModal input,
    #reservationModal select {
      width: 100%;
      padding: 8px;
      margin: 6px 0 12px;
      border-radius: 6px;
      background: #fafafa;
      border: 1px solid #ccc;
      color: #000;
    }

    #reservationModal button {
      padding: 12px;
      border-radius: 8px;
      border: none;
      margin-top: 8px;
      width: 100%;
    }

    #res-confirm { background: #0077ff; color: #fff; }
    #res-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
    #res-cancel { background: #ccc; color: #000; }

    #res-error {
      color: #c00;
      margin-top: 6px;
      display: none;
    }
  `;

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ------------------------------------------------
  // 2) Helpers (UTC SAFE)
  // ------------------------------------------------
  function makeLocalDate(y, m, d) {
    return new Date(y, m, d, 12, 0, 0); // 🔒 midi anti-UTC
  }

  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(12,0,0,0);
    return d;
  }

  function formatLocalDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function getTarif(dateStr, persons = 2, testPayment = false) {
    if (testPayment) return 1;
    const base = 79;
    const supplement = persons > 2 ? (persons - 2) * 15 : 0;
    return base + supplement;
  }

  function sumPrice(startStr, nights, persons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    cur.setHours(12,0,0,0);
    for (let i = 0; i < nights; i++) {
      total += getTarif(formatLocalDate(cur), persons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    return total;
  }

  function isRangeAvailable(start, nights, reserved) {
    const s = new Date(start); s.setHours(12,0,0,0);
    const e = addDays(s, nights);
    const today = new Date(); today.setHours(0,0,0,0);

    if (s < today) return false;
    return !reserved.some(r => s < r.end && e > r.start);
  }

  async function getConfig() {
    try {
      const backend = location.hostname.includes("localhost")
        ? "http://localhost:3000"
        : "https://livablom-stripe-production.up.railway.app";
      const res = await fetch(`${backend}/api/config`);
      return await res.json();
    } catch {
      return { testPayment: true };
    }
  }

  // ------------------------------------------------
  // 3) DOM READY
  // ------------------------------------------------
  document.addEventListener("DOMContentLoaded", async () => {

    const el = document.getElementById("calendar");
    if (!el) return;

    const modal = document.getElementById("reservationModal");
    const modalStart = document.getElementById("modal-start") || document.getElementById("modal-dates");
    const inputNights = document.getElementById("res-nights");
    const inputPersons = document.getElementById("res-persons");
    const priceDisplay = document.getElementById("modal-price");
    const inputName = document.getElementById("res-name");
    const inputEmail = document.getElementById("res-email");
    const inputPhone = document.getElementById("res-phone");
    const btnCancel = document.getElementById("res-cancel");
    const btnConfirm = document.getElementById("res-confirm");
    const errorBox = document.getElementById("res-error");

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";

    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const { testPayment } = await getConfig();

    let reservedRanges = [];
    let clickedStart = null;

    inputNights.value = 1;
    inputPersons.value = 2;

    // ------------------------------------------------
    // FullCalendar
    // ------------------------------------------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      firstDay: 1,
      locale: "fr",
      height: "auto",

      events: async (_, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA`);
          const data = await res.json();

          reservedRanges = data.map(e => {
            const s = new Date(e.start); s.setHours(12,0,0,0);
            const end = new Date(e.end); end.setHours(12,0,0,0);
            return { start: s, end };
          });

          success(reservedRanges.map(r => ({
            start: r.start,
            end: r.end,
            display: "background",
            allDay: true,
            backgroundColor: "#900"
          })));
        } catch (err) {
          failure(err);
        }
      },

      dayCellDidMount(info) {
        if (reservedRanges.some(r => info.date >= r.start && info.date < r.end)) {
          info.el.setAttribute("data-reserved", "true");
        }
      },

      dateClick(info) {
        const d = info.date;
        clickedStart = makeLocalDate(d.getFullYear(), d.getMonth(), d.getDate());

        modalStart.textContent = `Arrivée : ${formatLocalDate(clickedStart)}`;
        errorBox.style.display = "none";
        modal.style.display = "flex";

        updateModal();
      }
    });

    cal.render();

    // ------------------------------------------------
    // Modal logic
    // ------------------------------------------------
    function updateModal() {
      if (!clickedStart) return;

      const nights = Math.max(1, parseInt(inputNights.value) || 1);
      const persons = Math.max(1, parseInt(inputPersons.value) || 1);

      const ok = isRangeAvailable(clickedStart, nights, reservedRanges);
      btnConfirm.disabled = !ok;

      if (!ok) {
        errorBox.style.display = "block";
        errorBox.textContent = "La période sélectionnée n'est pas disponible.";
      } else {
        errorBox.style.display = "none";
      }

      const total = sumPrice(formatLocalDate(clickedStart), nights, persons, testPayment);
      priceDisplay.textContent = `Montant total : ${total} €`;
    }

    inputNights.addEventListener("input", updateModal);
    inputPersons.addEventListener("input", updateModal);

    btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
      clickedStart = null;
    });

    btnConfirm.addEventListener("click", async () => {
      if (!clickedStart) return;

      const nights = parseInt(inputNights.value);
      const persons = parseInt(inputPersons.value);

      const startDate = formatLocalDate(clickedStart);
      const endDate = formatLocalDate(addDays(clickedStart, nights));
      const total = sumPrice(startDate, nights, persons, testPayment);

      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();

      if (!name || !email || !phone) {
        errorBox.style.display = "block";
        errorBox.textContent = "Veuillez remplir tous les champs.";
        return;
      }

      if (!confirm(`Confirmer la réservation du ${startDate} au ${endDate} pour ${total} € ?`)) return;

      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "LIVA",
          startDate,
          endDate,
          amount: total,
          personnes: persons,
          name,
          email,
          phone
        })
      });

      const data = await res.json();
      if (data.url) location.href = data.url;
      else alert("Erreur lors de la réservation.");
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });

  });

})();
