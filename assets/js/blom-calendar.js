// ========================================================
// 🌸 BLOM Calendar JS - version corrigée & robuste
// ========================================================

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOM chargé, initialisation du calendrier...");

  // Attente que FullCalendar soit bien chargé
  if (typeof FullCalendar === "undefined") {
    console.error("❌ FullCalendar non trouvé. Vérifie le <script> d'import.");
    alert("Erreur : FullCalendar n'est pas chargé.");
    return;
  }

  const el = document.getElementById("calendar");
  if (!el) {
    console.error("❌ Élément #calendar introuvable dans la page.");
    return;
  }

  // Choix des backends selon le domaine
  const isLocal = window.location.hostname.includes("localhost");
  const calendarBackend = isLocal
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";
  const stripeBackend = isLocal
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  // --- Récupération de la config Stripe ---
  async function getConfig() {
    try {
      const res = await fetch(`${stripeBackend}/api/config?ts=${Date.now()}`);
      if (!res.ok) throw new Error("Réponse non OK");
      const data = await res.json();
      console.log("💻 Config Stripe récupérée :", data);
      return data;
    } catch (err) {
      console.error("⚠️ Erreur de récupération config :", err);
      return { testPayment: false };
    }
  }

  // --- Calcul du tarif ---
  function getTarif(date, nbPersonnes = 2) {
    const jour = new Date(date).getDay(); // 0 = dim, 1 = lun, ...
    let base = 150;
    if (jour === 0) base = 190;
    else if (jour === 5 || jour === 6) base = 169;
    return nbPersonnes <= 2 ? base : base + (nbPersonnes - 2) * 20;
  }

  // --- Chargement de la config Stripe ---
  const config = await getConfig();
  const testPayment = config.testPayment ?? false;

  let reservedRanges = [];
  let selectedStart = null;
  let selectedEnd = null;

  // --- Sélecteurs du modal ---
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const inputName = document.getElementById("res-name");
  const inputEmail = document.getElementById("res-email");
  const inputPhone = document.getElementById("res-phone");
  const inputPersons = document.getElementById("res-persons");
  const priceDisplay = document.getElementById("modal-price");
  const btnCancel = document.getElementById("res-cancel");
  const btnConfirm = document.getElementById("res-confirm");

  if (!modal) {
    console.warn("⚠️ Modal de réservation absent du DOM.");
  }

  function validateForm() {
    const name = inputName?.value.trim();
    const email = inputEmail?.value.trim();
    const phone = inputPhone?.value.trim();
    const nb = parseInt(inputPersons?.value || "2");
    const ok = name && email && phone && nb >= 1 && nb <= 2;
    if (btnConfirm) btnConfirm.disabled = !ok;
  }

  function updatePrice() {
    if (!selectedStart || !selectedEnd) return;
    const nb = parseInt(inputPersons?.value || "2");
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nb);
      cur.setDate(cur.getDate() + 1);
    }
    const montant = testPayment ? 1 : total;
    if (priceDisplay) priceDisplay.textContent = `Montant total : ${montant} €`;
  }

  [inputName, inputEmail, inputPhone, inputPersons].forEach((input) =>
    input?.addEventListener("input", () => {
      validateForm();
      updatePrice();
    })
  );

  // --- Initialisation du calendrier ---
  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,

    // Empêche la sélection de dates passées ou déjà réservées
    selectAllow(info) {
      const start = info.start;
      const end = info.end;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) return false;

      return !reservedRanges.some((r) => {
        const rs = new Date(r.start);
        const re = new Date(r.end);
        re.setDate(re.getDate() - 1);
        return start <= re && end > rs;
      });
    },

    // Lorsqu'on sélectionne une plage
    select(info) {
      selectedStart = info.startStr;
      selectedEnd = info.endStr;
      if (modal && modalDates) {
        modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        modal.style.display = "flex";
      }
      if (inputName) inputName.value = "";
      if (inputEmail) inputEmail.value = "";
      if (inputPhone) inputPhone.value = "";
      if (inputPersons) inputPersons.value = 2;
      validateForm();
      updatePrice();
    },

    // Récupération des réservations depuis le backend
    events: async (fetchInfo, success, failure) => {
      try {
        const url = `${calendarBackend}/api/reservations/BLOM?ts=${Date.now()}`;
        const res = await fetch(url);
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

        console.log(`📅 ${fcEvents.length} réservations chargées.`);
        success(fcEvents);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des réservations :", err);
        alert("Impossible de charger le calendrier. Réessayez plus tard.");
        failure(err);
      }
    },
  });

  cal.render();

  // --- Boutons du modal ---
  btnCancel?.addEventListener("click", () => (modal.style.display = "none"));

  btnConfirm?.addEventListener("click", async () => {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nb = parseInt(inputPersons.value);

    if (!name || !email || !phone || isNaN(nb) || nb < 1 || nb > 2) {
      alert("Veuillez remplir tous les champs correctement (max 2 personnes).");
      return;
    }

    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while (cur < fin) {
      total += getTarif(cur.toISOString().split("T")[0], nb);
      cur.setDate(cur.getDate() + 1);
    }
    const montant = testPayment ? 1 : total;

    if (
      !confirm(
        `Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${montant} € ?`
      )
    )
      return;

    try {
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logement: "BLŌM",
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
      else alert("Erreur : impossible de créer la réservation.");
    } catch (err) {
      console.error("❌ Erreur Stripe :", err);
      alert("Erreur lors de la création de la réservation.");
    }
  });
});
