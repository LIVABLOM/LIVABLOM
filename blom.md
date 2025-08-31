---
layout: default
title: BLŌM – Spa privatif et hébergement romantique à Guesnain
description: "Offrez-vous une parenthèse romantique à BLŌM : logement de charme, spa privatif, détente et petit‑déjeuner inclus."
image: "/assets/galerie/blom/blom22.jpg"
permalink: /blom/
---

<section class="bg-black text-white py-12 px-4 w-full overflow-x-hidden">
  <div class="max-w-6xl mx-auto space-y-16">

    <h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">BLŌM – Détente & Évasion</h1>

    <p class="text-lg text-center max-w-2xl mx-auto mt-4 animate-fadeIn delay-50">
      Découvrez BLŌM, un refuge romantique où le bien‑être prend tout son sens
      · Au rez-de-chaussée, un salon chaleureux invite à la détente, tandis que le spa privatif vous enveloppe dans une atmosphère paisible. Une table élégamment dressée vous attend pour des moments de partage à deux.
      · À l’étage, un espace dédié au bien-être : une chambre spacieuse et raffinée, une douche moderne et une salle de massage apaisante. Chaque détail est pensé pour offrir sérénité, volupté et moments intimes.
    </p>

    <!-- Bandeau hygiène -->
    <div class="bg-red-600 text-white text-sm px-6 py-3 rounded-full shadow-md text-center max-w-md mx-auto mb-6 animate-pulse">
      Le spa est vidé, désinfecté et rempli pour chaque client – Vidéo envoyée le jour de votre arrivée 📹
    </div>

    <!-- Bloc 1 -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-200 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/image-jacuzzi.png" alt="Jacuzzi privatif"
             class="w-full h-auto max-w-full object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Jacuzzi privatif</h2>
        <p>Chez BLŌM, l’eau de votre spa est totalement vidée et renouvelée pour chaque nouveau client. Vous êtes assurés d’une hygiène parfaite et d’une expérience 100 % privative. Jacuzzi intérieur à température idéale pour un moment de détente à deux. Ambiance tamisée et intimité garantie.</p>
      </div>
    </div>

    <!-- Bloc 2 -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-300 transition-all">
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <div class="relative w-full rounded-xl overflow-hidden shadow-lg">
          <img src="{{ site.baseurl }}/assets/galerie/blom/blom31.jpg" alt="Table de massage manuelle"
               class="w-full h-auto object-cover filter brightness-75" />
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div class="relative w-full rounded-xl overflow-hidden shadow-lg">
          <img src="{{ site.baseurl }}/assets/galerie/blom/blom37.jpg" alt="Table de massage électrique"
               class="w-full h-auto object-cover filter brightness-75" />
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Espace Massage</h2>
        <p>Deux types de massage : manuel à partager en duo, ou table de massage électrique avec 16 programmes et fonction chauffante, parfaite pour un moment de détente en solo ou à deux.</p>
      </div>
    </div>

    <!-- Bloc 3 -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-400 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom13.jpg" alt="Lit king size et coin salon"
             class="w-full h-auto object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Lit King Size & Salon</h2>
        <p>Un lit spacieux avec coin salon et TV connectée. Idéal pour un séjour romantique dans un cadre cosy.</p>
      </div>
    </div>

    <!-- Bloc 4 -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-500 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom10.jpg" alt="Table romantique dressée"
             class="w-full h-auto object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Table Romantique</h2>
        <p>Vous souhaitez apporter votre dîner ? Une table romantique vous attend, dressée avec soin pour sublimer votre soirée.</p>
      </div>
    </div>

    <!-- Bloc témoignages -->
    <div class="mt-20 bg-black text-white">
      <h2 class="text-2xl font-bold text-center mb-6">Ils ont séjourné chez BLŌM</h2>
      <div class="relative max-w-3xl mx-auto overflow-hidden">
        <div id="carousel" class="flex transition-transform duration-700">
          {% for avis in site.data.avis_blom %}
          <div class="min-w-full px-4 cursor-pointer" onclick="openModal({{ forloop.index0 }})">
            <p class="italic text-lg truncate">“{{ avis.texte | truncate: 100 }}”</p>
            <span class="block mt-2 text-sm text-gray-400">– {{ avis.auteur }}</span>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>

    <!-- Modal témoignages -->
    <div id="testimonialModal" class="hidden fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div class="bg-black text-white max-w-2xl p-6 rounded-xl relative">
        <button id="closeBtn" class="absolute top-2 right-2 text-white text-xl">✖</button>
        <div id="modalText" class="whitespace-pre-line"></div>
        <div class="flex justify-between mt-4">
          <button id="prevBtn" class="px-4 py-2 bg-gray-700 rounded">◀</button>
          <button id="nextBtn" class="px-4 py-2 bg-gray-700 rounded">▶</button>
        </div>
      </div>
    </div>

    <!-- Scripts carrousel + modal -->
    <script>
    document.addEventListener("DOMContentLoaded", () => {
      let currentIndex = 0;
      const carousel = document.getElementById("carousel");
      const items = carousel.children;
      const totalItems = items.length;

      const fullTestimonials = [
        {% for temoignage in site.data.avis_blom %}
        `{{ temoignage.texte | strip_newlines | escape }}`,
        {% endfor %}
      ];

      function showCarouselSlide(index) {
        const offset = -index * 100;
        carousel.style.transform = `translateX(${offset}%)`;
      }

      setInterval(() => {
        currentIndex = (currentIndex + 1) % totalItems;
        showCarouselSlide(currentIndex);
      }, 5000);

      Array.from(items).forEach((item, i) => {
        item.addEventListener("click", () => {
          currentIndex = i;
          updateModalText();
          document.getElementById("testimonialModal").classList.remove("hidden");
          document.getElementById("testimonialModal").classList.add("flex");
        });
      });

      function updateModalText() {
        document.getElementById("modalText").innerText = fullTestimonials[currentIndex];
      }

      document.getElementById("prevBtn").addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + fullTestimonials.length) % fullTestimonials.length;
        updateModalText();
      });
      document.getElementById("nextBtn").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % fullTestimonials.length;
        updateModalText();
      });
      document.getElementById("closeBtn").addEventListener("click", () => {
        document.getElementById("testimonialModal").classList.add("hidden");
        document.getElementById("testimonialModal").classList.remove("flex");
      });
    });
    </script>
