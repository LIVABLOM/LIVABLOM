// ========================================================
// 🌿 LIVA Calendar JS - Mode "Date départ -> Nuits" (Desktop + Mobile)
// ========================================================

(async function () {

  // -------------------------------
  // 1) CSS : mobile safe
  // -------------------------------
  const css = `
    #calendar, #calendar * {
      touch-action: manipulation !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }

    #calendar .fc { background: #f9f9f9 !important; color: #000 !important; font-family: "Inter", sans-serif; }
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
      border-radius: 12px;
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
      background: #f9f9f9;
      border: 1px solid #ccc;
      color: #000;
    }
    #reservationModal button { padding: 12px; border-radius: 8px; border: none; margin-top: 8px; width: 100%; }
    #res-confirm { background: #6f4cff; color: #fff; }
    #res-cancel { background: #333; color: #fff; }
    #res-error { color: #ff8b8b; margin-top:6px; display:none; }
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

    const modal = document.getElementById("reservationModal");
    const modalDates = document.getElementById("modal-dates");
    const inputName = document.getElementById("res-name");
    const inputEmail = document.getElementById("res-email");
    const inputPhone = document.getElementById("res-phone");
    const inputPersons = document.getElementById("res-persons");
    const inputNights = document.createElement("input");
    inputNights.type = "number";
    inputNights.min = 1;
    inputNights.value = 1;
    inputNights.style.marginBottom = "12px";
    inputNights.id = "res-nights";
    modal.querySelector(".modal-content").insertBefore(inputNights, modalDates.nextSibling);
    const priceDisplay = document.getElementById("modal-price");
    const errorBox = document.getElementById("res-error");
    const btnCancel = document.getElementById("res-cancel");
    const btnConfirm = document.getElementById("res-confirm");

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";
    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const configRes = await fetch(`${stripeBackend}/api/config`).then(r=>r.json());
    const testPayment = configRes.testPayment;

    let reservedRanges = [];
    let clickedStart = null;

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
            const s = new Date(e.start);
            const exEnd = addDays(new Date(e.end), 1);
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

        info.el.addEventListener("pointerup", ev => {
          const dateClicked = new Date(info.dateStr);
          dateClicked.setHours(0,0,0,0);
          const blocked = reservedRanges.some(r => dateClicked >= r.start && dateClicked < r.end);
          if (!blocked) openModal(dateClicked);
        }, { passive: true });
      }
    });

    cal.render();

    // -------------------------------
    // Modal functions
    // -------------------------------
    function openModal(startDate) {
      clickedStart = startDate;
      modalDates.textContent = `Date de départ : ${formatDateISO(clickedStart)}`;
      inputNights.value = 1;
      inputPersons.value = 2;
      errorBox.style.display = 'none';
      errorBox.textContent = '';
      updatePriceAndAvailability();
      modal.style.display = 'flex';
    }

    function updatePriceAndAvailability() {
      if (!clickedStart) return;
      const nights = Math.max(1, parseInt(inputNights.value, 10) || 1);
      const nbPersons = Math.max(1, parseInt(inputPersons.value, 10) || 2);
      const ok = isRangeAvailable(clickedStart, nights, reservedRanges);
      errorBox.style.display = ok ? 'none' : 'block';
      errorBox.textContent = ok ? '' : "La période chevauche une réservation existante.";
      priceDisplay.textContent = `Montant total : ${sumPriceByNights(formatDateISO(clickedStart), nights, nbPersons, testPayment)} €`;
      btnConfirm.disabled = !ok;
    }

    [inputNights, inputPersons, inputName, inputEmail, inputPhone].forEach(el=>{
      el.addEventListener('input', updatePriceAndAvailability);
    });

    btnCancel.addEventListener('click', ()=>{
      clickedStart = null;
      modal.style.display = 'none';
    });

    btnConfirm.addEventListener('click', async ()=>{
      if (!clickedStart) return;
      const nights = Math.max(1, parseInt(inputNights.value, 10)||1);
      const nbPersons = Math.max(1, parseInt(inputPersons.value, 10)||2);
      if (!isRangeAvailable(clickedStart, nights, reservedRanges)) {
        errorBox.style.display = 'block';
        errorBox.textContent = "Période non disponible.";
        return;
      }
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      if (!name || !email || !phone) {
        errorBox.style.display = 'block';
        errorBox.textContent = "Veuillez remplir nom, email et téléphone.";
        return;
      }
      const startDate = formatDateISO(clickedStart);
      const endDate = formatDateISO(addDays(clickedStart, nights));
      const total = sumPriceByNights(startDate, nights, nbPersons, testPayment);
      if (!confirm(`Confirmer la réservation du ${startDate} au ${endDate} (${nights} nuits) pour ${total} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({
            logement:"LIVA",
            startDate,
            endDate,
            amount: total,
            personnes: nbPersons,
            name,
            email,
            phone
          })
        });
        const data = await res.json();
        if (data.url) {
          modal.style.display = 'none';
          location.href = data.url;
        } else {
          alert("Impossible de créer la réservation.");
        }
      } catch(err){
        console.error(err);
        alert("Erreur réseau.");
      }
    });

    modal.addEventListener('click', ev => {
      if (ev.target === modal) {
        clickedStart = null;
        modal.style.display = 'none';
      }
    });

  });

})();
