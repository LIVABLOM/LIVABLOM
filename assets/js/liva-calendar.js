// ========================================================
// 🌿 LIVA Calendar JS – version stable mobile + desktop
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

// 💶 Tarif LIVA : 79 € pour 1–2 personnes, +15 € par personne suppl.
function getTarif(date, nbPersonnes = 2) {
  const base = 79;
  const suppl = nbPersonnes > 2 ? (nbPersonnes - 2) * 15 : 0;
  return base + suppl;
}

document.addEventListener("DOMContentLoaded", async () => {
  const el = document.getElementById("calendar");
  if (!el) return console.warn("Calendrier introuvable (#calendar)");

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  const config = await getConfig();
  const testPayment = config.testPayment;
  let reservedRanges = [];

  // 🪟 Modal
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
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid =
      name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 5;
    btnConfirm.disabled = !valid;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach((i) => {
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
    const display = testPayment ? 1 : total;
    priceDisplay.textContent = `Montant total : ${display} €`;
  }

  // ========================================================
  // 🗓️ Initialisation FullCalendar
  // ========================================================
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
        right: "dayGridMonth,timeGridWeek",
      },

      selectAllow(info) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (info.start < today) return false;

        return !reservedRanges.some((r) => {
          const rs = new Date(r.start);
          const re = new Date(r.end);
          re.setDate(re.getDate() - 1);
          return info.start <= re && info.end > rs;
        });
      },

      select(info) {
        selectedStart = info.startStr;
        selectedEnd = info.endStr;
        modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        inputName.value = "";
        inputEmail.value = "";
        inputPhone.value = "";
        inputPersons.value = 2;
        validateForm();
        updatePrice();
        modal.style.display = "flex";
      },

      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
          if (!res.ok) throw new Error("Erreur serveur calendrier");
          const evts = await res.json();

          reservedRanges = evts.map((e) => ({ start: e.start, end: e.end }));

          const fcEvents = evts.map((e) => ({
            title: "Réservé",
            start: e.start,
            end: e.end,
            display: "background",
            backgroundColor: "#ff0000",
            borderColor: "#ff0000",
            allDay: true,
          }));

          success(fcEvents);

          setTimeout(() => {
            document.querySelectorAll(".fc-daygrid-day").forEach((day) => {
              const date = day.getAttribute("data-date");
              if (!date) return;
              const isReserved = reservedRanges.some((r) => {
                const s = new Date(r.start);
                const e = new Date(r.end);
                e.setDate(e.getDate() - 1);
                return new Date(date) >= s && new Date(date) <= e;
              });
              if (isReserved) {
                day.style.pointerEvents = "none";
                day.style.opacity = "0.5";
                day.style.cursor = "not-allowed";
              }
            });
          }, 300);
        } catch (err) {
          console.error("events fetch error:", err);
          failure(err);
        }
      },
    });

    cal.render();
  } catch (err) {
    console.error("Erreur init FullCalendar:", err);
    return;
  }

  // ========================================================
  // 🎯 Boutons Modal
  // ========================================================
  btnCancel.addEventListener("click", () => {
    modal.style.display = "none";
    cal.unselect();
  });

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nb = parseInt(inputPersons.value);
    if (!name || !email || !phone || isNaN(nb) || nb < 1 || nb > 5)
      return alert("Veuillez remplir tous les champs (max 5 personnes).");

    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nb);
      cur.setDate(cur.getDate() + 1);
    }
    const montant = testPayment ? 1 : total;

    if (!confirm(`Réserver LIVA du ${selectedStart} au ${selectedEnd} pour ${montant} € ?`)) return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "LIVA",
          startDate: selectedStart,
          endDate: selectedEnd,
          amount: montant,
          personnes: nb,
          name,
          email,
          phone,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Impossible de créer la réservation.");
    } catch (err) {
      console.error("checkout error:", err);
      alert("Erreur lors de la création de la réservation.");
    }
  });

  // ========================================================
  // 📱 Tap court sur mobile (sélection 1 jour)
  // ========================================================
  let touchStart = 0, touchMoved = false;

  document.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "touch") return;
    touchStart = Date.now();
    touchMoved = false;
  }, { passive: true });

  document.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch") return;
    touchMoved = true;
  }, { passive: true });

  document.addEventListener("pointerup", (e) => {
    if (e.pointerType !== "touch") return;
    if (touchMoved || Date.now() - touchStart > 300) return;

    const cell = e.target.closest(".fc-daygrid-day");
    if (!cell || cell.style.pointerEvents === "none") return;
    const dateStr = cell.getAttribute("data-date");
    if (!dateStr) return;

    const start = new Date(dateStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    try {
      cal.select({ start, end, allDay: true });
    } catch {
      cell.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    }
  }, { passive: true });

  // 🛠️ Sécurité CSS runtime
  const style = document.createElement("style");
  style.innerHTML = `
    .fc-daygrid-day, .fc-daygrid-day-frame {
      pointer-events: auto !important;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    #calendar { -webkit-overflow-scrolling: touch; }
  `;
  document.head.appendChild(style);
});
