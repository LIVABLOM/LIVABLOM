// ========================================================
// 🌿 LIVA Calendar JS - Version blanche & style identique à BLŌM pour comportement
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

    #calendar .fc { 
      background: #ffffff !important;  /* Fond blanc */
      color: #000 !important;          /* Texte noir */
      font-family: "Inter", sans-serif; 
    }

    #calendar .fc-daygrid-day { 
      background: #ffffff !important;  /* Fond blanc pour toutes les cellules */
      border-color: #ddd !important; 
      transition: background 0.15s ease; 
      pointer-events: auto !important; 
      color: #000 !important;
    }

    @media (hover: hover) {
      #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) { 
        background: #eee !important; 
        cursor: pointer; 
      }
    }

    #calendar .fc-day-disabled { opacity: 0.35 !important; }

    /* jours réservés rouge vif (comme BLŌM) */
    #calendar .fc-daygrid-day[data-reserved="true"] { 
      background: #900 !important; 
      opacity: 0.9; 
      pointer-events: none !important; 
      color: #fff !important;
    }

    /* Modal style (texte noir, fond blanc dans HTML) */
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
    #reservationModal input, #reservationModal select {
      width: 100%;
      padding: 8px;
      margin: 6px 0 12px;
      border-radius: 6px;
      background: #fafafa;
      border: 1px solid #ccc;
      color: #000;
    }
    #reservationModal button { padding: 12px; border-radius: 8px; border: none; margin-top: 8px; width: 100%; }
    #res-confirm { background: #0077ff; color: #fff; }
    #res-cancel { background: #ccc; color: #000; }
    #res-error { color: #c00; margin-top: 6px; display: none; }
  `;

  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // -------------------------------
  // 2) Helpers (inchangés)
  // -------------------------------
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(0,0,0,0);
    return d;
  }

  function formatLocalDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
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
      total += getTarif(formatLocalDate(cur), nbPersons, testPayment);
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
      if (selStart < r.end && selEnd > r.start) return false;
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

    const config = await getConfig();
    const testPayment = config.testPayment;

    let reservedRanges = [];
    let clickedStart = null;

    // initial values
    if (inputNights) inputNights.value = 1;
    if (inputPersons) inputPersons.value = 2;

    // -------------------------------
    // NEW: mobile-safe limits for inputs
    // -------------------------------
    // LIVA: max 5 persons, nights 1..30
    const MAX_PERSONS = 5;
    const MAX_NIGHTS = 30;

    function clampNumberInput(el, min, max) {
      if (!el) return;
      // set attributes for native enforcement / UI hints
      el.setAttribute('min', String(min));
      el.setAttribute('max', String(max));
      // ensure only digits and clamp value on input
      el.addEventListener('input', () => {
        // remove non-digit characters
        const raw = el.value;
        // allow empty while typing, but normalize when not numeric
        if (raw === '') return;
        // parse int safely
        let n = parseInt(raw.replace(/[^\d-]/g, ''), 10);
        if (isNaN(n)) {
          el.value = min;
          n = min;
        }
        if (n < min) {
          el.value = String(min);
        } else if (n > max) {
          el.value = String(max);
        } else {
          el.value = String(n);
        }
        // trigger a custom event so existing logic updates price/availability
        const ev = new Event('input', { bubbles: true });
        el.dispatchEvent(ev);
      }, { passive: true });
      // also clamp on blur (in case of paste)
      el.addEventListener('blur', () => {
        if (el.value === '') el.value = String(min);
        let n = parseInt(el.value, 10);
        if (isNaN(n) || n < min) el.value = String(min);
        if (n > max) el.value = String(max);
        const ev = new Event('input', { bubbles: true });
        el.dispatchEvent(ev);
      });
    }

    clampNumberInput(inputPersons, 1, MAX_PERSONS);
    clampNumberInput(inputNights, 1, MAX_NIGHTS);

    // -------------------------------
    // FullCalendar
    // -------------------------------
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
            const s = new Date(e.start); s.setHours(0,0,0,0);
            const exEnd = new Date(e.end); exEnd.setHours(0,0,0,0);
            return { start: s, end: exEnd };
          });

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

      dayCellDidMount(info) {
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) {
          info.el.setAttribute("data-reserved", "true");
        } else {
          // Forcer fond blanc pour LIVA
          info.el.style.backgroundColor = "#ffffff";
          info.el.style.color = "#000000";
        }
      },

      dateClick(info) {
        const today = new Date(); today.setHours(0,0,0,0);
        const dateClicked = new Date(info.date.getFullYear(), info.date.getMonth(), info.date.getDate());
        if (dateClicked < today) return;

        const blocked = reservedRanges.some(r => dateClicked >= r.start && dateClicked < r.end);
        if (blocked) return;

        clickedStart = dateClicked;
        const displayStr = formatLocalDate(clickedStart);
        if (modalStart) modalStart.textContent = `Arrivée : ${displayStr}`;

        if (inputNights) inputNights.value = 1;
        if (inputPersons) inputPersons.value = 2;
        if (errorBox) { errorBox.style.display = 'none'; errorBox.textContent = ''; }

        const price = sumPriceByNights(formatLocalDate(clickedStart), 1, parseInt(inputPersons.value, 10), testPayment);
        if (priceDisplay) priceDisplay.textContent = `Montant total : ${price} €`;

        if (modal) modal.style.display = 'flex';
      }
    });

    cal.render();

    // -------------------------------
    // Modal price + availability
    // -------------------------------
    function updateModalPriceAndAvailability() {
      if (!clickedStart) return;
      const nights = Math.max(1, parseInt(inputNights.value, 10) || 1);
      // clamp persons (defensive)
      let persons = Math.max(1, parseInt(inputPersons.value, 10) || 1);
      if (persons > MAX_PERSONS) { persons = MAX_PERSONS; inputPersons.value = MAX_PERSONS; }

      const ok = isRangeAvailable(clickedStart, nights, reservedRanges);

      if (errorBox) {
        if (!ok) {
          errorBox.style.display = 'block';
          errorBox.textContent = "La période sélectionnée chevauche une réservation existante.";
        } else {
          errorBox.style.display = 'none';
          errorBox.textContent = '';
        }
      }

      const total = sumPriceByNights(formatLocalDate(clickedStart), nights, persons, testPayment);
      if (priceDisplay) priceDisplay.textContent = `Montant total : ${total} €`;

      if (btnConfirm) btnConfirm.disabled = !ok;
    }

    if (inputNights) inputNights.addEventListener('input', updateModalPriceAndAvailability);
    if (inputPersons) inputPersons.addEventListener('input', updateModalPriceAndAvailability);

    // Cancel modal
    if (btnCancel) btnCancel.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      clickedStart = null;
    });

    // Confirm reservation
    if (btnConfirm) btnConfirm.addEventListener('click', async () => {
      if (!clickedStart) return;

      const nights = Math.max(1, parseInt(inputNights.value, 10) || 1);
      const persons = Math.max(1, parseInt(inputPersons.value, 10) || 1);

      if (!isRangeAvailable(clickedStart, nights, reservedRanges)) {
        if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Période non disponible.'; }
        return;
      }

      const name = inputName ? inputName.value.trim() : '';
      const email = inputEmail ? inputEmail.value.trim() : '';
      const phone = inputPhone ? inputPhone.value.trim() : '';

      if (!name || !email || !phone) {
        if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Veuillez remplir tous les champs.'; }
        return;
      }

      const startDate = formatLocalDate(clickedStart);
      const endDate = formatLocalDate(addDays(clickedStart, nights));
      const total = sumPriceByNights(startDate, nights, persons, testPayment);

      if (!confirm(`Confirmer la réservation du ${startDate} au ${endDate} (${nights} nuits) pour ${total} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logement: "LIVA", startDate, endDate, amount: total, personnes: persons, name, email, phone })
        });

        const data = await res.json();
        if (data.url) {
          if (modal) modal.style.display = 'none';
          location.href = data.url;
        } else {
          alert("Erreur lors de la création de la réservation.");
        }
      } catch (err) {
        alert("Erreur réseau lors de la réservation.");
      }
    });

    // Close modal on outside click
    if (modal) modal.addEventListener('click', (ev) => {
      if (ev.target === modal) {
        modal.style.display = 'none';
        clickedStart = null;
      }
    });

  });

})();
