// ========================================================
// 🌿 LIVA Calendar JS - Version Finale (Desktop + Mobile)
// ========================================================

(async function () {

  // -------------------------------
  // 1) CSS : style + mobile safe
  // -------------------------------
  const css = `
    #calendar, #calendar * { touch-action: manipulation !important; -webkit-user-select: none !important; user-select: none !important; }
    #calendar .fc { background: #fff !important; color: #000 !important; font-family: "Inter", sans-serif; }
    #calendar .fc-daygrid-day { background: #fdfdfd !important; border-color: #ddd !important; transition: background 0.15s ease; pointer-events: auto !important; }
    @media (hover: hover) { #calendar .fc-daygrid-day:hover:not([data-reserved="true"]) { background: #eee !important; cursor: pointer; } }
    #calendar .fc-day-disabled { opacity: 0.35 !important; }
    #calendar .fc-daygrid-day[data-reserved="true"] { background: #ffcccc !important; opacity: 0.8; pointer-events: none !important; }

    #reservationModal { z-index: 2000; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px); display: none; justify-content: center; align-items: center; padding: 20px; }
    #reservationModal .modal-content { background: #fff; padding: 20px; border-radius: 10px; width: 90%; max-width: 480px; color: #000; border: 1px solid #ccc; }
    #reservationModal input, #reservationModal select { width: 100%; padding: 8px; margin: 6px 0 12px; border-radius: 6px; background: #f9f9f9; border: 1px solid #ccc; color: #000; }
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

  function formatLocalDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function getTarif(dateStr, nbPersonnes = 2, testPayment = false) {
    if (testPayment) return 1;
    let base = 79; // prix LIVA de base
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
    const selEnd = addDays(selStart, nights);
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

    const calendarBackend = location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";
    const stripeBackend = location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";
    const config = await getConfig();
    const testPayment = config.testPayment;

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

    let reservedRanges = [];
    let clickedStart = null;

    if (inputNights) inputNights.value = 1;
    if (inputPersons) inputPersons.value = 2;

    // -------------------------------
    // FullCalendar
    // -------------------------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: true,
      firstDay: 1,
      locale: "fr",
      height: "auto",

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA`);
          const data = await res.json();
          reservedRanges = data.map(e => {
            const s = new Date(e.start);
            const exEnd = new Date(e.end);
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
      },

      dateClick(info) {
        const today = new Date(); today.setHours(0,0,0,0);

        clickedStart = new Date(info.date.getFullYear(), info.date.getMonth(), info.date.getDate());
        if (clickedStart < today) return;

        const blocked = reservedRanges.some(r => clickedStart >= r.start && clickedStart < r.end);
        if (blocked) return;

        if (modalStart) modalStart.textContent = formatLocalDate(clickedStart);
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
      const persons = Math.max(1, parseInt(inputPersons.value, 10) || 1);

      const ok = isRangeAvailable(clickedStart, nights, reservedRanges);
      if (errorBox) { errorBox.style.display = ok ? 'none' : 'block'; errorBox.textContent = ok ? '' : "La période sélectionnée chevauche une réservation existante."; }

      const total = sumPriceByNights(formatLocalDate(clickedStart), nights, persons, testPayment);
      if (priceDisplay) priceDisplay.textContent = `Montant total : ${total} €`;
      if (btnConfirm) btnConfirm.disabled = !ok;
    }

    if (inputNights) inputNights.addEventListener('input', updateModalPriceAndAvailability);
    if (inputPersons) inputPersons.addEventListener('input', updateModalPriceAndAvailability);

    if (btnCancel) btnCancel.addEventListener('click', () => { if (modal) modal.style.display = 'none'; clickedStart = null; });
    if (btnConfirm) btnConfirm.addEventListener('click', async () => {
      if (!clickedStart) return;
      const nights = Math.max(1, parseInt(inputNights.value, 10) || 1);
      const persons = Math.max(1, parseInt(inputPersons.value, 10) || 1);

      if (!isRangeAvailable(clickedStart, nights, reservedRanges)) { if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Période non disponible.'; } return; }

      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();

      if (!name || !email || !phone) { if (errorBox) { errorBox.style.display = 'block'; errorBox.textContent = 'Veuillez remplir tous les champs.'; } return; }

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
        if (data.url) { if (modal) modal.style.display = 'none'; location.href = data.url; }
        else alert("Erreur lors de la création de la réservation.");
      } catch (err) { alert("Erreur réseau lors de la réservation."); }
    });

    if (modal) modal.addEventListener('click', (ev) => { if (ev.target === modal) { modal.style.display = 'none'; clickedStart = null; } });

  });

})();
