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
      <strong>
        Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.
      </strong>
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="mb-12 max-w-5xl mx-auto">
    <h2 class="text-3xl font-semibold mb-8 text-gray-900">Galerie</h2>
    <div class="flex flex-wrap justify-center gap-6">
      <!-- Images comme avant -->
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
  <!-- SECTION DISPONIBILITÉS -->
<section id="disponibilites" class="mb-12 max-w-3xl mx-auto text-left px-4">
  <h2 class="text-3xl font-semibold mb-6 text-gray-900">Disponibilités</h2>
  <p class="mb-4 text-gray-700">
    Consultez les dates disponibles via le calendrier ci-dessous.<br>
    Les réservations sur Airbnb et Booking sont automatiquement synchronisées.
  </p>
  <div class="overflow-hidden rounded-xl shadow-lg border border-gray-300">
    <div data-tockify-component="calendar" data-tockify-calendar="livablom"></div>
  </div>
</section>

<script data-cfasync="false" data-tockify-script="embed" src="https://public.tockify.com/browser/embed.js"></script>


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

<!-- Appel à l'action -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
  <h3 class="text-2xl font-bold mb-2">Réservez LIVA</h3>
  <p class="mb-4">Logement tout équipé avec parking privé et sécurisé</p>

  <!-- Bloc boutons responsive -->
  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <a href="{{ site.baseurl }}/contact"
       class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </a>

    {% include share.html %}
  </div>
</div>

<script>
let currentIndex = 0;
const fullTestimonials = [
  {% for temoignage in site.data.temoignages-liva %}
    `{{ temoignage.texte | strip_newlines | escape }}`,
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

// Carrousel automatique
const carousel = document.getElementById("carousel");
const totalItems = {{ site.data.temoignages-liva | size }};
let carouselIndex = 0;

function showCarouselSlide(index) {
  const offset = -index * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}

setInterval(() => {
  carouselIndex = (carouselIndex + 1) % totalItems;
  showCarouselSlide(carouselIndex);
}, 4000);
</script>
