// ========================================================
// 🌸 BLŌM Calendar JS - Mode "Date départ -> Nuits" (Desktop + Mobile)
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
      max-width: 480px;
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

  function sumPriceByNights(startStr, nights, nbPersons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    for (let i = 0; i < nights; i++) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    return total;
  }

  // check availability: start (Date), nights (integer)
  // reservedRanges contains {start: Date, end: Date} with end EXCLUSIVE
  function isRangeAvailable(startDate, nights, reservedRanges) {
    const selStart = new Date(startDate);
    selStart.setHours(0,0,0,0);
    const selEnd = addDays(selStart, nights); // exclusive

    // validate not in the past
    const today = new Date(); today.setHours(0,0,0,0);
    if (selStart < today) return false;

    // overlap test: selStart < r.end && selEnd > r.start
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

    // Modal elements expected in DOM:
    // #reservationModal
    // #modal-start (text)
    // #res-nights (number input)
    // #res-persons (number input)
    // #modal-price (span)
    // #res-name, #res-email, #res-phone
    // #res-confirm, #res-cancel, #res-error
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

    if (!modal || !modalStart || !inputNights || !inputPersons || !priceDisplay || !btnConfirm) {
      console.warn("Reservation modal elements manquants — vérifier le HTML (ids requis).");
      // still continue but cannot open modal
    }

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";
    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const config = await getConfig();
    const testPayment = config.testPayment;

    let reservedRanges = []; // {start: Date, end: Date} end is EXCLUSIVE
    let clickedStart = null; // Date
    // default inputs
    if (inputNights) inputNights.value = 1;
    if (inputPersons) inputPersons.value = 2;

    // -------------------------------
    // FullCalendar setup (selectable disabled, we use dateClick flow)
    // -------------------------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: false, // we handle selection via modal
      firstDay: 1,
      locale: "fr",
      height: "auto",

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM`);
          const data = await res.json();

          // IMPORTANT: ensure end is exclusive for FullCalendar by adding 1 day
          // assume API returns e.start and e.end as ISO dates (end = last booked night)
          reservedRanges = data.map(e => {
            const s = new Date(e.start);
            const rawEnd = new Date(e.end);
            // if API already returns end exclusive, this will shift by 1 day erroneously.
            // But previous debugging showed we need to make end exclusive: add 1 day.
            const exEnd = addDays(rawEnd, 1);
            s.setHours(0,0,0,0);
            exEnd.setHours(0,0,0,0);
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
        // mark reserved days visually (info.date is the cell's date)
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) info.el.setAttribute("data-reserved", "true");
      },

      // dateClick triggered on both desktop click and mobile tap
      dateClick(info) {
        const dateClicked = new Date(info.dateStr);
        dateClicked.setHours(0,0,0,0);

        // If cell is reserved (in reservedRanges), do nothing
        const blocked = reservedRanges.some(r => dateClicked >= r.start && dateClicked < r.end);
        if (blocked) return;

        // open modal to choose nights
        clickedStart = dateClicked;
        if (modalStart) modalStart.textContent = formatDateISO(clickedStart);
        if (inputNights) inputNights.value = 1;
        if (inputPersons) inputPersons.value = 2;
        if (errorBox) { errorBox.style.display = 'none'; errorBox.textContent = ''; }
        // update price
        const price = sumPriceByNights(formatDateISO(clickedStart), parseInt(inputNights.value,10)||1, parseInt(inputPersons.value,10)||2, testPayment);
        if (priceDisplay) priceDisplay.textContent = `Montant total : ${price} €`;

        if (modal) modal.style.display = 'flex';
      }
    });

    cal.render();

    // -------------------------------
    // Modal behaviour: update price & validate availability
    // -------------------------------
    function updateModalPriceAndAvailability() {
      if (!clickedStart) return;
      const nights = Math.max(1, parseInt(inputNights.value, 10) || 1);
      const persons = Math.max(1, parseInt(inputPersons.value, 10) || 1);

      // check availability
      const ok = isRangeAvailable(clickedStart, nights, reservedRanges);
      if (errorBox) {
        if (!ok) {
          errorBox.style.display = 'block';
          errorBox.textContent = "La période sélectionnée chevauche une réservation existante. Choisissez moins de nuits ou une autre date.";
        } else {
          errorBox.style.display = 'none';
          errorBox.textContent = '';
        }
      }

      // update price
      const total = sumPriceByNights(formatDateISO(clickedStart), nights, persons, testPayment);
      if (priceDisplay) priceDisplay.textContent = `Montant total : ${total} €`;
      // enable/disable confirm
      if (btnConfirm) btnConfirm.disabled = !ok;
    }

    if (inputNights) inputNights.addEventListener('input', updateModalPriceAndAvailability);
    if (inputPersons) inputPersons.addEventListener('input', updateModalPriceAndAvailability);

    // cancel
    if (btnCancel) btnCancel.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
      clickedStart = null;
    });

    // confirm -> proceed to backend / stripe
    if (btnConfirm) btnConfirm.addEventListener('click', async () => {
      if (!clickedStart) return;
      const nights = Math.max(1, parseInt(inputNights.value, 10) || 1);
      const persons = Math.max(1, parseInt(inputPersons.value, 10) || 1);

      // final availability check
      if (!isRangeAvailable(clickedStart, nights, reservedRanges)) {
        if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Période non disponible. Réessayez.'; }
        return;
      }

      // collect contact
      const name = inputName ? inputName.value.trim() : '';
      const email = inputEmail ? inputEmail.value.trim() : '';
      const phone = inputPhone ? inputPhone.value.trim() : '';

      if (!name || !email || !phone) {
        if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Veuillez remplir nom, email et téléphone.'; }
        return;
      }

      const startDate = formatDateISO(clickedStart);
      const endDateObj = addDays(clickedStart, nights); // exclusive end
      const endDate = formatDateISO(endDateObj);

      const total = sumPriceByNights(startDate, nights, persons, testPayment);

      if (!confirm(`Confirmer la réservation du ${startDate} au ${endDate} (${nights} nuits) pour ${total} € ?`)) return;

      // create checkout session
      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLŌM",
            startDate,
            endDate, // end exclusive (backend should understand)
            amount: total,
            personnes: persons,
            name,
            email,
            phone
          })
        });
        const data = await res.json();
        if (data.url) {
          // optionally close modal before redirect
          if (modal) modal.style.display = 'none';
          location.href = data.url;
        } else {
          alert("Impossible de créer la réservation. Réessayez plus tard.");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur réseau lors de la création de la réservation.");
      }
    });

    // close modal on outside click (optional)
    if (modal) modal.addEventListener('click', (ev) => {
      if (ev.target === modal) {
        modal.style.display = 'none';
        clickedStart = null;
      }
    });

  });

})();
