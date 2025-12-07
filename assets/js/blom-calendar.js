// ========================================================
// 🌸 BLŌM Calendar JS - Version corrigée (selectAllow v6 + data-date fix)
// ========================================================

(async function () {

  // Small CSS injection (mobile friendly)
  const css = `
    #calendar, #calendar * { touch-action: manipulation !important; -webkit-user-select: none !important; user-select: none !important; }
    #calendar .fc-scrollgrid { background: transparent !important; }
    #calendar .fc-daygrid-day { background: #181818 !important; pointer-events: auto !important; }
    #reservationModal { z-index: 2000; }
  `;
  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // Helpers
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
      const res = await fetch(`${stripeBackend}/api/config?ts=${Date.now()}`);
      if (!res.ok) throw new Error("config fetch failed");
      return await res.json();
    } catch {
      return { testPayment: true };
    }
  }

  function sumPrice(startStr, endStr, nbPersons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    const end = new Date(endStr);
    while (cur < end) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    return total;
  }

  // DOM ready
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

    let reservedRanges = [];
    let selectedStart = null;
    let selectedEnd = null;

    function updatePriceDisplay() {
      if (!selectedStart || !selectedEnd) return;
      const nbPers = parseInt(inputPersons.value) || 2;
      if (priceDisplay) priceDisplay.textContent = `Montant total : ${sumPrice(selectedStart, selectedEnd, nbPers, testPayment)} €`;
    }

    function validateForm() {
      const name = (inputName && inputName.value || "").trim();
      const email = (inputEmail && inputEmail.value || "").trim();
      const phone = (inputPhone && inputPhone.value || "").trim();
      const nbP = parseInt(inputPersons && inputPersons.value) || 0;
      if (btnConfirm) btnConfirm.disabled = !(name && email && phone && nbP >= 1 && nbP <= 2);
    }

    [inputName, inputEmail, inputPhone, inputPersons].forEach(i => {
      if (i) i.addEventListener("input", () => { validateForm(); updatePriceDisplay(); });
    });

    // Create FullCalendar
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: true,
      firstDay: 1,
      locale: "fr",
      height: "auto",

      // dateClick fallback for mobile (FullCalendar event)
      dateClick(info) {
        const s = new Date(info.dateStr);
        const e = new Date(s); e.setDate(e.getDate() + 1);
        const selectAllowFn = cal.getOption && cal.getOption("selectAllow");
        if (typeof selectAllowFn === "function") {
          if (!selectAllowFn({ start: s, end: e })) return;
        }
        // if no selectAllow available, continue
        cal.select({ start: s, end: e, allDay: true });
      },

      selectAllow(sel) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (sel.start < today) return false;
        return !reservedRanges.some(r => sel.start < r.end && sel.end > r.start);
      },

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
          if (!res.ok) throw new Error("events fetch failed");
          const data = await res.json();
          reservedRanges = data.map(e => ({ start: new Date(e.start), end: new Date(e.end) }));
          const fcEvents = reservedRanges.map(r => ({
            title: "Réservé",
            start: r.start,
            end: r.end,
            display: "background",
            backgroundColor: "#900",
            borderColor: "#900",
            allDay: true
          }));
          success(fcEvents);
        } catch (err) {
          failure(err);
        }
      },

      dayCellDidMount(info) {
        // ensure data-date attribute exists (some FC builds may not set it)
        try {
          info.el.setAttribute("data-date", info.date.toISOString().split("T")[0]);
        } catch (e) {
          /* ignore */
        }

        // mark reserved days
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) {
          info.el.setAttribute("data-reserved", "true");
          // optionally style via CSS attribute selector
          return;
        }

        // attach pointerup (touch) handler
        const pointerHandler = (ev) => {
          if (ev && ev.pointerType && ev.pointerType !== "touch") return;
          const dateStr = info.el.getAttribute("data-date");
          if (!dateStr) return;
          const s = new Date(dateStr);
          const e = new Date(s); e.setDate(e.getDate() + 1);
          const selectAllowFn = cal.getOption && cal.getOption("selectAllow");
          if (typeof selectAllowFn === "function") {
            if (!selectAllowFn({ start: s, end: e })) return;
          }
          cal.select({ start: s, end: e, allDay: true });
        };

        const clickHandler = (ev) => {
          const dateStr = info.el.getAttribute("data-date");
          if (!dateStr) return;
          const s = new Date(dateStr);
          const e = new Date(s); e.setDate(e.getDate() + 1);
          const selectAllowFn = cal.getOption && cal.getOption("selectAllow");
          if (typeof selectAllowFn === "function") {
            if (!selectAllowFn({ start: s, end: e })) return;
          }
          cal.select({ start: s, end: e, allDay: true });
        };

        // avoid duplicate installation
        if (!info.el.__blom_installed) {
          info.el.addEventListener("pointerup", pointerHandler, { passive: true });
          info.el.addEventListener("click", clickHandler);
          info.el.__blom_installed = true;
        }
      },

      select(info) {
        selectedStart = info.startStr.split("T")[0];
        selectedEnd = info.endStr.split("T")[0];

        if (modalDates) modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        if (inputName) inputName.value = "";
        if (inputEmail) inputEmail.value = "";
        if (inputPhone) inputPhone.value = "";
        if (inputPersons) inputPersons.value = 2;

        validateForm();
        updatePriceDisplay();
        if (modal) modal.style.display = "flex";
      }
    });

    // render
    cal.render();

    // Modal buttons
    if (btnCancel) btnCancel.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
      cal.unselect();
    });

    if (btnConfirm) btnConfirm.addEventListener("click", async () => {
      const name = (inputName && inputName.value || "").trim();
      const email = (inputEmail && inputEmail.value || "").trim();
      const phone = (inputPhone && inputPhone.value || "").trim();
      const nbP = parseInt(inputPersons && inputPersons.value) || 1;

      const total = sumPrice(selectedStart, selectedEnd, nbP, testPayment);

      if (!confirm(`Confirmer la réservation du ${selectedStart} au ${selectedEnd} pour ${total} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLŌM",
            startDate: selectedStart,
            endDate: selectedEnd,
            amount: total,
            personnes: nbP,
            name,
            email,
            phone
          })
        });
        const data = await res.json();
        if (data.url) location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch (err) {
        console.error("checkout error:", err);
        alert("Erreur lors de la création de la réservation.");
      }
    });

  });

})(); 
