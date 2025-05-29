---
layout: default
title: BLŌM – Évasion romantique
permalink: /blom
---

<div class="bg-black text-white min-h-screen px-4">

  <!-- MENU DE NAVIGATION -->
  <nav class="flex justify-center space-x-6 py-6 text-sm font-semibold uppercase tracking-wide">
    <a href="{{ site.baseurl }}/" class="hover:underline">Accueil</a>
    <a href="#galerie" class="hover:underline">Galerie</a>
    <a href="#prestations" class="hover:underline">Prestations</a>
    <a href="#contact" class="hover:underline">Contact</a>
  </nav>

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="text-center py-6">
    <h1 class="text-4xl font-bold mb-6">BLŌM – Évasion romantique</h1>
    <p class="text-lg max-w-xl mx-auto mb-8">
      Un cocon intimiste conçu pour les couples en quête de détente : spa privatif, lit king-size, petit-déjeuner offert et ambiance cocooning.
    </p>

    <!-- PHRASE ACCROCHE HYGIÈNE SPA -->
    <div class="bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-full mb-6 shadow-lg animate-pulse max-w-lg mx-auto">
      Le spa est vidé, désinfecté et rempli pour chaque nouveau client – Vidéo de preuve envoyée le jour de votre arrivée 📹
    </div>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="text-center py-8">
    <h2 class="text-2xl font-bold mb-6">Galerie</h2>

    <!-- Image visible -->
    <a href="{{ site.baseurl }}/assets/images/Spa.jpg" data-lightbox="blom" data-title="Spa BLŌM">
      <img src="{{ site.baseurl }}/assets/images/Spa.jpg" alt="Spa BLŌM" class="h-56 rounded shadow mx-auto" />
    </a>

    <!-- Images masquées pour Lightbox -->
    <div class="hidden">
      <a href="{{ site.baseurl }}/assets/images/femmemur.jpg" data-lightbox="blom" data-title="Déco salon BLŌM"></a>
      <a href="{{ site.baseurl }}/assets/images/sceau.jpg" data-lightbox="blom" data-title="Ambiance romantique"></a>
      <a href="{{ site.baseurl }}/assets/images/table.jpg" data-lightbox="blom" data-title="Table romantique"></a>
    </div>
  </section>

  <!-- SECTION PRESTATIONS -->
  <section id="prestations" class="text-center py-12">
    <h2 class="text-2xl font-bold mb-6">Nos prestations</h2>
    <p class="max-w-xl mx-auto text-lg mb-6">
      BLŌM propose une expérience haut de gamme avec un spa privatif toujours impeccable, une literie king-size, une décoration soignée et un petit-déjeuner maison offert.
    </p>
    <a href="https://www.airbnb.fr/rooms/87654321"
       class="bg-white text-black hover:bg-gray-200 font-semibold py-3 px-6 rounded-full transition mb-8 inline-block">
      Réserver BLŌM
    </a>
    <div class="bg-pink-600 text-white py-4 px-6 rounded-lg shadow-lg max-w-xl mx-auto mt-8">
      ❤️ Offre spéciale : si vous amenez un repas, nous vous dresserons une très jolie table romantique !
    </div>
  </section>

  <!-- SECTION TÉMOIGNAGES -->
  <section class="py-12">
    <h2 class="text-2xl font-bold text-center mb-6">Ce qu’en disent nos visiteurs</h2>
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
  </section>

  <script>
    let index = 0;
    const carousel = document.getElementById('testimonial-carousel');
    const slideCount = carousel.children.length;

    setInterval(() => {
      index = (index + 1) % slideCount;
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }, 7000);
  </script>

  <!-- SECTION CONTACT -->
  <section id="contact" class="text-center py-12">
    <h2 class="text-2xl font-bold mb-4">Contact</h2>
    <p class="text-lg mb-4">Vous avez une question ? Écrivez-nous sur Airbnb via le bouton ci-dessous :</p>
    <a href="https://www.airbnb.fr/rooms/87654321"
       class="bg-white text-black hover:bg-gray-200 font-semibold py-3 px-6 rounded-full transition inline-block">
      Contacter sur Airbnb
    </a>
  </section>

</div>
