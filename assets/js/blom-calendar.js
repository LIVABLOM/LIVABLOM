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
      margin: 0;
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

#same-day-warning {
  display: none;
  background: #3a2f00;
  color: #fff3cd;
  padding: 12px;
  border-radius: 10px;
  margin: 12px 0;
  line-height: 1.45;
  border: 1px solid #7a6400;
}

#same-day-warning a {
  display: inline-block;
  background: #fff;
  color: #000;
  padding: 9px 13px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
}
`;

  document.head.appendChild(Object.assign(document.createElement("style"), {
    textContent: css
  }));

  // -------------------------------
  // 2) VARIABLES PROMO (🔥 AJOUT IMPORTANT)
  // -------------------------------
  let currentDiscount = 0; // % de réduction (0 à 1)

  // -------------------------------
  // Helpers
  // -------------------------------
  function addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    d.setHours(12,0,0,0);
    return d;
  }

  function formatLocalDate(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
  }

  function todayParisISO() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function isSameDayBooking(date) {
  if (!date) return false;
  return formatLocalDate(date) === todayParisISO();
}

  // Tarifs spéciaux prioritaires sur les tarifs habituels
  const specialRates = {
    "2026-12-24": 199,
    "2026-12-25": 199,
    "2026-12-31": 249,
    "2027-01-01": 199,
    "2027-02-13": 249,
    "2027-02-14": 199
  };

  function isSpecialRateDate(dateStr) {
    return Object.prototype.hasOwnProperty.call(specialRates, dateStr);
  }

  function rangeHasSpecialRate(startStr, nights) {
    let cur = new Date(startStr);
    cur.setHours(12,0,0,0);

    for (let i = 0; i < nights; i++) {
      if (isSpecialRateDate(formatLocalDate(cur))) return true;
      cur = addDays(cur, 1);
    }
    return false;
  }

  function getTarif(dateStr, testPayment = false) {
    if (testPayment) return 1;

    // Un tarif spécial prend toujours la priorité
    if (isSpecialRateDate(dateStr)) return specialRates[dateStr];

    const d = new Date(`${dateStr}T12:00:00`);
    const day = d.getDay();
    if (day === 5 || day === 6) return 175;
    if (day === 0) return 175;
    return 150;
  }

  function sumPrice(startStr, nights, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    cur.setHours(12,0,0,0);

    for (let i = 0; i < nights; i++) {
      total += getTarif(formatLocalDate(cur), testPayment);
      cur = addDays(cur, 1);
    }
    return total;
  }

  function isRangeAvailable(startDate, nights, reservedRanges) {
    const start = new Date(startDate);
    start.setHours(12,0,0,0);

    const end = addDays(start, nights);
    const today = new Date(); 
    today.setHours(0,0,0,0);

    if (start < today) return false;

    return !reservedRanges.some(r => start < r.end && end > r.start);
  }

  async function getConfig() {
    try {
      const backend = ["localhost", "127.0.0.1"].includes(location.hostname)
        ? "http://localhost:5002"
        : "https://livablom-stripe-production.up.railway.app";

      const res = await fetch(`${backend}/api/config`);
      if (!res.ok) throw new Error("Configuration indisponible");
      const config = await res.json();
      if (typeof config.testPayment !== "boolean") throw new Error("Configuration invalide");
      return config;
    } catch {
      return null;
    }
  }

  // -------------------------------
  // DOM READY
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
    const promoInput = document.getElementById("res-promo");
    const promoMsg = document.getElementById("promo-msg");
    const sameDayWarning = document.getElementById("same-day-warning");

    const btnCancel = document.getElementById("res-cancel");
    const btnConfirm = document.getElementById("res-confirm");
    const errorBox = document.getElementById("res-error");

    const calendarBackend = ["localhost", "127.0.0.1"].includes(location.hostname)
      ? "http://localhost:5001"
      : "https://calendar-proxy-production-ed46.up.railway.app";

    const stripeBackend = ["localhost", "127.0.0.1"].includes(location.hostname)
      ? "http://localhost:5002"
      : "https://livablom-stripe-production.up.railway.app";

    const config = await getConfig();
    const promoEnabled = config?.promoEnabled !== false;
    const testPayment = config?.testPayment === true;

    let reservedRanges = [];
    let reservationsLoaded = false;
    let clickedStart = null;
    let submitting = false;
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.style.textAlign = "center";
    el.before(status);
    status.textContent = config ? "Chargement des disponibilités…" : "Impossible de charger les tarifs. Rechargez la page.";


    inputNights.value = 1;
    inputPersons.value = 2;

    // -------------------------------
    // CALENDAR
    // -------------------------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "fr",
      firstDay: 1,
      height: "auto",

      events: async (_, success, failure) => {
        try {
          reservationsLoaded = false;
          updateModal();
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM`, { cache: "no-store" });
          if (!res.ok) throw new Error("Disponibilités indisponibles");
          const data = await res.json();

          if (!Array.isArray(data)) throw new Error("Calendrier invalide");
          reservedRanges = data.map(e => {
            const s = new Date(String(e.start).slice(0,10) + "T12:00:00");
            const end = new Date(String(e.end).slice(0,10) + "T12:00:00");
            if (!Number.isFinite(+s) || !Number.isFinite(+end) || end <= s) throw new Error("Dates invalides");
            return { start: s, end };
          });

          reservationsLoaded = true;
          status.textContent = config ? "Choisissez une date disponible." : "Impossible de charger les tarifs. Rechargez la page.";
          updateModal();

          success(reservedRanges.map(r => ({
            start: r.start,
            end: r.end,
            display: "background",
            allDay: true,
            backgroundColor: "#900"
          })));
        } catch (err) {
          reservationsLoaded = false;
          btnConfirm.disabled = true;
          status.textContent = "Impossible de vérifier les disponibilités. Rechargez la page.";
          failure(err);
        }
      },

      dayCellDidMount(info) {
        if (reservedRanges.some(r => formatLocalDate(info.date) >= formatLocalDate(r.start) && formatLocalDate(info.date) < formatLocalDate(r.end))) {
          info.el.setAttribute("data-reserved", "true");
        }
      },

      dateClick(info) {
        if (!reservationsLoaded || !config || submitting) return;

        const d = info.date;
        clickedStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);

        modalStart.textContent = formatLocalDate(clickedStart);
        errorBox.style.display = "none";
        modal.style.display = "flex";

        updateModal();
      }
    });

    cal.render();

    // -------------------------------
    // 🔥 UPDATE MODAL (REMIS À JOUR)
    // -------------------------------
   function updateModal() {

  if (!clickedStart || !reservationsLoaded || !config || submitting) {
    btnConfirm.disabled = true;
    return;
  }

  const sameDay = isSameDayBooking(clickedStart);

  if (sameDayWarning) {
    sameDayWarning.style.display = sameDay ? "block" : "none";
  }

  if (sameDay) {
    priceDisplay.textContent = "Réservation immédiate indisponible pour une arrivée aujourd’hui.";
    errorBox.style.display = "none";
    btnConfirm.disabled = true;
    return;
  }

  const nights = Number(inputNights.value);
  if (!Number.isInteger(nights) || nights < 1 || nights > 90) {
    btnConfirm.disabled = true;
    errorBox.style.display = "block";
    errorBox.textContent = "Indiquez un nombre de nuits entre 1 et 90.";
    return;
  }

  const startDateStr = formatLocalDate(clickedStart);
  const baseTotal = sumPrice(startDateStr, nights, testPayment);
  const hasSpecialRate = rangeHasSpecialRate(startDateStr, nights);
  const effectiveDiscount = hasSpecialRate || !promoEnabled ? 0 : currentDiscount;

  let total = Math.round(baseTotal * (1 - effectiveDiscount));

  priceDisplay.textContent = `Montant total : ${total} €`;

  if (promoInput && promoMsg) {
    const code = promoInput.value.trim().toUpperCase();

    if (hasSpecialRate && code.length > 0) {
      promoMsg.textContent = "ℹ️ Les codes promo ne sont pas valables sur les dates spéciales.";
      promoMsg.style.color = "#ffd27a";
    } else if (code === "BLOM10") {
      promoMsg.textContent = "✅ -10% appliqué";
      promoMsg.style.color = "#8fffaa";
    } else if (code === "LOVE15") {
      promoMsg.textContent = "✅ -15% appliqué";
      promoMsg.style.color = "#8fffaa";
    } else if (code.length > 0) {
      promoMsg.textContent = "❌ Code invalide";
      promoMsg.style.color = "#ff8b8b";
    } else {
      promoMsg.textContent = "";
    }
  }

  const ok = isRangeAvailable(clickedStart, nights, reservedRanges);

  errorBox.style.display = ok ? "none" : "block";
  if (!ok) errorBox.textContent = "La période sélectionnée n'est pas disponible.";

  btnConfirm.disabled = !ok;
}

    inputNights.addEventListener("input", updateModal);
    inputPersons.addEventListener("input", updateModal);

   // -------------------------------
