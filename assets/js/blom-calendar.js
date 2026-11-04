// ========================================================
// 🌸 BLŌM Calendar JS – Version STABLE & CORRIGÉE
// ========================================================

(async function () {

  // -------------------------------
  // 1) CSS
  // -------------------------------
  // Le CSS principal se trouve dans blom-calendar.html.
  // Ici : uniquement les éléments générés dynamiquement par le JavaScript.
  const css = `
    #calendar .fc-daygrid-day-frame { position: relative; }
    #calendar .fc-daygrid-day-top { position: relative; z-index: 2; }
    #calendar .blom-day-price {
      display: block; width: fit-content; margin: 2px 6px 5px auto;
      padding: 4px 7px; border-radius: 7px;
      background: #30291e; color: #f0dfb9;
      font-size: .76rem; font-weight: 700; line-height: 1.15;
      white-space: nowrap; pointer-events: none;
    }
    #calendar .blom-day-price.is-special {
      background: #51402b; color: #fff0cf;
    }
    #calendar .fc-daygrid-day[data-reserved="true"] {
      background: #34251f !important; cursor: not-allowed;
    }
    #calendar .fc-daygrid-day[data-reserved="true"] .blom-day-price {
      background: #57352d; color: #ffe0d4;
    }
    #calendar .fc-daygrid-day[data-past="true"] {
      opacity: .38; cursor: not-allowed;
    }
    #calendar .fc-daygrid-day:not([data-reserved="true"]):not([data-past="true"]):hover {
      background: #29251c !important; cursor: pointer;
    }
    #calendar .fc-bg-event { opacity: .18; pointer-events: none; }
    #calendar .fc-daygrid-day[data-reserved="true"] .fc-daygrid-day-number {
      color: #edc7bb;
    }
    #same-day-warning { display: none; }
    @media (max-width: 768px) {
      #calendar .blom-day-price {
        font-size: .62rem; padding: 3px 3px;
        margin: 0 1px 3px auto; letter-spacing: -.015em;
      }
    }
    @media (max-width: 370px) {
      #calendar .blom-day-price { font-size: .55rem; padding: 2px; }
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

    if (["localhost", "127.0.0.1"].includes(location.hostname)) {
  return {
    testPayment: false,
    promoEnabled: true
  };
}
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

   const calendarBackend =
  "https://calendar-proxy-production-ed46.up.railway.app";

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
    // Bloque les nouvelles tentatives après une erreur de création du paiement.
    let checkoutRetryLocked = false;
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    status.style.textAlign = "center";
    el.before(status);
    status.textContent = config ? "Chargement des disponibilités…" : "Impossible de charger les tarifs. Rechargez la page.";


    inputNights.value = 1;
    inputPersons.value = 2;

    // Les étiquettes de tarif sont purement visuelles : aucune réservation
    // n'est autorisée tant que les API n'ont pas répondu correctement.
    function isReservedDate(dateStr) {
      return reservedRanges.some(r =>
        dateStr >= formatLocalDate(r.start) && dateStr < formatLocalDate(r.end)
      );
    }

    function updateDayAppearance(dayCell) {
      const dateStr = dayCell.getAttribute("data-date");
      if (!dateStr) return;

      const past = dateStr < todayParisISO();
      const reserved = reservationsLoaded && isReservedDate(dateStr);
      if (past) dayCell.setAttribute("data-past", "true");
      else dayCell.removeAttribute("data-past");
      if (reserved) dayCell.setAttribute("data-reserved", "true");
      else dayCell.removeAttribute("data-reserved");

      let label = dayCell.querySelector(".blom-day-price");
      if (!label) {
        label = document.createElement("span");
        label.className = "blom-day-price";
        const top = dayCell.querySelector(".fc-daygrid-day-top");
        if (!top) return;
        top.insertAdjacentElement("afterend", label);
      }
      if (reserved) {
        label.textContent = "Réservé";
        label.classList.remove("is-special");
      } else if (past) {
        label.textContent = "";
        label.classList.remove("is-special");
      } else {
        label.textContent = `${getTarif(dateStr)} €`;
        label.classList.toggle("is-special", isSpecialRateDate(dateStr));
      }
    }

    function refreshDayAppearances() {
      el.querySelectorAll(".fc-daygrid-day[data-date]").forEach(updateDayAppearance);
    }

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
          refreshDayAppearances();
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
          reservedRanges = [];
          refreshDayAppearances();
          btnConfirm.disabled = true;
          status.textContent = "Disponibilités non vérifiées : réservation désactivée. Vérifiez les serveurs locaux 5001 et 5002.";
          failure(err);
        }
      },

      dayCellDidMount(info) {
        updateDayAppearance(info.el);
      },

      dateClick(info) {
        if (!reservationsLoaded || !config || submitting || checkoutRetryLocked) return;

        const d = info.date;
        if (info.dateStr < todayParisISO() || isReservedDate(info.dateStr)) return;
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

  if (!clickedStart || !reservationsLoaded || !config || submitting || checkoutRetryLocked) {
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

 const isLocal = ["localhost", "127.0.0.1"]
  .includes(location.hostname);

btnConfirm.disabled = !ok || isLocal;
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
      // Une erreur réseau peut se produire après création d'une session Stripe.
      checkoutRetryLocked = true;
      errorBox.style.display = "block";
      errorBox.textContent = `${err.message || "Impossible de finaliser la demande."} Ne relancez pas immédiatement le paiement : vérifiez d'abord vos e-mails ou contactez-nous pour confirmer votre réservation.`;
    } finally {
      submitting = false;
      btnConfirm.textContent = "Confirmer";
      btnCancel.disabled = false;
      // Après un échec, une nouvelle tentative requiert le rechargement de la page.
      // Ne pas écraser le message d'erreur ni réactiver le bouton.
      if (checkoutRetryLocked) {
        btnConfirm.disabled = true;
      } else {
        updateModal();
      }
    }
  });

        btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
    });

  });

})();