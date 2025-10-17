---
layout: default
title: LIVA – Maison tout équipée à Guesnain pour couples, familles, ou dans le cadre d'une activité pro
description: "Séjour premium à LIVA : logement spacieux, cuisine équipée, parking privé et sécurisé, idéal pour familles, couples et professionnels dans le Douaisis."
image: "/assets/galerie/liva/salon1.jpg"
permalink: /liva/
keywords: "logement tout confort Douaisis, maison équipée Guesnain, séjour famille Douai, logement pro Douai, hébergement spacieux Nord, LIVA, LIVABLŌM"
---

<!-- Balises Open Graph pour le partage -->
<meta property="og:title" content="LIVA – Maison tout équipée à Guesnain pour couples, familles et pros">
<meta property="og:description" content="Séjour premium à LIVA : logement spacieux, cuisine équipée, parking privé et sécurisé dans le Douaisis, idéal pour familles, couples et professionnels.">
<meta property="og:image" content="{{ site.baseurl }}/assets/galerie/liva/salon1.jpg">
<meta property="og:url" content="{{ site.url }}{{ page.url }}">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_FR">

<!-- Données structurées pour Google (schema.org) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "LIVA – Logement tout confort",
  "image": "{{ site.url }}{{ site.baseurl }}/assets/galerie/liva/salon1.jpg",
  "description": "Logement spacieux et tout équipé pour familles, couples et professionnels dans le Douaisis, avec cuisine, parking et espace confortable.",
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
  "priceRange": "€€",
  "telephone": "+33 6 00 00 00 00",
  "url": "https://livablom.github.io/liva/",
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Cuisine équipée" },
    { "@type": "LocationFeatureSpecification", "name": "Parking privé" },
    { "@type": "LocationFeatureSpecification", "name": "Espace tout confort" }
  ],
  "containedInPlace": {
    "@type": "Place",
    "name": "Douaisis"
  }
}
</script>

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

<!-- Appel à l'action : Réserver LIVA -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
  <h3 class="text-2xl font-bold mb-2">Réservez LIVA</h3>
  <p class="mb-4">Logement tout équipé tout confort</p>

  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <a href="/assets/html/liva-calendar.html" 
       class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </a>
    {% include share.html %}
  </div>
</div>

<!-- Modal calendrier LIVA -->
<div id="calendarModalLiva" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4" onclick="closeCalendar('LIVA', event)">
  <div class="bg-white rounded-xl shadow-xl relative w-full max-w-5xl mx-auto p-6" onclick="event.stopPropagation()">
    <button onclick="closeCalendar('LIVA')" class="absolute top-2 right-4 text-3xl font-bold text-gray-600 hover:text-black">&times;</button>
    <h3 class="text-2xl font-bold text-center mt-2 mb-6">Choisissez vos dates pour LIVA</h3>
    <div id="calendar-container-liva" class="w-full h-[500px] md:h-[600px]"></div>
  </div>
</div>

<!-- FullCalendar -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>

<script>
let calendars = {}; // Stocke les instances de calendrier
let selectedStart = null;
let selectedEnd = null;

// Tarifs des logements
const tarifs = {
  LIVA: 79,  // Base pour 2 personnes
  BLOM: { // Exemple BLŌM : tarif selon jour
    weekday: 150,
    fridaySaturday: 169,
    sunday: 190
  }
};

// Ouvre le modal calendrier
function openCalendar(logement) {
  const modalId = logement === "BLOM" ? "calendarModalBlom" : "calendarModalLiva";
  const modal = document.getElementById(modalId);
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  if (!calendars[logement]) {
    initCalendar(logement);
  }
}

