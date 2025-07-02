---
layout: default
title: LIVA – Logement tout confort
permalink: /liva
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
      Tarif unique : <span class="font-bold text-blue-600">75 € par nuit</span>
    </p>
    <p class="mt-3 italic text-sm text-gray-600">
      Tarifs dégressifs possibles pour les séjours longs. Contactez-nous pour plus d'informations.
    </p>
  </section>

  <!-- BOUTON RÉSERVER -->
  <div class="mb-12">
    <a href="{{ site.baseurl }}/contact"
       class="bg-blue-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-blue-700 transition inline-block shadow-lg">
      Réserver LIVA
    </a>
  </div>

  <!-- AVIS CLIENTS -->
  <section class="mb-12 max-w-3xl mx-auto text-left px-4">
    <h2 class="text-3xl font-semibold mb-6 text-gray-900">Ce qu’en disent nos visiteurs</h2>
    <div class="relative overflow-hidden rounded-lg shadow-md">
      <div id="carousel-liva" class="flex transition-transform duration-700">
        <div class="min-w-full px-6 py-8 cursor-pointer bg-white" onclick="openModalLiva(0)">
          <p class="italic text-lg text-gray-700 truncate">"Très bien situé, calme et parfaitement équipé."</p>
          <p class="text-sm text-gray-500 mt-2">— Julien</p>
        </div>
        <div class="min-w-full px-6 py-8 cursor-pointer bg-white" onclick="openModalLiva(1)">
          <p class="italic text-lg text-gray-700 truncate">"Propre, moderne, idéal pour notre séjour professionnel."</p>
          <p class="text-sm text-gray-500 mt-2">— Marion & Thierry</p>
        </div>
        <div class="min-w-full px-6 py-8 cursor-pointer bg-white" onclick="openModalLiva(2)">
          <p class="italic text-lg text-gray-700 truncate">"L’appartement est spacieux, tout était conforme à l’annonce."</p>
          <p class="text-sm text-gray-500 mt-2">— Élise</p>
        </div>
      </div>
    </div>
  </section>

  <!-- MODALE AVIS -->
  <div id="testimonialModalLiva" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
    <div class="bg-white text-black max-w-xl p-6 rounded-xl relative shadow-lg">
      <button onclick="closeModalLiva()" class="absolute top-2 right-4 text-3xl font-bold text-gray-600 hover:text-gray-900">&times;</button>
      <p id="modalTextLiva" class="text-lg leading-relaxed mb-4 text-gray-800"></p>
      <div class="flex justify-between mt-4">
        <button onclick="prevTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
        <button onclick="nextTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
      </div>
    </div>
  </div>

</div>

<script>
  let indexLiva = 0;
  const carouselLiva = document.getElementById('carousel-liva');
  const slideCountLiva = carouselLiva.children.length;

  setInterval(() => {
    indexLiva = (indexLiva + 1) % slideCountLiva;
    carouselLiva.style.transform = `translateX(-${indexLiva * 100}%)`;
  }, 4000);

  const fullTestimonialsLiva = [
    `Très bien situé, calme et parfaitement équipé.`,
    `Propre, moderne, idéal pour notre séjour professionnel.`,
    `L’appartement est spacieux, tout était conforme à l’annonce.`
  ];

  let currentLiva = 0;

  function openModalLiva(i) {
    currentLiva = i;
    updateModalTextLiva();
    const modal = document.getElementById("testimonialModalLiva");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeModalLiva() {
    const modal = document.getElementById("testimonialModalLiva");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  function updateModalTextLiva() {
    document.getElementById("modalTextLiva").innerText = fullTestimonialsLiva[currentLiva];
  }

  function prevTestimonialLiva() {
    currentLiva = (currentLiva - 1 + fullTestimonialsLiva.length) % fullTestimonialsLiva.length;
    updateModalTextLiva();
  }

  function nextTestimonialLiva() {
    currentLiva = (currentLiva + 1) % fullTestimonialsLiva.length;
    updateModalTextLiva();
  }
</script>
