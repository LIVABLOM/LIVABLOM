<!-- Appel à l'action : Réserver BLŌM -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
  <h3 class="text-2xl font-bold mb-2">Réservez BLŌM</h3>
  <p class="mb-4">Logement avec spa privatif et prestations bien-être</p>

  <!-- Bloc boutons -->
  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <button onclick="openCalendar('BLOM')" 
            class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </button>
    {% include share.html %}
  </div>
</div>

<!-- Modal calendrier BLOM -->
<div id="calendarModalBLOM" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4" onclick="closeCalendar('BLOM', event)">
  <div class="bg-white rounded-xl shadow-xl relative w-full max-w-5xl mx-auto p-6" onclick="event.stopPropagation()">
    <button onclick="closeCalendar('BLOM')" class="absolute top-2 right-4 text-3xl font-bold text-gray-600 hover:text-black">&times;</button>
    <h3 class="text-2xl font-bold text-center mt-2 mb-6">Choisissez vos dates</h3>
    <div id="calendar-container-BLOM" class="w-full h-[500px] md:h-[600px]"></div>

    <!-- Récapitulatif réservation -->
    <div id="reservation-summary-BLOM" class="mt-6 hidden bg-gray-100 p-4 rounded-xl text-center"></div>
  </div>
</div>

<!-- FullCalendar CSS & JS -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<style>
#calendar-container-BLOM {
  max-width: 900px;
  margin: 0 auto;
  background: #111;
  color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.fc .fc-toolbar-title { font-size: 1.5rem; font-weight: bold; color: #fff; }
.fc .fc-button { background: #222; border: none; color: #fff; border-radius: 8px; padding: 5px 12px; transition: 0.3s; }
.fc .fc-button:hover { background: #444; }
.fc .fc-daygrid-day-number { color: #fff; font-weight: bold; }
.fc .fc-day-today { background: rgba(255,255,255,0.1) !important; }
.fc .fc-day-sat, .fc .fc-day-sun { background: rgba(255,255,255,0.05); }
.fc-event { background: #e63946 !important; border: none !important; border-radius: 5px !important; font-size: 0.85rem !important; padding: 2px 4px; text-align: center; }
.fc-event:hover { background: #ff4c5b !important; }
</style>

<script>
let calendarBLOM;
let initializedBLOM = false;
let selectedStart = null;
let selectedEnd = null;

function openCalendar(logement) {
  const modal = document.getElementById("calendarModal" + logement);
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (logement === "BLOM" && !initializedBLOM) {
    initCalendarBLOM();
    initializedBLOM = true;
  }
}

function closeCalendar(logement, event) {
  const modal = document.getElementById("calendarModal" + logement);
  if (!event || event.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

async function initCalendarBLOM() {
  try {
    const res = await fetch(`https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM`);
    const events = await res.json();

    const calendarEl = document.getElementById("calendar-container-BLOM");
    calendarBLOM = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      selectable: true,
      headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
      events: events.map(ev => ({
        title: "Réservé",
        start: ev.start,
        end: ev.end,
        display: "background", // empêche d'afficher "2h"
        backgroundColor: "#e63946"
      })),
      select: function(info) {
        selectedStart = info.start;
        selectedEnd = info.end;

        // Calcul des nuits
        let nights = (selectedEnd - selectedStart) / (1000 * 60 * 60 * 24);

        if (nights <= 0) {
          document.getElementById("reservation-summary-BLOM").classList.add("hidden");
          return;
        }

        // Calcul du prix (exemple : 150€/nuit en semaine, 169€ vendredi/samedi, 190€ dimanche)
        let total = 0;
        let tempDate = new Date(selectedStart);

        for (let i = 0; i < nights; i++) {
          let day = tempDate.getDay(); // 0=Dimanche, 5=Vendredi, 6=Samedi
          if (day === 5 || day === 6) total += 169;
          else if (day === 0) total += 190;
          else total += 150;
          tempDate.setDate(tempDate.getDate() + 1);
        }

        // Affichage résumé
        const summaryDiv = document.getElementById("reservation-summary-BLOM");
        summaryDiv.innerHTML = `
          <h4 class="text-xl font-bold mb-2">Récapitulatif de votre séjour</h4>
          <p>Arrivée : <b>${selectedStart.toLocaleDateString("fr-FR")}</b></p>
          <p>Départ : <b>${selectedEnd.toLocaleDateString("fr-FR")}</b></p>
          <p>Nuits : <b>${nights}</b></p>
          <p class="text-lg font-semibold mt-2">Total : <b>${total} €</b></p>
          <button class="mt-4 bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition"
                  onclick="goToStripe('BLOM', '${selectedStart.toISOString()}', '${selectedEnd.toISOString()}', ${total})">
            Valider ma réservation
          </button>
        `;
        summaryDiv.classList.remove("hidden");
      }
    });

    calendarBLOM.render();
  } catch (err) {
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
    console.error(err);
  }
}

// Redirection vers Stripe (placeholder)
function goToStripe(logement, start, end, total) {
  alert(`Paiement pour ${logement} du ${start} au ${end} - Total : ${total} €`);
  // Ici on branchera Stripe Checkout
}
</script>