// -------------------------------
// 🔥 PROMO FIX PROPRE
// -------------------------------
if (promoInput && promoMsg) {

  promoInput.addEventListener("input", () => {

    const code = promoInput.value.trim().toUpperCase();

    currentDiscount = 0;
    if (code === "BLOM10") currentDiscount = 0.10;
    else if (code === "LOVE15") currentDiscount = 0.15;

    updateModal();
  });

}
    // -------------------------------
    // CONFIRM
    // -------------------------------
  btnConfirm.addEventListener("click", async () => {
    if (submitting) return;
    updateModal();
    if (btnConfirm.disabled) return;
    if (!inputName.value.trim() || !inputEmail.value.trim() || !inputEmail.checkValidity() || !inputPhone.value.trim()) {
      errorBox.style.display = "block";
      errorBox.textContent = "Renseignez votre nom, un email valide et votre téléphone.";
      return;
    }
    const nights = Number(inputNights.value);
    const startDate = formatLocalDate(clickedStart);
    const endDate = formatLocalDate(addDays(clickedStart, nights));
    const hasSpecialRate = rangeHasSpecialRate(startDate, nights);
    const discount = hasSpecialRate || !promoEnabled ? 0 : currentDiscount;
    const amount = Math.round(sumPrice(startDate, nights, testPayment) * (1 - discount));
    submitting = true;
    btnConfirm.disabled = true;
    btnConfirm.textContent = "Vérification…";
    btnCancel.disabled = true;
    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logement: "BLŌM", startDate, endDate, amount, personnes: 2,
          name: inputName.value.trim(), email: inputEmail.value.trim(), phone: inputPhone.value.trim(),
          promoCode: hasSpecialRate || !promoEnabled ? "" : (promoInput?.value || "").trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        if (data.error === "dates_unavailable") cal.refetchEvents();
        throw new Error(data.message || "Impossible de créer la réservation. Merci de nous contacter.");
      }
      const destination = new URL(data.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") throw new Error("Lien de paiement invalide.");
      location.href = destination.href;
    } catch (err) {
      errorBox.style.display = "block";
      errorBox.textContent = err.message === "Failed to fetch" ? "Connexion interrompue. Vérifiez les serveurs locaux avant de réessayer." : err.message;
    } finally {
      submitting = false;
      btnConfirm.textContent = "Confirmer";
      btnCancel.disabled = false;
      // La réservation temporaire éventuellement créée sera vérifiée par le serveur.
      // Conserver le message d’erreur après la requête.
      btnConfirm.disabled = !reservationsLoaded || !config;
    }
  });

        btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
    });

  });

})();