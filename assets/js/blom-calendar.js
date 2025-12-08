// ========================================================
// 🌸 BLŌM Calendar JS - corrigé (jour départ cliquable, mobile OK)
// ========================================================

(async function () {

  const isBlom = document.body.classList.contains("blom");

  // Styles (gardés tels quels)
  const css = isBlom
    ? `/* BLŌM sombre */
      #calendar, #calendar * { touch-action: manipulation !important; user-select: none !important; }
      #calendar .fc { background:#111 !important; color:#fff; font-family:"Inter",sans-serif; }
      #calendar .fc-daygrid-day { background:#181818 !important; border-color:#222 !important; pointer-events:auto; transition:0.15s; }
      @media(hover:hover){ #calendar .fc-daygrid-day:hover:not([data-reserved="true"]){ background:#242424 !important; cursor:pointer; } }
      #calendar .fc-daygrid-day[data-reserved="true"] { background:#4a0000 !important; pointer-events:none; opacity:0.8; }
      #calendar .fc-day-disabled { opacity:0.35 !important; }
      #reservationModal { z-index:2000; display:none; justify-content:center; align-items:center; padding:20px; background:rgba(0,0,0,0.75); backdrop-filter:blur(4px); }
      #reservationModal .modal-content { background:#1b1b1b; padding:20px; border-radius:10px; width:90%; max-width:420px; color:#fff; border:1px solid #333; }
      #reservationModal input, #reservationModal select { width:100%; padding:8px; margin:6px 0 12px; border-radius:6px; background:#2a2a2a; border:1px solid #444; color:#fff; }
      #reservationModal button { width:100%; padding:12px; border-radius:8px; margin-top:8px; border:none; }
      #res-confirm { background:#6f4cff; color:#fff; } #res-cancel{background:#333;color:#fff;}`
    : `/* LIVA clair (unused here but kept) */`;

  const styleNode = document.createElement("style");
  styleNode.type = "text/css";
  styleNode.appendChild(document.createTextNode(css));
  document.head.appendChild(styleNode);

  // Helpers (tarifs BLŌM)
  function getTarif(dateStr, nbPersonnes = 2) {
    const d = new Date(dateStr);
    const day = d.getDay();
    if (day === 5 || day === 6) return 169;
    if (day === 0) return 190;
    return 150;
  }

  function sumPrice(startStr, endStr, nbPersons) {
    let total = 0;
    let cur = new Date(startStr);
    const end = new Date(endStr);
    while (cur < end) {
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate() + 1);
    }
    return total;
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
      const nbP = parseInt(inputPersons.value) || 2;
      priceDisplay.textContent = `Montant total : ${sumPrice(selectedStart, selectedEnd, nbP)} €`;
    }

    function validateForm() {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);
      btnConfirm.disabled = !(name && email && phone && nbP >= 1 && nbP <= 2);
    }

    [inputName, inputEmail, inputPhone, inputPersons].forEach(i => {
      i.addEventListener("input", () => {
        validateForm();
        updatePriceDisplay();
      });
    });

    // ---------------- FullCalendar ----------------
    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: true,
      selectMirror: true,
      firstDay: 1,
      locale: "fr",
      height: "auto",

      // selectAllow : allow end == existing.start (checkout) and start == existing.end
      selectAllow(sel) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (sel.start < today) return false;

        return !reservedRanges.some(r => {
          // true overlap (strict) -> block
          const overlap = sel.start < r.end && sel.end > r.start;
          // allow if only touching (end equals r.start OR start equals r.end)
          const touchingAtEnd = sel.end.getTime() === r.start.getTime();
          const touchingAtStart = sel.start.getTime() === r.end.getTime();
          return overlap && !touchingAtEnd && !touchingAtStart;
        });
      },

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
          const data = await res.json();
          // Keep end as checkout (exclusive)
          reservedRanges = data.map(e => ({ start: new Date(e.start), end: new Date(e.end) }));
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
          console.error(err);
          failure(err);
        }
      },

      // Use single pointerdown handler (no pointerup / click duplication)
      dayCellDidMount(info) {
        const isReserved = reservedRanges.some(r => info.date >= r.start && info.date < r.end);
        if (isReserved) {
          info.el.setAttribute("data-reserved", "true");
          info.el.style.pointerEvents = "none";
          return;
        }

        // remove any previous handler marker (safe)
        if (!info.el.__blom_handler_installed) {
          info.el.addEventListener("pointerdown", (ev) => {
            // accept all pointer types (mouse, touch, pen)
            const s = new Date(info.el.getAttribute("data-date"));
            const e = new Date(s);
            e.setDate(e.getDate() + 1);

            // use calendar's selectAllow via getOption (v6+)
            const allowFn = cal.getOption ? cal.getOption("selectAllow") : null;
            let allow = true;
            try {
              if (typeof allowFn === "function") allow = allowFn({ start: s, end: e });
            } catch (err) { /* ignore */ }

            if (!allow) return;
            cal.select({ start: s, end: e, allDay: true });
          }, { passive: true });

          info.el.__blom_handler_installed = true;
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

    // modal buttons
    btnCancel.addEventListener("click", () => {
      modal.style.display = "none";
      cal.unselect();
    });

    btnConfirm.addEventListener("click", async () => {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);
      if (!name || !email || !phone || isNaN(nbP) || nbP < 1 || nbP > 2) {
        alert("Veuillez remplir tous les champs correctement (max 2 personnes).");
        return;
      }
      const total = sumPrice(selectedStart, selectedEnd, nbP);
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
            personnes: nbP,
            name, email, phone
          })
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert("Impossible de créer la réservation.");
      } catch (err) {
        console.error(err);
        alert("Erreur lors de la création de la réservation.");
      }
    });

  });

})();
