(async function() {

  // ... CSS et fonctions getTarif, getConfig, sumPrice restent identiques ...

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
      btnConfirm.disabled = !(name && email && phone && nbP >= 1 && nbP <= 2);
    }

    [inputName, inputEmail, inputPhone, inputPersons].forEach(el => {
      el.addEventListener("input", () => { validateForm(); updatePriceDisplay(); });
    });

    const cal = new FullCalendar.Calendar(el, {
      initialView: "dayGridMonth",
      selectable: true,
      firstDay: 1,
      locale: "fr",
      height: "auto",
      selectAllow(sel) {
        const today = new Date(); today.setHours(0,0,0,0);
        if (sel.start < today) return false;
        return !reservedRanges.some(r => sel.start < r.end && sel.end > r.start);
      },
      dateClick(info) {
        // FullCalendar gère déjà le select sur mobile et desktop
        const s = new Date(info.dateStr);
        const e = new Date(s); e.setDate(e.getDate()+1);
        if (!cal.opt("selectAllow")({start:s,end:e})) return;
        cal.select({start:s,end:e,allDay:true});
      },
      events: async (fetchInfo, success, failure) => {
        try {
          const res = await fetch(`${calendarBackend}/api/reservations/BLOM`);
          const data = await res.json();
          reservedRanges = data.map(e => {
            const start = new Date(e.start);
            const end = new Date(e.end);
            end.setDate(end.getDate() - 1); // jour de départ libre
            return {start,end};
          });
          success(reservedRanges.map(r => ({
            title:"Réservé",
            start:r.start,
            end:new Date(r.end.getTime()+24*60*60*1000),
            display:"background",
            backgroundColor:"#900",
            borderColor:"#900",
            allDay:true
          })));
        } catch(err) { failure(err); }
      },
      select(info) {
        selectedStart = info.startStr.split("T")[0];
        selectedEnd = info.endStr.split("T")[0];
        modalDates.textContent = `Du ${selectedStart} au ${selectedEnd}`;
        inputName.value=""; inputEmail.value=""; inputPhone.value=""; inputPersons.value=2;
        validateForm(); updatePriceDisplay();
        modal.style.display="flex";
      }
    });

    cal.render();

    btnCancel.addEventListener("click", () => { modal.style.display="none"; cal.unselect(); });
    btnConfirm.addEventListener("click", async () => {
      const name = inputName.value.trim();
      const email = inputEmail.value.trim();
      const phone = inputPhone.value.trim();
      const nbP = parseInt(inputPersons.value);
      const total = sumPrice(selectedStart, selectedEnd, nbP, testPayment);
      if (!confirm(`Réserver BLŌM du ${selectedStart} au ${selectedEnd} pour ${total} € ?`)) return;
      const res = await fetch(`${stripeBackend}/api/checkout`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({logement:"BLŌM",startDate:selectedStart,endDate:selectedEnd,amount:total,personnes:nbP,name,email,phone})
      });
      const data = await res.json();
      if(data.url) location.href=data.url; else alert("Impossible de créer la réservation.");
    });
  });

})();
