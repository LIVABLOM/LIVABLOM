---
layout: default
title: LIVA – Logement tout confort
permalink: /liva
---

<div class="bg-gray-100 min-h-screen px-4 text-black">

  <!-- MENU DE NAVIGATION -->
  <nav class="flex justify-center space-x-6 py-6 text-sm font-semibold uppercase tracking-wide">
    <a href="{{ site.baseurl }}/" class="hover:underline">Accueil</a>
    <a href="#galerie" class="hover:underline">Galerie</a>
    <a href="#prestations" class="hover:underline">Prestations</a>
    <a href="#contact" class="hover:underline">Contact</a>
  </nav>

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="text-center py-6">
    <h1 class="text-4xl font-bold mb-6">LIVA – Logement tout confort</h1>
    <p class="text-lg max-w-xl mx-auto mb-8">
      Pour familles, couples ou professionnels : un logement spacieux, cuisine équipée, ambiance moderne et pratique.
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="text-center py-8">
    <h2 class="text-2xl font-bold mb-6">Galerie</h2>
    <div class="flex flex-wrap justify-center gap-4">
      <a href="{{ site.baseurl }}/assets/images/salon1.jpg" data-lightbox="liva" data-title="Salon LIVA">
        <img src="{{ site.baseurl }}/assets/images/salon1.jpg" alt="Salon LIVA" class="h-56 rounded shadow" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/Liva.jpg" data-lightbox="liva" data-title="Pièce de vie LIVA">
        <img src="{{ site.baseurl }}/assets/images/Liva.jpg" alt="Pièce de vie LIVA" class="h-56 rounded shadow" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/chaise.jpg" data-lightbox="liva" data-title="Détail salon LIVA">
        <img src="{{ site.baseurl }}/assets/images/chaise.jpg" alt="Chaise LIVA" class="h-56 rounded shadow" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/espacerepas.jpg" data-lightbox="liva" data-title="Espace repas">
        <img src="{{ site.baseurl }}/assets/images/espacerepas.jpg" alt="Espace repas" class="h-56 rounded shadow" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/the.jpg" data-lightbox="liva" data-title="Moment détente LIVA">
        <img src="{{ site.baseurl }}/assets/images/the.jpg" alt="Thé LIVA" class="h-56 rounded shadow" />
      </a>
    </div>
  </section>

  <!-- SECTION PRESTATIONS -->
  <section id="prestations" class="text-center py-12">
    <h2 class="text-2xl font-bold mb-6">Nos prestations</h2>
    <p class="max-w-xl mx-auto text-lg mb-6">
      LIVA vous propose un espace lumineux et moderne avec une literie confortable, une cuisine entièrement équipée, un salon TV et une salle de bain soignée.
    </p>
    <a href="https://www.airbnb.fr/rooms/41095534?guests=1&adults=2&s=67&unique_share_id=e0082f3f-afbb-4a7f-8e36-141205d4c373"
       class="bg-black text-white hover:bg-gray-800 font-semibold py-3 px-6 rounded-full transition inline-block mb-8">
      Réserver LIVA
    </a>
    <div class="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg max-w-xl mx-auto mt-8">
      💼 Offre spéciale : profitez d’un bureau avec wifi haut débit pour télétravailler dans les meilleures conditions.
    </div>
  </section>

  <!-- SECTION TÉMOIGNAGES -->
  <section class="py-12">
    <h2 class="text-2xl font-bold text-center mb-6">Ce qu’en disent nos visiteurs</h2>
    <div class="relative w-full max-w-2xl mx-auto overflow-hidden">
      <div id="testimonial-carousel-liva" class="whitespace-nowrap transition-transform duration-700 ease-in-out">
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"Très bien situé, calme et parfaitement équipé."</p>
          <p class="text-sm text-gray-700">— Julien</p>
        </div>
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"Propre, moderne, idéal pour notre séjour professionnel."</p>
          <p class="text-sm text-gray-700">— Marion & Thierry</p>
        </div>
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"L’appartement est spacieux, tout était conforme à l’annonce."</p>
          <p class="text-sm text-gray-700">— Élise</p>
        </div>
      </div>
    </div>
  </section>

  <script>
    let indexLiva = 0;
    const carouselLiva = document.getElementById('testimonial-carousel-liva');
    const slideCountLiva = carouselLiva.children.length;

    setInterval(() => {
      indexLiva = (indexLiva + 1) % slideCountLiva;
      carouselLiva.style.transform = `translateX(-${indexLiva * 100}%)`;
    }, 7000);
  </script>

  <!-- SECTION CONTACT -->
  <section id="contact" class="text-center py-12">
    <h2 class="text-2xl font-bold mb-4">Contact</h2>
    <p class="text-lg mb-4">Des questions ? Contactez-nous sur Airbnb :</p>
    <a href="https://www.airbnb.fr/rooms/41095534?guests=1&adults=2&s=67&unique_share_id=e0082f3f-afbb-4a7f-8e36-141205d4c373"
       class="bg-black text-white hover:bg-gray-800 font-semibold py-3 px-6 rounded-full transition inline-block">
      Contacter sur Airbnb
    </a>
  </section>

</div>
