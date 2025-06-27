---
layout: default
title: LIVA – Logement tout confort
permalink: /liva
---

<div class="bg-gray-100 min-h-screen px-4 text-center">

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="py-6">
    <h1 class="text-4xl font-bold mb-4">LIVA – Logement tout confort</h1>
    <p class="text-lg max-w-xl mx-auto mb-6">
      <strong class="text-black">
        Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.
      </strong>
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="py-8">
    <h2 class="text-2xl font-bold mb-6">Galerie</h2>
    <div class="flex justify-center">
      <a href="{{ site.baseurl }}/assets/images/salon1.jpg" data-lightbox="liva" data-title="Salon LIVA">
        <img src="{{ site.baseurl }}/assets/images/salon1.jpg" alt="Salon LIVA" class="h-48 rounded shadow" />
      </a>
      <!-- Images masquées -->
      <a href="{{ site.baseurl }}/assets/images/Liva.jpg" data-lightbox="liva" data-title="Salon LIVA" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/chaise.jpg" data-lightbox="liva" data-title="Salon LIVA" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/espacerepas.jpg" data-lightbox="liva" data-title="Coin repas LIVA" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/the.jpg" data-lightbox="liva" data-title="Table LIVA" style="display: none;"></a>
    </div>
  </section>

  <!-- BOUTON RÉSERVER -->
  <a href="{{ site.baseurl }}/contact"
     class="bg-white text-black hover:bg-gray-300 font-semibold py-3 px-6 rounded-full transition inline-block">
    Réserver LIVA
  </a>

  <!-- AVIS CLIENTS -->
  <section class="py-12">
    <h2 class="text-2xl font-bold mb-6">Ce qu’en disent nos visiteurs</h2>
    <div class="relative w-full max-w-2xl mx-auto overflow-hidden">
      <div id="carousel-liva" class="flex transition-transform duration-700">
        <div class="min-w-full px-4 cursor-pointer" onclick="openModalLiva(0)">
          <p class="italic text-lg truncate">"Très bien situé, calme et parfaitement équipé."</p>
          <p class="text-sm text-gray-600 mt-2">— Julien</p>
        </div>
        <div class="min-w-full px-4 cursor-pointer" onclick="openModalLiva(1)">
          <p class="italic text-lg truncate">"Propre, moderne, idéal pour notre séjour professionnel."</p>
          <p class="text-sm text-gray-600 mt-2">— Marion & Thierry</p>
        </div>
        <div class="min-w-full px-4 cursor-pointer" onclick="openModalLiva(2)">
          <p class="italic text-lg truncate">"L’appartement est spacieux, tout était conforme à l’annonce."</p>
          <p class="text-sm text-gray-600 mt-2">— Élise</p>
        </div>
      </div>
    </div>
  </section>

  <!-- MODALE AVIS -->
  <div id="testimonialModalLiva" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
    <div class="bg-white text-black max-w-xl p-6 rounded-xl relative">
      <button onclick="closeModalLiva()" class="absolute top-2 right-4 text-2xl font-bold text-gray-600">&times;</button>
      <p id="modalTextLiva" class="text-lg leading-relaxed mb-4"></p>
      <div class="flex justify-between mt-4">
        <button onclick="prevTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
        <button onclick="nextTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
      </div>
    </div>
  </div>

  <!-- SCRIPTS -->
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

</div>
