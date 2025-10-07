function getTarif(date, nbPersonnes = 2) {
  const base = 79; // Tarif de base LIVA
  if (nbPersonnes <= 2) return base;
  return base + (nbPersonnes - 2) * 20;
}

document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("calendar");
  if (!el) return;

  const calendarBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:4000"
    : "https://calendar-proxy-production-ed46.up.railway.app";

  const stripeBackend = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://livablom-stripe-production.up.railway.app";

  let reservedRanges = [];

  // Modal
  const modal = document.getElementById("reservationModal");
  const modalDates = document.getElementById("modal-dates");
  const inputName = document.getElementById("res-name");
  const inputEmail = document.getElementById("res-email");
  const inputPhone = document.getElementById("res-phone");
  const inputPersons = document.getElementById("res-persons");
  const btnCancel = document.getElementById("res-cancel");
  const btnConfirm = document.getElementById("res-confirm");

  // Affichage tarif dynamique
  let priceDisplay = document.createElement("p");
  priceDisplay.id = "modal-price";
  priceDisplay.style.fontWeight = "bold";
  priceDisplay.style.marginTop = "10px";
  modal.querySelector(".modal-content").appendChild(priceDisplay);

  let selectedStart = null;
  let selectedEnd = null;

  function calculateTotal() {
    if (!selectedStart || !selectedEnd) return 0;
    let nbPersons = parseInt(inputPersons.value) || 2;
    let cur = new Date(selectedStart);
    const fin = new Date(selectedEnd);
    let total = 0;
    while(cur < fin){
      total += getTarif(cur.toISOString().split("T")[0], nbPersons);
      cur.setDate(cur.getDate()+1);
    }
    return total;
  }

  function updatePriceDisplay() {
    const total = calculateTotal();
    priceDisplay.textContent = `Montant total : ${window.TEST_PAYMENT ? 1 : total} €`;
  }

  // Fonction de validation du formulaire
  function validateForm() {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    const nbPersons = parseInt(inputPersons.value);
    const valid = name && email && phone && !isNaN(nbPersons) && nbPersons >= 1 && nbPersons <= 5;
    btnConfirm.disabled = !valid;
    updatePriceDisplay();
  }

  // Écoute sur tous les champs pour activer/désactiver le bouton confirmer et mettre à jour le tarif
  [inputName, inputEmail, inputPhone, inputPersons].forEach(input => {
    input.addEventListener("input", validateForm);
  });

  const cal = new FullCalendar.Calendar(el, {
    initialView: "dayGridMonth",
    locale: "fr",
    selectable: true,
    firstDay: 1,

    selectAllow: function (selectInfo) {
      const start = selectInfo.start;
      const end = selectInfo.end;

      const today = new Date();
      today.setHours(0,0,0,0);
      if (start < today) return false;

      for (let range of reservedRanges) {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        rangeEnd.setDate(rangeEnd.getDate()-1);

        if (start <= rangeEnd && end > rangeStart) {
          if (start.getTime() === rangeEnd.getTime()) continue;
          return false;
        }
      }
      return true;
    },

    select: function(info) {
      selectedStart = info.startStr;
      selectedEnd = info.endStr;
      modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;

      // Reset du formulaire
      inputName.value = "";
      inputEmail.value = "";
      inputPhone.value = "";
      inputPersons.value = 2;
      validateForm();

      modal.style.display = "flex";
    },

    events: async function(fetchInfo, success, failure) {
      try {
        const res = await fetch(`${calendarBackend}/api/reservations/LIVA?ts=${Date.now()}`);
        if (!res.ok) throw new Error("Erreur serveur");

        const evts = await res.json();
        reservedRanges = evts.map(e => ({start:e.start, end:e.end}));

        const fcEvents = evts.map(e=>{
          const end = new Date(e.end);
          return {
            title:"Réservé",
            start:e.start,
            end:e.end,
            display:"background",
            backgroundColor:"#ff0000",
            borderColor:"#ff0000",
            allDay:true
          };
        });

        success(fcEvents);
      } catch(err) {
        console.error(err);
        failure(err);
      }
    }
  });

  cal.render();

  btnCancel.addEventListener("click", ()=> modal.style.display="none");

  btnConfirm.addEventListener("click", async ()=> {
    const name = inputName.value.trim();
    const email = inputEmail.value.trim();
    const phone = inputPhone.value.trim();
    let nbPersons = parseInt(inputPersons.value);

    if(!name || !email || !phone || isNaN(nbPersons) || nbPersons<1 || nbPersons>5){
      alert("Veuillez remplir tous les champs correctement (max 5 personnes).");
      return;
    }

    const montant = window.TEST_PAYMENT ? 1 : calculateTotal();

    if(!confirm(`Réserver LIVA du ${selectedStart} au ${selectedEnd} pour ${montant} € pour ${nbPersons} personne(s) ?`)) return;

    try{
      const payload = {
        logement:"LIVA",
        startDate:selectedStart,
        endDate:selectedEnd,
        amount:montant,
        personnes:nbPersons,
        name:name,
        email:email,
        phone:phone
      };

      const res = await fetch(`${stripeBackend}/api/checkout`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if(data.url) window.location.href = data.url;
      else alert("Impossible de créer la réservation.");
    } catch(err){
      console.error(err);
      alert("Erreur lors de la création de la réservation.");
    }
  });
});
