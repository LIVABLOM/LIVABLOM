// ========================================================
// 🌿 LIVA Calendar JS - corrigé (jour départ cliquable, mobile OK)
// ========================================================

(async function () {

  const css = `
    #calendar, #calendar * { touch-action: manipulation !important; user-select: none !important; }
    #calendar .fc { background: #fff !important; color: #000 !important; font-family: "Inter", sans-serif; }
    #calendar .fc-daygrid-day { background: #f9f9f9 !important; border-color: #ddd !important; transition: background 0.15s ease; pointer-events: auto !important; }
    #calendar .fc-daygrid-day[data-reserved="true"] { background: #ffcccc !important; opacity: 0.8; pointer-events: none !important; }
    #reservationModal { z-index:2000; background: rgba(0,0,0,0.4); backdrop-filter: blur(3px); display: none; justify-content:center; align-items:center; padding:20px; }
    #reservationModal .modal-content { background:#fff; padding:20px; border-radius:10px; width:90%; max-width:420px; color:#000; border:1px solid #ccc; }
    #reservationModal input, #reservationModal select { width:100%; padding:8px; margin:6px 0 12px; border-radius:6px; border:1px solid #ccc; color:#000; }
    #reservationModal button { padding:12px; border-radius:8px; border:none; margin-top:8px; width:100%; }
    #res-confirm { background: #6f4cff; color:#fff; }
    #res-cancel { background:#333; color:#fff; }
  `;
  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  function getTarif(dateStr, nbPersonnes = 2) {
    const base = 79;
    const supplement = nbPersonnes > 2 ? (nbPersonnes - 2) * 15 : 0;
    return base + supplement;
  }

  function sumPrice(startStr, endStr, nbPersons, testPayment) {
    let total = 0;
    let cur = new Date(startStr);
    const end = new Date(endStr);
    while (cur < end) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate() + 1);
    }
    return testPayment ? 1 : total;
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

  function formatDate(d) {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  }

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
      priceDisplay.textContent = `Montant total : ${sumPrice(selectedStart, selectedEnd, nbPers, testPayment)} €`;
    }

    function validateForm() {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);
      btnConfirm.disabled = !(name && email && phone && nbP >= 1 && nbP <= 5);
    }

    [inputName, inputEmail, inputPhone, inputPersons].forEach(i => {
      i.addEventListener("input", () => {
        validateForm();
        updatePriceDisplay();
      });
    });

    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      locale: "fr",
      selectable: true,
      selectMirror: true,
      firstDay: 1,
      height: "auto",

      // selectAllow: allow touching checkout day (end) or start == previous end
      selectAllow(sel) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (sel.start < today) return false;

        return !reservedRanges.some(r => {
          const overlap = sel.start < r.end && sel.end > r.start;
          const touchingAtEnd = sel.end.getTime() === r.start.getTime();
          const touchingAtStart = sel.start.getTime() === r.end.getTime();
          return overlap && !touchingAtEnd && !touchingAtStart;
        });
      },

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
          const data = await res.json();

          // keep end as checkout (exclusive)
          reservedRanges = data.map(e => ({ start: new Date(e.start), end: new Date(e.end) }));

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
          console.error("events fetch error:", err);
          failure(err);
        }
      },

      dayCellDidMount(info) {
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) {
          info.el.setAttribute("data-reserved", "true");
          info.el.style.pointerEvents = "none";
          return;
        }

        if (!info.el.__liva_handler) {
          info.el.addEventListener("pointerdown", (ev) => {
            // allow all pointer types
            const s = new Date(info.el.getAttribute("data-date"));
            const e = new Date(s);
            e.setDate(e.getDate() + 1);

            const allowFn = cal.getOption ? cal.getOption("selectAllow") : null;
            let allow = true;
            try {
              if (typeof allowFn === "function") allow = allowFn({ start: s, end: e });
            } catch (err) { /* ignore */ }

            if (!allow) return;
            cal.select({ start: s, end: e, allDay: true });
          }, { passive: true });

          info.el.__liva_handler = true;
        }
      },

      select(info) {
        selectedStart = info.startStr.split("T")[0];
        selectedEnd = info.endStr.split("T")[0];
        modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        inputName.value = "";
        inputEmail.value = "";
        inputPhone.value = "";
        inputPersons.value = 2;
        validateForm();
        updatePriceDisplay();
        modal.style.display = "flex";
      }
    });

    cal.render();

    btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
      cal.unselect();
    });

    btnConfirm.addEventListener("click", async () => {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);
      if (!name || !email || !phone || isNaN(nbP) || nbP < 1 || nbP > 5) {
        alert("Veuillez remplir tous les champs correctement (max 5 personnes).");
        return;
      }

      const total = sumPrice(selectedStart, selectedEnd, nbP, testPayment);
      if (!confirm(`Réserver LIVA du ${selectedStart} au ${selectedEnd} pour ${total} € ?`)) return;

      try {
        const res = await fetch(`${stripeBackend}/api/checkout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logement: "LIVA",
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
        if (data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch (err) {
        console.error("checkout error:", err);
        alert("Erreur lors de la création de la réservation.");
      }
    });

  });

})();
