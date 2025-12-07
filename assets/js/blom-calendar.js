// ========================================================
// 🌸 BLŌM Calendar JS - diagnostic + mobile-safe handlers (v6 fix)
// ========================================================

/*
  Remplace intégralement ton fichier par celui-ci.
  Corrections :
   - remplace cal.opt(...) par cal.getOption(...)
   - garde les logs et handlers diagnostiques
*/

(async function () {
  // --- small CSS injection to avoid gesture interception ---
  const css = `
  /* Ensure touches are handled as taps by the browser, avoid passive drag interception */
  #calendar, #calendar * { touch-action: manipulation !important; -webkit-user-select: none !important; -ms-user-select: none !important; user-select: none !important; }
  /* Make sure FullCalendar internal containers are transparent and cells are interactive */
  #calendar .fc-scrollgrid { background: transparent !important; }
  #calendar .fc-daygrid-day { background: #111 !important; pointer-events: auto !important; }
  /* Ensure modal sits on top */
  #reservationModal { z-index: 2000; }
  `;
  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // --- helpers ---
  function debug(...args) {
    if (window && window.console && window.console.log) {
      console.log("[BLOM-CAL]", ...args);
    }
  }

  // load config
  async function getConfig() {
    try {
      const stripeBackend = window.location.hostname.includes("localhost")
        ? "http://localhost:3000"
        : "https://livablom-stripe-production.up.railway.app";

      const res = await fetch(`${stripeBackend}/api/config?ts=${Date.now()}`);
      if (!res.ok) throw new Error("Impossible de récupérer la config");
      return await res.json();
    } catch (err) {
      console.error("[BLOM-CAL] getConfig error:", err);
      return { testPayment: true };
    }
  }

  function getTarif(dateStr, nbPersonnes = 2, testPayment = false) {
    if (testPayment) return 1;
    const date = new Date(dateStr);
    const day = date.getDay();
    let tarifBase = 150;
    if (day === 5 || day === 6) tarifBase = 169;
    if (day === 0) tarifBase = 190;
    return tarifBase;
  }

  document.addEventListener("DOMContentLoaded", async function () {
    const el = document.getElementById("calendar");
    if (!el) {
      debug("Calendar container (#calendar) not found.");
      return;
    }
    debug("Calendar container found.");

    const calendarBackend = window.location.hostname.includes("localhost")
      ? "http://localhost:4000"
      : "https://calendar-proxy-production-ed46.up.railway.app";

    const stripeBackend = window.location.hostname.includes("localhost")
      ? "http://localhost:3000"
      : "https://livablom-stripe-production.up.railway.app";

    const config = await getConfig();
    const testPayment = config.testPayment;
    debug("Config loaded. testPayment =", testPayment);

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
      const name = (inputName && inputName.value || "").trim();
      const email = (inputEmail && inputEmail.value || "").trim();
      const phone = (inputPhone && inputPhone.value || "").trim();
      const nbPersons = parseInt(inputPersons && inputPersons.value) || NaN;
      btnConfirm.disabled = !(
        name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 2
      );
    }

    [inputName, inputEmail, inputPhone, inputPersons].forEach((i) => {
      if (i) i.addEventListener("input", () => { validateForm(); updatePrice(); });
    });

    function updatePrice() {
      if (!selectedStart || !selectedEnd) return;
      const nbPersons = parseInt(inputPersons && inputPersons.value) || 2;
      let cur = new Date(selectedStart);
      const fin = new Date(selectedEnd);
      let total = 0;
      while (cur < fin) {
        total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
        cur.setDate(cur.getDate() + 1);
      }
      if (priceDisplay) priceDisplay.textContent = `Montant total : ${total} €`;
    }

    // instantiate calendar
    debug("Creating FullCalendar instance...");
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "fr",
      selectable: true,
      selectMirror: true,
      firstDay: 1,
      height: "100%",

      // mobile tap fallback (FullCalendar dateClick)
      dateClick: function(info) {
        debug("dateClick fired for", info.dateStr);
        const start = new Date(info.dateStr);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        // check allow (v6 API)
        const allow = cal.getOption("selectAllow")({ start, end });
        debug("dateClick -> allow:", allow);
        if (!allow) return;
        cal.select({ start, end, allDay: true });
      },

      selectAllow: function (selectInfo) {
        const start = selectInfo.start;
        const end = selectInfo.end;
        const today = new Date();
        today.setHours(0,0,0,0);
        if (start < today) return false;
        for (let range of reservedRanges) {
          if (start < range.end && end > range.start) return false;
        }
        return true;
      },

      events: async function (fetchInfo, success, failure) {
        debug("Fetching events from backend...");
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
          if (!res.ok) throw new Error("Erreur serveur calendrier");
          const evts = await res.json();
          reservedRanges = evts.map(e => ({ start: new Date(e.start), end: new Date(e.end) }));
          debug("Reserved ranges loaded:", reservedRanges);
          const fcEvents = reservedRanges.map(r => ({
            title: "Réservé",
            start: r.start,
            end: r.end,
            display: "background",
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            allDay: true,
          }));
          success(fcEvents);
        } catch (err) {
          console.error("[BLOM-CAL] events fetch error:", err);
          failure(err);
        }
      },

      dayCellDidMount: function(info) {
        // mark reserved days as non-interactive
        for (let r of reservedRanges) {
          if (info.date >= r.start && info.date < r.end) {
            info.el.style.pointerEvents = "none";
            info.el.title = "Date réservée";
            debug("dayCellDidMount: disabled", info.date.toISOString().split("T")[0]);
            return;
          }
        }
        // attach lightweight listeners to each cell (safe: attached per cell)
        try {
          // avoid adding duplicate listeners
          if (!info.el.__blom_listeners_installed) {
            // click (desktop & many mobiles)
            info.el.addEventListener("click", (ev) => {
              debug("cell click on", ev.currentTarget.getAttribute("data-date"));
              // emulate dateClick behaviour:
              const dateStr = ev.currentTarget.getAttribute("data-date");
              if (!dateStr) return;
              const start = new Date(dateStr);
              const end = new Date(start); end.setDate(end.getDate() + 1);
              const allow = cal.getOption("selectAllow")({ start, end });
              debug("cell click -> allow:", allow);
              if (!allow) return;
              cal.select({ start, end, allDay: true });
            }, { passive: true });

            // pointerup for touch fallback
            info.el.addEventListener("pointerup", (ev) => {
              if (ev.pointerType && ev.pointerType !== "touch") return;
              debug("cell pointerup on", ev.currentTarget.getAttribute("data-date"), "pointerType:", ev.pointerType);
              const dateStr = ev.currentTarget.getAttribute("data-date");
              if (!dateStr) return;
              const start = new Date(dateStr);
              const end = new Date(start); end.setDate(end.getDate() + 1);
              const allow = cal.getOption("selectAllow")({ start, end });
              debug("pointerup -> allow:", allow);
              if (!allow) return;
              cal.select({ start, end, allDay: true });
            }, { passive: true });

            info.el.__blom_listeners_installed = true;
            debug("Listeners installed on cell", info.date.toISOString().split("T")[0]);
          }
        } catch (err) {
          console.error("[BLOM-CAL] dayCellDidMount listeners error:", err);
        }
      },

      select: function (info) {
        debug("select fired:", info.startStr, "->", info.endStr);
        selectedStart = info.startStr.split("T")[0];
        selectedEnd = info.endStr.split("T")[0];
        if (modalDates) modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        if (inputName) inputName.value = "";
        if (inputEmail) inputEmail.value = "";
        if (inputPhone) inputPhone.value = "";
        if (inputPersons) inputPersons.value = 2;
        validateForm();
        updatePrice();
        if (modal) modal.style.display = "flex";
      }

    }); // end FullCalendar config

    debug("Rendering calendar...");
    cal.render();

    // After render: scan produced cells and log counts (diagnostic)
    setTimeout(() => {
      const cells = document.querySelectorAll("#calendar .fc-daygrid-day");
      debug("Day cells count after render:", cells.length);
      // ensure they have data-date attributes
      let missing = 0;
      cells.forEach((c) => { if (!c.getAttribute("data-date")) missing++; });
      debug("Cells missing data-date:", missing);

      // If there's an overlay element potentially blocking, log its info
      const potentialOverlay = document.querySelector("#calendar .fc-scrollgrid");
      if (potentialOverlay) {
        const bb = potentialOverlay.getBoundingClientRect();
        debug("fc-scrollgrid bounding box:", bb);
      } else {
        debug("fc-scrollgrid not found (unexpected).");
      }

    }, 600);

    // Modal buttons
    if (btnCancel) btnCancel.addEventListener("click", () => { if (modal) modal.style.display = "none"; cal.unselect(); });
    if (btnConfirm) btnConfirm.addEventListener("click", async () => {
      const name = inputName && inputName.value.trim();
      const email = inputEmail && inputEmail.value.trim();
      const phone = inputPhone && inputPhone.value.trim();
      const nbPersons = parseInt(inputPersons && inputPersons.value);
      if (!name || !email || !phone || isNaN(nbPersons) || nbPersons < 1 || nbPersons > 2) {
        alert("Veuillez remplir tous les champs correctement (max 2 personnes).");
        return;
      }
      let cur = new Date(selectedStart);
      const fin = new Date(selectedEnd);
      let total = 0;
      while (cur < fin) {
        total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
        cur.setDate(cur.getDate() + 1);
      }
      if (!confirm(`Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${total} € ?`)) return;
      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "BLŌM",
            startDate: selectedStart,
            endDate: selectedEnd,
            amount: total,
            personnes: nbPersons,
            name,
            email,
            phone,
          }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch (err) {
        console.error("[BLOM-CAL] checkout error:", err);
        alert("Erreur lors de la création de la réservation.");
      }
    });

    debug("blom-calendar.js loaded and handlers attached.");
  }); // DOMContentLoaded end

})(); // IIFE end