<!-- Appel à l'action : Réserver BLŌM -->
<div class="mt-12 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-3xl mx-auto">
  <h3 class="text-2xl font-bold mb-2">Réservez BLŌM</h3>
  <p class="mb-4">Logement avec spa pour couples</p>

  <button onclick="openCalendarBlom()" class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition">
    Réserver maintenant
  </button>
</div>

<!-- Modal / Widget calendrier BLŌM -->
<div id="calendarModalBlom" class="fixed inset-0 bg-black bg-opacity-60 hidden items-center justify-center z-50 px-4" onclick="closeCalendarBlom(event)">
  <div class="bg-black rounded-xl shadow-xl relative w-full max-w-3xl mx-auto p-4 md:p-6" onclick="event.stopPropagation()">
    <button onclick="closeCalendarBlom()" class="absolute top-2 right-4 text-2xl font-bold text-gray-200 hover:text-white">&times;</button>
    <h3 class="text-xl md:text-2xl font-bold text-center mt-2 mb-4 text-white">Choisissez vos dates</h3>
    <div id="calendar-blom" class="w-full h-[350px] md:h-[450px]"></div>
  </div>
</div>

<!-- FullCalendar CSS & JS -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<style>
#calendar-blom {
  background: #111;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(0,0,0,0.5);
  font-family: "Arial", sans-serif;
  padding: 10px;
}

.fc .fc-toolbar-title { font-size: 1.25rem; font-weight: bold; color: #fff; }
.fc .fc-button { background: #222; border: none; color: #fff; border-radius: 6px; padding: 4px 10px; transition: 0.3s; }
.fc .fc-button:hover { background: #444; }
.fc .fc-daygrid-day-number { color: #fff; font-weight: bold; }
.fc .fc-day-today { background: rgba(255,255,255,0.08) !important; }
.fc .fc-day-sat, .fc .fc-day-sun { background: rgba(255,255,255,0.03); }
.fc-event { background: #e63946 !important; border: none !important; border-radius: 4px !important; font-size: 0.8rem !important; padding: 1px 3px; text-align: center; }
.fc-event:hover { background: #ff4c5b !important; }
</style>

<script>
let calendarInitialized = false;

function openCalendarBlom() {
  const modal = document.getElementById("calendarModalBlom");
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (!calendarInitialized) {
    initCalendarBlom();
    calendarInitialized = true;
  }
}

function closeCalendarBlom(event) {
  const modal = document.getElementById("calendarModalBlom");
  if (!event || event.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

async function initCalendarBlom() {
  try {
    const res = await fetch("https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM");
    const events = await res.json();

    const calendarEl = document.getElementById("calendar-blom");
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay"
      },
      events: events,
      eventColor: "#e63946",
      eventDisplay: "block",
      navLinks: true,
      selectable: true,
      selectMirror: true
    });

    calendar.render();
  } catch (err) {
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
    console.error(err);
  }
}
</script>
