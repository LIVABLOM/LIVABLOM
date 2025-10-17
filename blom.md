---
layout: default
title: BLŌM – Spa privatif et hébergement romantique à Guesnain
description: "Offrez-vous une parenthèse romantique à BLŌM : logement de charme réservé aux couples dans le Douaisis, avec spa privatif, salle de massage et petit-déjeuner offert."
image: "/assets/galerie/blom/blom22.jpg"
permalink: /blom/
keywords: "spa privatif Douaisis, suite romantique Douai, logement spa Guesnain, massage couple Douai, hébergement bien-être Nord, jacuzzi privatif Douai, nuit détente romantique, LIVABLŌM, BLŌM"
---

<!-- Balises Open Graph pour le partage -->
<meta property="og:title" content="BLŌM – Spa privatif et hébergement romantique à Guesnain">
<meta property="og:description" content="Offrez-vous une parenthèse romantique à BLŌM : spa privatif, salle de massage et petit déjeuner offert, à Guesnain près de Douai.">
<meta property="og:image" content="{{ site.baseurl }}/assets/galerie/blom/blom22.jpg">
<meta property="og:url" content="{{ site.url }}{{ page.url }}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">

<!-- Données structurées pour Google (schema.org) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "BLŌM – Suite romantique avec spa et massage",
  "image": "{{ site.url }}{{ site.baseurl }}/assets/galerie/blom/blom22.jpg",
  "description": "Logement haut de gamme réservé aux couples dans le Douaisis, avec spa privatif, salle de massage et petit déjeuner offert.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "338 boulevard Ambroise Croizat",
    "addressLocality": "Guesnain",
    "postalCode": "59287",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "50.3666",
    "longitude": "3.0808"
  },
  "priceRange": "€€€",
  "telephone": "+33 6 00 00 00 00",
  "url": "https://livablom.github.io/blom/",
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Spa privatif" },
    { "@type": "LocationFeatureSpecification", "name": "Salle de massage" },
    { "@type": "LocationFeatureSpecification", "name": "Petit déjeuner offert" },
    { "@type": "LocationFeatureSpecification", "name": "Arrivée autonome" }
  ],
  "containedInPlace": {
    "@type": "Place",
    "name": "Douaisis"
  }
}
</script>

<section class="bg-black text-white py-12 px-4 w-full overflow-x-hidden">
  <div class="max-w-6xl mx-auto space-y-16">

    <h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">BLŌM – Détente & Évasion</h1>

    <p class="text-lg text-center max-w-2xl mx-auto mt-4 animate-fadeIn delay-50">
      Découvrez BLŌM, un refuge romantique où le bien-être prend tout son sens
      · Au rez-de-chaussée, un salon chaleureux invite à la détente, tandis que le spa privatif vous enveloppe dans une atmosphère paisible. Une table élégamment dressée vous attend pour des moments de partage à deux.
      · À l’étage, un espace dédié au bien-être : une chambre spacieuse et raffinée, une douche moderne et une salle de massage apaisante. Chaque détail est pensé pour offrir sérénité, volupté et moments intimes.
    </p>

    <!-- Bandeau hygiène -->
    <div class="bg-red-600 text-white text-sm px-6 py-3 rounded-full shadow-md text-center max-w-md mx-auto mb-6 animate-pulse">
      Le spa est vidé, désinfecté et rempli pour chaque client – Vidéo envoyée le jour de votre arrivée 📹
    </div>

    <!-- Blocs prestations (Jacuzzi, Massage, Lit King Size, Table Romantique) -->
    <!-- Garde les mêmes blocs que ton blom.md original -->
    {% include blom-prestations.html %}

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
    <div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
      <h3 class="text-2xl font-bold mb-2">Réservez BLŌM</h3>
      <p class="mb-4">Logement avec spa privatif et prestations bien-être</p>

      <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
        <a href="/assets/html/blom-calendar.html" 
           class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
          Réserver maintenant
        </a>
        {% include share.html %}
      </div>
    </div>

</section>

<!-- FullCalendar CSS & JS -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<script>
async function initBlomCalendar() {
  try {
    const res = await fetch('https://calendar-proxy-production-231c.up.railway.app/api/reservations/BLOM');
    const events = await res.json();
    const calendarEl = document.getElementById('calendar-container-blom');
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      height: 'auto',
      locale: 'fr',
      firstDay: 1,
      headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek' },
      events: events.map(e => ({
        start: e.start,
        end: e.end,
        display: 'background',
        color: '#ff0000'
      })),
      selectable: true,
      selectMirror: true,
      dateClick: function(info) {
        alert("Date sélectionnée : " + info.dateStr);
        // Ici tu peux ajouter le code pour ouvrir le formulaire de réservation BLŌM
      }
    });

    calendar.render();
  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier BLŌM.");
  }
}

// Init après chargement
document.addEventListener("DOMContentLoaded", () => {
  initBlomCalendar();
});
</script>
