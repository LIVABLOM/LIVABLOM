// ========================================================
// 🌿 LIVA Calendar JS - compatible avec le patch mobile/blom
// ========================================================

async function getConfig() {
  try {
    const stripeBackend = window.location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";
    const res = await fetch(`${stripeBackend}/api/config?ts=${Date.now()}`);
    if (!res.ok) throw new Error("Impossible de récupérer la config");
    return await res.json();
  } catch (err) {
    console.error("getConfig error:", err);
    return { testPayment: true };
  }
}

function getTarif(date, nbPersonnes = 2) {
  const base = 79;
  return nbPersonnes <= 2 ? base : base + (nbPersonnes - 2) * 20;
}

/* Helper: vérifie si une date ISO 'YYYY-MM-DD' est réservable */
function isDateSelectable(dateStr, reservedRanges) {
  if (!dateStr) return false;
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0,0,0,0);
  if (d < today) return false;
  if (!Array.isArray(reservedRanges)) return true;
  for (let r of reservedRanges) {
    const s = new Date(r.start + "T00:00:00");
    const e = new Date(r.end + "T00:00:00"); // on suppose end exclusive per backend
    // si d dans [s, e) alors réservé
    if (d >= s && d < e) return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", async function () {
  const el = document.getElementById("calendar");
  if (!el) return;

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  const cfg = await getConfig();
  const testPayment = cfg.testPayment;
  let reservedRanges = [];

  // Modal refs
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const inputName = document.getElementById("res-name");
  const inputEmail = document.getElementById("res-email");
  const inputPhone = document.getElementById("res-phone");
  const inputPersons = document.getElementById("res-persons");
  const priceDisplay = document.getElementById("modal-price");
  const btnCancel = document.getElementById("res-cancel");
  const btnConfirm = document.getElementById("res-confirm");

  let selectedStart = null;
  let selectedEnd = null;

  function validateForm() {
    if (!inputName || !inputEmail || !inputPhone || !inputPersons || !btnConfirm) return;
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid = name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 5;
    btnConfirm.disabled = !valid;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach(i => {
    if (!i) return;
    i.addEventListener("input", () => {
      validateForm();
      updatePrice();
    });
  });

  function updatePrice() {
    if (!selectedStart || !selectedEnd) return;
    const nbPersons = parseInt(inputPersons.value) || 2;
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate() + 1);
    }
    priceDisplay.textContent = `Montant total : ${testPayment ? 1 : total} €`;
  }

  // FullCalendar init (préserve ta config existante)
  let cal;
  try {
    cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "fr",
      selectable: true,
      selectMirror: true,
      firstDay: 1,
      height: "100%",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek"
      },

      // Empêche la sélection si chevauchement avec reservedRanges ou date passée
      selectAllow: function(selectInfo) {
        const start = selectInfo.start;
        const end = selectInfo.end;
        const today = new Date(); today.setHours(0,0,0,0);
        if (start < today) return false;
        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
          const iso = d.toISOString().split("T")[0];
          if (!isDateSelectable(iso, reservedRanges)) return false;
        }
        return true;
      },

      // Sélection par glisser (desktop & mobile drag)
      select: function(info) {
        selectedStart = info.startStr;
        selectedEnd = info.endStr;
        if (modalDates) modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        if (inputName) inputName.value = "";
        if (inputEmail) inputEmail.value = "";
        if (inputPhone) inputPhone.value = "";
        if (inputPersons) inputPersons.value = 2;
        validateForm(); updatePrice();
        if (modal) modal.style.display = "flex";
      },

      // Chargement des événements depuis ton backend LIVA
      events: async function(fetchInfo, success, failure) {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
          if (!res.ok) throw new Error("Erreur serveur");
          const evts = await res.json();
          // garde les ranges pour logique
          reservedRanges = evts.map(e => ({ start: e.start, end: e.end }));

          const fcEvents = evts.map(e => ({
            title: "Réservé",
            start: e.start,
            end: e.end,
            display: "background",
            backgroundColor: "#7a0000",
            borderColor: "#7a0000",
            allDay: true
          }));

          success(fcEvents);

          // après injection events, marque les cellules non réservable
          setTimeout(markDisabledDays, 60);

        } catch (err) {
          console.error("events fetch error:", err);
          failure(err);
        }
      },

      // quand on change de mois
      datesSet: function() {
        setTimeout(markDisabledDays, 60);
      }
    });

    cal.render();
    // run once more
    setTimeout(markDisabledDays, 150);

  } catch (err) {
    console.error("Erreur initialisation FullCalendar :", err);
    return;
  }

  // Modal buttons (conservés)
  if (btnCancel) btnCancel.addEventListener("click", () => { if (modal) modal.style.display = "none"; try { cal.unselect(); } catch(e){} });
  if (btnConfirm) btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    let nbPersons = parseInt(inputPersons.value);
    if (!name || !email || !phone || isNaN(nbPersons) || nbPersons < 1 || nbPersons > 5) {
      alert("Veuillez remplir tous les champs correctement (max 5 personnes).");
      return;
    }
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate() + 1);
    }
    const montant = testPayment ? 1 : total;
    if (!confirm(`Réserver LIVA du ${selectedStart} au ${selectedEnd} pour ${montant} € pour ${nbPersons} personne(s) ?`)) return;
    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          logement: "LIVA",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: montant,
          personnes: nbPersons,
          name, email, phone
        })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Impossible de créer la réservation.");
    } catch (err) {
      console.error("checkout error:", err);
      alert("Erreur lors de la création de la réservation.");
    }
  });

  // ---- Mobile tap handling (mirror blom) ----
  let touchStartTime = 0;
  let touchMoved = false;

  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    touchStartTime = Date.now();
    touchMoved = false;
  }, { passive: true });

  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch") return;
    touchMoved = true;
  }, { passive: true });

  document.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "touch") return;
    const duration = Date.now() - touchStartTime;
    if (!touchMoved && duration < 300) {
      const dayCell = e.target && e.target.closest && e.target.closest(".fc-daygrid-day");
      if (!dayCell) return;
      const dateStr = dayCell.getAttribute("data-date");
      if (!dateStr) return;

      // ignore si déjà désactivée
      if (dayCell.classList.contains("fc-day-disabled") || dayCell.style.pointerEvents === "none") return;

      // vérifie si la date est réservable
      if (!isDateSelectable(dateStr, reservedRanges)) {
        // optionnel: petit feedback visuel rapide
        dayCell.classList.add("fc-day-disabled");
        return;
      }

      const start = new Date(dateStr);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      try {
        cal.select({ start, end, allDay: true });
      } catch (err) {
        try { dayCell.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true})); } catch(e){}
      }
    }
  }, { passive: true });

  // marque les cellules non réservable (visuel + disable pointer)
  function markDisabledDays() {
    try {
      const cells = document.querySelectorAll('.fc-daygrid-day');
      if (!cells || !cells.length) return;
      cells.forEach(cell => {
        const dateStr = cell.getAttribute('data-date');
        if (!dateStr) return;
        if (!isDateSelectable(dateStr, reservedRanges)) {
          cell.classList.add('fc-day-disabled');
          cell.style.pointerEvents = 'none';
          cell.style.opacity = '0.45';
        } else {
          cell.classList.remove('fc-day-disabled');
          cell.style.pointerEvents = '';
          cell.style.opacity = '';
        }
      });
    } catch (e) { /* noop */ }
  }

  // runtime CSS to ensure tapable cells and disabled style
  try {
    const style = document.createElement('style');
    style.innerHTML = `
      .fc-daygrid-day, .fc-daygrid-day-frame { pointer-events: auto !important; touch-action: manipulation; -webkit-tap-highlight-color: transparent; cursor: pointer; }
      .fc-day-disabled { pointer-events: none !important; opacity: 0.45 !important; }
      #calendar { -webkit-overflow-scrolling: touch; }
    `;
    document.head.appendChild(style);
  } catch (e) {}
});
