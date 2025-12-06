// ========================================================
// 🌸 BLŌM Calendar JS - multi-date & mobile/desktop
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

// Tarif BLŌM selon le jour de la semaine
function getTarif(dateStr, nbPersonnes = 2, testPayment = false) {
  if (testPayment) return 1; // Paiement test toujours 1 €

  const date = new Date(dateStr);
  const day = date.getDay(); // 0 = dimanche, 1 = lundi, ..., 6 = samedi

  let tarifBase = 150; // Lundi à jeudi
  if (day === 5 || day === 6) tarifBase = 169; // Vendredi et samedi
  if (day === 0) tarifBase = 190; // Dimanche

  return tarifBase;
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

  const config = await getConfig();
  const testPayment = config.testPayment;

  let reservedRanges = [];

  // Modal
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

  // Validation
  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid =
      name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 2;
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
      total += getTarif(cur.toISOString().split("T")[0], nbPersons, testPayment);
      cur.setDate(cur.getDate() + 1);
    }
    priceDisplay.textContent = `Montant total : ${total} €`;
  }

  // Initialisation FullCalendar
  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    selectMirror: true,
    firstDay: 1,
    height: "100%",
    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        if (start <= rangeEnd && end > rangeStart) return false;
      }
      return true;
    },
    select: function (info) {
      selectedStart = info.startStr.split("T")[0];
      selectedEnd = info.endStr.split("T")[0];
      modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
      inputName.value = "";
      inputEmail.value = "";
      inputPhone.value = "";
      inputPersons.value = 2;
      validateForm();
      updatePrice();
      modal.style.display = "flex";
    },
    events: async function (fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur calendrier");
        const evts = await res.json();

        // Préparer reservedRanges correctement
        reservedRanges = evts.map(e => {
          const start = new Date(e.start);
          const end = new Date(e.end);
          end.setDate(end.getDate() - 1); // fin non incluse
          return { start, end };
        });

        const fcEvents = reservedRanges.map(r => ({
          title: "Réservé",
          start: r.start,
          end: new Date(r.end.getTime() + 24 * 60 * 60 * 1000), // colorer correctement
          display: "background",
          backgroundColor: "#ff0000",
          borderColor: "#ff0000",
          allDay: true,
        }));

        success(fcEvents);
      } catch (err) {
        console.error("❌ events fetch error:", err);
        failure(err);
      }
    },
  });

  cal.render();

  // --- Mobile: attacher un handler fiable sur chaque jour via dayCellDidMount ---
cal.setOption('dayCellDidMount', function(info) {
  // Bloquer la cellule si jour passé ou réservé
  const today = new Date();
  today.setHours(0,0,0,0);

  const dayDate = new Date(info.date);
  let isBlocked = false;
  if (dayDate < today) isBlocked = true;

  for (let r of reservedRanges) {
    if (dayDate >= r.start && dayDate < r.end) {
      isBlocked = true;
      break;
    }
  }

  if (isBlocked) {
    info.el.style.pointerEvents = "none";
    info.el.style.opacity = "0.5";
    info.el.title = "Date réservée ou non disponible";
    return;
  }

  // Si mobile, tap = 1 jour
  if (/Mobi|Android/i.test(navigator.userAgent)) {
    if (!info.el.dataset.mobileHandlerAttached) {
      info.el.dataset.mobileHandlerAttached = "1";
      info.el.addEventListener('click', () => {

        // Vérification en temps réel
        const nowDate = new Date(info.date);
        nowDate.setHours(0,0,0,0);

        for (let r of reservedRanges) {
          if (nowDate >= r.start && nowDate < r.end) return;
        }

        const start = new Date(info.date);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const allow = cal.opt('selectAllow')({ start, end });
        if (!allow) return;

        cal.select({ start, end, allDay: true });
      }, { passive: true });
    }
  }
});


  // Modal buttons
  btnCancel.addEventListener("click", () => {
    modal.style.display = "none";
    cal.unselect();
  });

  btnConfirm.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    let nbPersons = parseInt(inputPersons.value);
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
      console.error("checkout error:", err);
      alert("Erreur lors de la création de la réservation.");
    }
  });
});
