---
layout: default
title: BLŌM – Logement avec spa à Guesnain pour couples
description: "Séjour romantique à BLŌM : logement avec spa, ambiance détente et intimité assurée."
image: "/assets/galerie/blom/spa1.jpg"
permalink: /blom/
---

<div class="bg-gray-100 min-h-screen px-6 py-8 text-center flex flex-col">

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="mb-12 max-w-3xl mx-auto">
    <h1 class="text-5xl font-extrabold mb-6 text-gray-900">BLŌM – Logement spa pour couples</h1>
    <p class="text-xl text-gray-800 max-w-xl mx-auto">
      <strong>Pour couples uniquement. Profitez d'un spa privé, d'un lit king size et d'un séjour détente complet.</strong>
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="mb-12 max-w-5xl mx-auto">
    <h2 class="text-3xl font-semibold mb-8 text-gray-900">Galerie</h2>
    <div class="flex flex-wrap justify-center gap-6">
      <a href="{{ site.baseurl }}/assets/galerie/blom/spa1.jpg" data-lightbox="blom" data-title="Spa BLŌM" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/galerie/blom/spa1.jpg" alt="Spa BLŌM" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/galerie/blom/chambre.jpg" data-lightbox="blom" data-title="Chambre BLŌM" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/galerie/blom/chambre.jpg" alt="Chambre BLŌM" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/galerie/blom/salon.jpg" data-lightbox="blom" data-title="Salon BLŌM" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/galerie/blom/salon.jpg" alt="Salon BLŌM" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/galerie/blom/terrasse.jpg" data-lightbox="blom" data-title="Terrasse BLŌM" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/galerie/blom/terrasse.jpg" alt="Terrasse BLŌM" class="w-full h-40 object-cover" />
      </a>
    </div>
  </section>

  <!-- SECTION TARIFS -->
  <section id="tarifs" class="mb-12 max-w-3xl mx-auto text-left px-4">
    <h2 class="text-3xl font-semibold mb-6 text-gray-900">Tarifs</h2>
    <p class="text-xl">
      Nuitée : 
      <ul class="list-disc ml-6 mt-2">
        <li>Lundi – Jeudi : 150 €</li>
        <li>Vendredi – Samedi : 169 €</li>
        <li>Dimanche : 190 €</li>
      </ul>
    </p>
    <p class="mt-3 italic text-sm text-gray-600">
      Formules journée ou 4h disponibles sur demande après contact.
    </p>
  </section>

  <!-- Bloc témoignages -->
  <div class="mt-20">
    <h2 class="text-2xl font-bold text-center mb-6">Ils ont séjourné chez BLŌM</h2>
    <div class="relative max-w-3xl mx-auto overflow-hidden">
      <div id="carousel" class="flex transition-transform duration-700">
        {% for temoignage in site.data.temoignages-blom %}
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

  <!-- Appel à l'action : Réserver BLŌM -->
  <div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl animate-fadeIn delay-600 max-w-4xl mx-auto">
    <h3 class="text-2xl font-bold mb-2">Réservez BLŌM</h3>
    <p class="mb-4">Logement avec spa pour couples</p>

    <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
      <!-- J'appelle la fonction spécifique BLOM -->
      <button onclick="openCalendarBlom()" class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition">
        Réserver maintenant
      </button>
      {% include share.html %}
    </div>
  </div>

  <!-- Modal calendrier BLŌM -->
  <div id="calendarModal" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4" onclick="closeCalendar(event)">
    <div class="bg-white rounded-xl shadow-xl relative w-full max-w-4xl mx-auto p-4" onclick="event.stopPropagation()">
      <button onclick="closeCalendar()" class="absolute top-2 right-4 text-2xl font-bold text-gray-600 hover:text-black">&times;</button>
      <h3 class="text-xl font-bold text-center mt-2 mb-4">Choisissez vos dates</h3>

      <!-- Conteneur FullCalendar -->
      <div id="calendar-blom" class="w-full h-[400px] md:h-[500px]"></div>
    </div>
  </div>

  <!-- FullCalendar CSS & JS (garde la même version que LIVA pour cohérence) -->
  <link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.11/index.global.min.js"></script>

  <!-- Script calendrier BLŌM (récupère puis filtre côté client les événements BLOM) -->
  <script>
    let calendarInitializedBlom = false;

    async function openCalendarBlom() {
      const modal = document.getElementById("calendarModal");
      modal.classList.remove("hidden");
      modal.classList.add("flex");

      if (!calendarInitializedBlom) {
        const calendarEl = document.getElementById("calendar-blom");

        try {
          // Récupère tous les événements depuis le proxy
          const res = await fetch('https://calendar-proxy-production-231c.up.railway.app/api/calendar');
          const allEvents = await res.json();

          // Filtre uniquement les événements BLOM (source contenant "BLOM")
          const blomEvents = allEvents
            .filter(e => e.source && e.source.toUpperCase().includes('BLOM'))
            .map(e => ({
              title: e.title || 'Bloqué',
              start: e.start,
              end: e.end,
              allDay: e.allDay
            }));

          // Initialiser FullCalendar avec les événements BLOM
          const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'fr',
            height: "auto",
            contentHeight: 500,
            aspectRatio: 1.35,
            events: blomEvents,
            eventDisplay: 'background',
            eventColor: '#ff4d4d'
          });

          calendar.render();
          calendarInitializedBlom = true;
        } catch (err) {
          console.error('Erreur récupération événements BLŌM :', err);
        }
      }
    }

    function closeCalendar(event) {
      if (!event || event.target.id === "calendarModal") {
        const modal = document.getElementById("calendarModal");
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      }
    }
  </script>

  <!-- Script témoignages BLŌM -->
  <script>
    let currentIndex = 0;
    const fullTestimonials = [
      {% for temoignage in site.data.temoignages-blom %}
        "{{ temoignage.texte | strip_newlines | escape }}",
      {% endfor %}
    ];

    function openModal(i) {
      currentIndex = i;
      updateModalText();
      document.getElementById("testimonialModal").classList.remove("hidden");
      document.getElementById("testimonialModal").classList.add("flex");
    }
    function closeModal() {
      document.getElementById("testimonialModal").classList.add("hidden");
      document.getElementById("testimonialModal").classList.remove("flex");
    }
    function updateModalText() {
      document.getElementById("modalText").innerText = fullTestimonials[currentIndex];
    }
    function prevTestimonial() {
      currentIndex = (currentIndex - 1 + fullTestimonials.length) % fullTestimonials.length;
      updateModalText();
    }
    function nextTestimonial() {
      currentIndex = (currentIndex + 1) % fullTestimonials.length;
      updateModalText();
    }

    // Carrousel auto (conserve ta logique)
    const carousel = document.getElementById("carousel");
    const totalItems = {{ site.data.temoignages-blom | size }};
    let carouselIndex = 0;
    function showCarouselSlide(index) {
      const offset = -index * 100;
      if (carousel) carousel.style.transform = `translateX(${offset}%)`;
    }
    setInterval(() => {
      carouselIndex = (carouselIndex + 1) % (totalItems || 1);
      showCarouselSlide(carouselIndex);
    }, 4000);
  </script>
</div>
