---
layout: default
title: BLŌM – Évasion romantique
permalink: /blom
---

<div class="bg-black text-white min-h-screen text-center py-12 px-4">

  <h1 class="text-4xl font-bold mb-6">BLŌM – Évasion romantique</h1>
  <p class="text-lg max-w-xl mx-auto mb-8">
    Un cocon intimiste conçu pour les couples en quête de détente : spa privatif, lit king-size, petit-déjeuner offert et ambiance cocooning.
  </p>

  <!-- PHRASE ACCROCHE HYGIÈNE SPA -->
 <div class="bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-full mb-6 shadow-lg animate-pulse">
    Le spa est vidé  desinfecté et re rempli pour chaque nouveau client – Vidéo de preuve envoyée le jour de votre arrivée 📹
  </div>

  <!-- GALERIE IMAGES -->
  <div class="flex flex-wrap justify-center gap-4 mb-10">
    <a href="{{ site.baseurl }}/assets/images/Spa.jpg" data-lightbox="blom" data-title="Spa BLŌM">
      <img src="{{ site.baseurl }}/assets/images/Spa.jpg" alt="Spa BLŌM" class="h-56 rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/images/femmemur.jpg" data-lightbox="blom" data-title="Déco salon BLŌM">
      <img src="{{ site.baseurl }}/assets/images/femmemur.jpg" alt="Déco mur" class="h-56 rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/images/sceau.jpg" data-lightbox="blom" data-title="Ambiance romantique">
      <img src="{{ site.baseurl }}/assets/images/sceau.jpg" alt="Ambiance romantique" class="h-56 rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/images/table.jpg" data-lightbox="blom" data-title="Table romantique">
      <img src="{{ site.baseurl }}/assets/images/table.jpg" alt="Table romantique" class="h-56 rounded shadow" />
    </a>
  </div>

  <!-- TÉMOIGNAGES -->
  <div class="my-16">
  <h2 class="text-2xl font-bold mb-6">ce qu'en disent nos visiteurs/h2>
  <div class="relative w-full max-w-2xl mx-auto overflow-hidden">
    <div id="testimonial-carousel" class="whitespace-nowrap transition-transform duration-700 ease-in-out">
      <div class="inline-block w-full px-4">
        <p class="text-lg italic mb-2">"Une bulle de douceur. Le spa privatif est un vrai plus !"</p>
        <p class="text-sm text-gray-300">— Laura & Mathieu</p>
      </div>
      <div class="inline-block w-full px-4">
        <p class="text-lg italic mb-2">"Tout était parfait, du lit ultra confortable au petit-déj délicieux."</p>
        <p class="text-sm text-gray-300">— Claire</p>
      </div>
      <div class="inline-block w-full px-4">
        <p class="text-lg italic mb-2">"Propreté irréprochable, ambiance zen, on reviendra."</p>
        <p class="text-sm text-gray-300">— Nicolas & Léa</p>
      </div>
    </div>
  </div>
</div>

<script>
  let index = 0;
  const carousel = document.getElementById('testimonial-carousel');
  const slideCount = carousel.children.length;

  setInterval(() => {
    index = (index + 1) % slideCount;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }, 5000); // Changement toutes les 7 secondes
</script>


  <!-- BOUTON RÉSERVATION -->
  <a href="https://www.airbnb.fr/rooms/87654321"
     class="bg-white text-black hover:bg-gray-200 font-semibold py-3 px-6 rounded-full transition mb-8 inline-block">
    Réserver BLŌM
  </a>

  <!-- BANDEAU SPÉCIAL -->
  <div class="bg-pink-600 text-white py-4 px-6 rounded-lg shadow-lg max-w-xl mx-auto mt-8">
    ❤️ Offre spéciale : une surprise romantique offerte pour toute réservation ce mois-ci !
  </div>

</div>
