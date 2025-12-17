// ========================================================
// 🌸 BLŌM Calendar JS – Version STABLE & CORRIGÉE
// ========================================================

(async function () {

  // -------------------------------
  // 1) CSS
  // -------------------------------
  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc {
      background: #111 !important;
      color: #fff !important;
      font-family: "Inter", sans-serif;
    }

    #calendar .fc-daygrid-day {
      background: #181818 !important;
      border-color: #222 !important;
      transition: background 0.15s ease;
      pointer-events: auto !important;
    }

    @media (hover: hover) {
      #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) {
        background: #242424 !important;
        cursor: pointer;
      }
    }

    #calendar .fc-day-disabled {
      opacity: 0.35 !important;
    }

    #calendar .fc-daygrid-day[data-reserved="true"] {
      background: #4a0000 !important;
      opacity: 0.8;
      pointer-events: none !important;
    }

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
      max-width: 480px;
      color: #fff;
      border: 1px solid #333;
    }

    #reservationModal input,
    #reservationModal select {
      width: 100%;
      padding: 8px;
      margin: 6px 0 12px;
      border-radius: 6px;
      background: #2a2a2a;
      border: 1px solid #444;
      color: #fff;
    }

    #reservationModal button {
      padding: 12px;
      border-radius: 8px;
      border: none;
      margin-top: 8px;
      width: 100%;
    }

    #res-confirm { background: #6f4cff; color: #fff; }
    #res-confirm:disabled { opacity: 0.4; cursor: not-allowed; }

    #res-cancel { background: #333; color: #fff; }

    #res-error {
      color: #ff8b8b;
      margin-top: 6px;
      display: none;
    }
  `;

  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // -------------------------------
  // 2) Helpers
  // -------------------------------
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(12,0,0,0); // ✅ 12h pour éviter décalage
    return d;
  }

  function formatLocalDate(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
  }

  function getTarif(dateStr, testPayment = false) {
    if (testPayment) return 1;
    const d = new Date(dateStr);
    const day = d.getDay();
    if (day === 5 || day === 6) return 169;
    if (day === 0) return 190;
    return 150;
  }

  function sumPrice(startStr, nights, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    cur.setHours(12,0,0,0); // ✅ 12h pour éviter décalage
    for (let i = 0; i < nights; i++) {
      total += getTarif(formatLocalDate(cur), testPayment);
      cur = addDays(cur, 1);
    }
    return total;
  }

  function isRangeAvailable(startDate, nights, reservedRanges) {
    const start = new Date(startDate);
    start.setHours(12,0,0,0); // ✅ 12h
    const end = addDays(start, nights);
    const today = new Date(); today.setHours(0,0,0,0);

    if (start < today) return false;

    return !reservedRanges.some(r => start < r.end && end > r.start);
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

  // -------------------------------
  // 3) DOM READY
  // -------------------------------
  document.addEventListener("DOMContentLoaded", async () => {

    const el = document.getElementById("calendar");
    if (!el) return;

    const modal = document.getElementById("reservationModal");
    const modalStart = document.getElementById("modal-start");
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

    const config = await getConfig();
    const testPayment = config.testPayment;

    let reservedRanges = [];
    let reservationsLoaded = false;
    let clickedStart = null;

    inputNights.value = 1;
    inputPersons.value = 2;

    // -------------------------------
    // FullCalendar
    // -------------------------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "fr",
      firstDay: 1,
      height: "auto",

      events: async (_, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM`);
          const data = await res.json();

          reservedRanges = data.map(e => {
            const s = new Date(e.start); s.setHours(12,0,0,0);
            const end = new Date(e.end); end.setHours(12,0,0,0);
            return { start: s, end };
          });

          reservationsLoaded = true;

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
        if (!reservationsLoaded) {
          alert("Chargement du calendrier, veuillez patienter quelques secondes.");
          return;
        }

        const d = info.date;
        clickedStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0); // ✅ 12h pour éviter décalage

        modalStart.textContent = formatLocalDate(clickedStart);
        errorBox.style.display = "none";
        modal.style.display = "flex";

        updateModal();
      }
    });

    cal.render();

    // -------------------------------
    // Modal logic
    // -------------------------------
    function updateModal() {
      if (!clickedStart || !reservationsLoaded) {
        btnConfirm.disabled = true;
        return;
      }

      let nights = Math.max(1, parseInt(inputNights.value) || 1);
      let persons = Math.min(2, Math.max(1, parseInt(inputPersons.value) || 1));

      inputNights.value = nights;
      inputPersons.value = persons;

      const ok = isRangeAvailable(clickedStart, nights, reservedRanges);

      errorBox.style.display = ok ? "none" : "block";
      if (!ok) errorBox.textContent = "La période sélectionnée n'est pas disponible.";

      const total = sumPrice(formatLocalDate(clickedStart), nights, testPayment);
      priceDisplay.textContent = `Montant total : ${total} €`;

      btnConfirm.disabled = !ok;
    }

    inputNights.addEventListener("input", updateModal);
    inputPersons.addEventListener("input", updateModal);

    // -------------------------------
    // Cancel
    // -------------------------------
    btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // -------------------------------
    // Confirm
    // -------------------------------
    btnConfirm.addEventListener("click", async () => {

      if (btnConfirm.disabled) return;

      const nights = parseInt(inputNights.value);
      const startDate = formatLocalDate(clickedStart);
      const endDate = formatLocalDate(addDays(clickedStart, nights));
      const total = sumPrice(startDate, nights, testPayment);

      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();

      if (!name || !email || !phone) {
        errorBox.style.display = "block";
        errorBox.textContent = "Veuillez remplir tous les champs.";
        return;
      }

      if (!confirm(`Confirmer la réservation du ${startDate} au ${endDate} pour ${total} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLŌM",
            startDate,
            endDate,
            amount: total,
            personnes: 2,
            name,
            email,
            phone
          })
        });

        const data = await res.json();
        if (data.url) location.href = data.url;
        else alert("Erreur lors de la réservation.");
      } catch {
        alert("Erreur réseau.");
      }
    });

    modal.addEventListener("click", e => {
      if (e.target === modal) modal.style.display = "none";
    });

  });

})();