// Ferme le modal calendrier
function closeCalendar(logement, event) {
  const modalId = logement === "BLOM" ? "calendarModalBlom" : "calendarModalLiva";
  const modal = document.getElementById(modalId);
  if (!event || event.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

// Retourne le tarif LIVA ou BLOM pour une date
function getTarif(logement, date, nbPersonnes = 2) {
  if (logement === "LIVA") {
    if (nbPersonnes <= 2) return tarifs.LIVA;
    return tarifs.LIVA + (nbPersonnes - 2) * 20;
  } else if (logement === "BLOM") {
    const day = new Date(date).getDay(); // 0 = dimanche, 5 = vendredi, 6 = samedi
    if (day === 5 || day === 6) return tarifs.BLOM.fridaySaturday;
    if (day === 0) return tarifs.BLOM.sunday;
    return tarifs.BLOM.weekday;
  }
}

// Initialise le calendrier
async function initCalendar(logement) {
  try {
    const res = await fetch(`https://calendar-proxy-production-231c.up.railway.app/api/reservations/${logement}`);
    const events = await res.json();

    const containerId = logement === "BLOM" ? "calendar-container-blom" : "calendar-container-liva";
    const calendarEl = document.getElementById(containerId);

    const toISODate = (d) => {
      const x = new Date(d);
      const y = x.getFullYear();
      const m = String(x.getMonth() + 1).padStart(2, "0");
      const day = String(x.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
      events: events.map(ev => ({
        title: "Réservé",
        start: toISODate(ev.start),
        end: toISODate(ev.end),
        allDay: true,
        display: "block",
        backgroundColor: "#e63946"
      })),
      displayEventTime: false,
      selectable: true,
      selectLongPressDelay: 0,
      navLinks: true,

      select: function(info) {
        selectedStart = info.startStr;
        selectedEnd = info.endStr;

        // Ouvre le modal
        const modalId = logement === "BLOM" ? "calendarModalBlom" : "calendarModalLiva";
        const modal = document.getElementById(modalId);
        modal.classList.remove("hidden");
        modal.classList.add("flex");

        // Champs du formulaire
        const inputName = document.getElementById("res-name");
        const inputEmail = document.getElementById("res-email");
        const inputPhone = document.getElementById("res-phone");
        const inputPersons = document.getElementById("res-persons");
        const priceDisplay = document.getElementById("modal-price");

        inputName.value = "";
        inputEmail.value = "";
        inputPhone.value = "";
        inputPersons.value = 2;

        function updatePrice() {
          const nbPersons = parseInt(inputPersons.value) || 2;
          let total = 0;
          let cur = new Date(selectedStart);
          const fin = new Date(selectedEnd);
          while (cur < fin) {
            total += getTarif(logement, cur.toISOString().split("T")[0], nbPersons);
            cur.setDate(cur.getDate() + 1);
          }
          priceDisplay.textContent = `Montant total : ${total} €`;
        }

        updatePrice();
        inputPersons.addEventListener("input", updatePrice);
      }
    });

    calendar.render();
    calendars[logement] = calendar;
  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
  }
}
</script>

<script>
let calendars = {}; // stocke les instances pour BLOM et LIVA

function openCalendar(logement) {
  const modalId = logement === "BLOM" ? "calendarModalBlom" : "calendarModalLiva";
  document.getElementById(modalId).classList.remove("hidden");
  document.getElementById(modalId).classList.add("flex");

  if (!calendars[logement]) {
    initCalendar(logement);
  }
}

function closeCalendar(logement, event) {
  const modalId = logement === "BLOM" ? "calendarModalBlom" : "calendarModalLiva";
  const modal = document.getElementById(modalId);
  if (!event || event.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

async function initCalendar(logement) {
  try {
    const res = await fetch(`https://calendar-proxy-production-231c.up.railway.app/api/reservations/${logement}`);
    const events = await res.json();

    const containerId = logement === "BLOM" ? "calendar-container-blom" : "calendar-container-liva";
    const calendarEl = document.getElementById(containerId);

    const toISODate = (d) => {
      const x = new Date(d);
      const y = x.getFullYear();
      const m = String(x.getMonth() + 1).padStart(2, "0");
      const day = String(x.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      height: "auto",
      locale: "fr",
      firstDay: 1,
      headerToolbar: { left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek" },
      events: events.map(ev => ({
        title: "Réservé",
        start: toISODate(ev.start),
        end: toISODate(ev.end),
        allDay: true,
        display: "block"
      })),
      displayEventTime: false,
      eventColor: "#e63946",
      selectable: false,
      navLinks: true
    });

    calendar.render();
    calendars[logement] = calendar;
  } catch (err) {
    console.error(err);
    alert("Impossible de charger le calendrier. Vérifiez la connexion au serveur.");
  }
}
</script>
