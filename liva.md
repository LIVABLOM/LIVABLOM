---
layout: default
title: LIVA – Maison tout équipée à Guesnain pour couples, familles, ou dans le cadre d'une activité pro
description: "Séjour premium à LIVA : logement spacieux, cuisine équipée, parking privé et securisée."
image: "/assets/galerie/liva/salon1.jpg"
permalink: /liva/
---

<div class="bg-gray-100 min-h-screen px-6 py-8 text-center flex flex-col">

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="mb-12 max-w-3xl mx-auto">
    <h1 class="text-5xl font-extrabold mb-6 text-gray-900">LIVA – Logement tout confort</h1>
    <p class="text-xl text-gray-800 max-w-xl mx-auto">
      <strong>Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.</strong>
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="mb-12 max-w-5xl mx-auto">
    <h2 class="text-3xl font-semibold mb-8 text-gray-900">Galerie</h2>
    <div class="flex flex-wrap justify-center gap-6">
      <!-- Images -->
      <a href="{{ site.baseurl }}/assets/images/salon1.jpg" data-lightbox="liva" data-title="Salon LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/salon1.jpg" alt="Salon LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/Liva.jpg" data-lightbox="liva" data-title="Salon LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/Liva.jpg" alt="Salon LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/chaise.jpg" data-lightbox="liva" data-title="Chaise design LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/chaise.jpg" alt="Chaise design LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/espacerepas.jpg" data-lightbox="liva" data-title="Coin repas LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/espacerepas.jpg" alt="Coin repas LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/the.jpg" data-lightbox="liva" data-title="Table LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/the.jpg" alt="Table LIVA" class="w-full h-40 object-cover" />
      </a>
    </div>
  </section>

  <!-- SECTION TARIFS -->
  <section id="tarifs" class="mb-12 max-w-3xl mx-auto text-left px-4">
    <h2 class="text-3xl font-semibold mb-6 text-gray-900">Tarifs</h2>
    <p class="text-xl">
      Tarif unique : <span class="font-bold text-blue-600">79 € par nuit</span>
    </p>
    <p class="mt-3 italic text-sm text-gray-600">
      Tarifs dégressifs possibles pour les séjours longs. Contactez-nous pour plus d'informations.
    </p>
  </section>

  <!-- Bloc témoignages -->
  <div class="mt-20">
    <h2 class="text-2xl font-bold text-center mb-6">Ils ont séjourné chez LIVA</h2>
    <div class="relative max-w-3xl mx-auto overflow-hidden">
      <div id="carousel" class="flex transition-transform duration-700">
        {% for temoignage in site.data.temoignages-liva %}
          <div class="min-w-full px-4 cursor-pointer" onclick="openModal({{ forloop.index0 }})">
            <p class="italic text-lg truncate">“{{ temoignage.texte | truncate: 100 }}”</p>
            <span class="block mt-2 text-sm text-gray-400">– {{ temoignage.auteur }}</span>
          </div>
        {% endfor %}
      </div>
    </div>
  </div>

  <!-- Modal témoignage -->
  <div id="testimonialModal" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
    <div class="bg-white text-black max-w-xl p-6 rounded-xl relative">
      <button onclick="closeModal()" class="absolute top-2 right-4 text-2xl font-bold text-gray-600">&times;</button>
      <p id="modalText" class="text-lg leading-relaxed mb-4"></p>
      <div class="flex justify-between mt-4">
        <button onclick="prevTestimonial()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
        <button onclick="nextTestimonial()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
      </div>
    </div>
  </div>

 <div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
    <h3 class="text-2xl font-bold mb-2">Réservez LIVA</h3>
    <p class="mb-4">Logement tout équipé avec parking privé et sécurisé</p>
    <!-- Bloc boutons responsive -->
    <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
      <button onclick="document.getElementById('calendarModal').classList.remove('hidden'); document.getElementById('calendarModal').classList.add('flex');"
              class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
        Réserver maintenant
      </button>
      {% include share.html %}
    </div>
  </div>
  
    <!-- Modal calendrier LIVA -->
    <div id="calendarModal" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4" onclick="closeCalendar(event)">
      <div class="bg-white rounded-xl shadow-xl relative w-full max-w-5xl mx-auto p-6" onclick="event.stopPropagation()">
        <button onclick="closeCalendar()" class="absolute top-2 right-4 text-3xl font-bold text-gray-600 hover:text-black">&times;</button>
        <h3 class="text-2xl font-bold text-center mt-2 mb-6">Choisissez vos dates</h3>
        <div id="calendar-container" class="w-full h-[500px] md:h-[600px]"></div>
      </div>
    </div>

  </div>
</section>

<!-- FullCalendar CSS & JS -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<style>
#calendar-container {
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
let calendar;
let calendarInitialized = false;

function openCalendar(logement) {
  document.getElementById("calendarModal").classList.remove("hidden");
  document.getElementById("calendarModal").classList.add("flex");

  if (!calendarInitialized) {
    initCalendar(logement);
    calendarInitialized = true;
  }
}

function closeCalendar(event) {
  const modal = document.getElementById("calendarModal");
  if (!event || event.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

async function initCalendar(logement) {
  try {
    const res = await fetch(`https://calendar-proxy-production-231c.up.railway.app/api/reservations/${logement}`);
    const events = await res.json();

    const calendarEl = document.getElementById("calendar-container");
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" },
      events: events.map(ev => ({
        title: ev.summary,
        start: ev.start,
        end: ev.end
      })),
      eventColor: "#e63946",
      selectable: true,
      navLinks: true
    });

    calendar.render();
  } catch (err) {
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
    console.error(err);
  }
}
</script>
