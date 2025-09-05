// Charger le HTML du calendrier et initialiser
document.addEventListener("DOMContentLoaded", () => {
  const reserveBtn = document.getElementById("reserveBlom");
  if (!reserveBtn) return;

  reserveBtn.addEventListener("click", async () => {
    const modal = document.getElementById("calendarModalBlom");
    const html = await fetch("/assets/html/blom-calendar.html").then(r => r.text());
    modal.innerHTML = html;
    modal.classList.remove("hidden");
    initCalendarBlom();
  });
});

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function ymd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

window.blockedDatesBlom = new Set();

function initCalendarBlom() {
  const calendarEl = document.getElementById("calendar-container-blom");
  if (!calendarEl) return;

  const events = [
    { title:"Réservé", start:"2025-09-10", end:"2025-09-13", allDay:true, display:"block", color:"#e63946" }
  ];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    locale: "fr",
    firstDay: 1,
    headerToolbar: { left:"prev,next today", center:"title", right:"" },
    events,
    selectable:true,
    dateClick: onDateClickBlom
  });

  calendar.render();
}

function onDateClickBlom(info) {
  const dateStr = info.dateStr;
  document.getElementById("arrivalBlom").value = dateStr;
  document.getElementById("nightsBlom").value = 1;
  document.getElementById("departureBlom").value = ymd(addDays(new Date(dateStr),1));
  document.getElementById("bookingPanelBlom").classList.remove("hidden");

  document.getElementById("confirmBlom").onclick = () => {
    const nights = parseInt(document.getElementById("nightsBlom").value,10);
    const dep = addDays(new Date(dateStr), nights);
    alert(`Arrivée: ${dateStr}\nNuits: ${nights}\nDépart: ${ymd(dep)}`);
  };
}

function adjustNightsBlom(delta) {
  const nightsInput = document.getElementById("nightsBlom");
  let nights = parseInt(nightsInput.value) + delta;
  if (nights < 1) nights = 1;
  nightsInput.value = nights;

  const arrival = document.getElementById("arrivalBlom").value;
  if(arrival){
    const dep = addDays(new Date(arrival), nights);
    document.getElementById("departureBlom").value = ymd(dep);
  }
}
