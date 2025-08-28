<!-- Bouton Réserver -->
<div class="text-center mt-8">
  <button onclick="openCalendarBlom()" class="bg-red-500 text-white px-6 py-3 rounded-lg shadow hover:bg-red-600">
    Réserver
  </button>
</div>

<!-- Modal Calendrier BLOM -->
<div id="calendarModalBlom" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50">
  <div class="bg-white rounded-lg shadow-lg p-4 w-11/12 max-w-3xl relative">
    <button onclick="closeCalendarBlom()" class="absolute top-2 right-2 text-gray-600 hover:text-black">&times;</button>
    <div id="calendar-blom"></div>
  </div>
</div>

<!-- FullCalendar CSS & JS -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

<script>
  let calendarInitializedBlom = false;

  function openCalendarBlom() {
    const modal = document.getElementById("calendarModalBlom");
    modal.classList.remove("hidden");
    modal.classList.add("flex");

    if (!calendarInitializedBlom) {
      const calendarEl = document.getElementById("calendar-blom");

      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        height: "auto",
        contentHeight: 500,
        aspectRatio: 1.35,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: ''
        },
        events: [
          { title: 'Réservé', start: '2025-09-05', end: '2025-09-07', allDay: true },
          { title: 'Réservé', start: '2025-09-15', end: '2025-09-17', allDay: true },
          { title: 'Réservé', start: '2025-09-25', allDay: true }
        ],
        eventDisplay: 'background',
        eventColor: '#ff4d4d'
      });

      calendar.render();
      calendarInitializedBlom = true;
    }
  }

  function closeCalendarBlom() {
    const modal = document.getElementById("calendarModalBlom");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
</script>
