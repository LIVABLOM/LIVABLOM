---
layout: default
title: BLŌM – Spa et bien-être
permalink: /blom
---

<div class="bg-black text-white min-h-screen px-4 text-center">

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="py-6">
    <h1 class="text-4xl font-bold mb-4">BLŌM – Spa et bien-être</h1>
    <p class="text-lg max-w-xl mx-auto mb-6">
      <strong>
        Une escapade idéale pour les couples. Spa privatif, ambiance zen, confort haut de gamme.
      </strong>
    </p>

    <!-- PHRASE ACCROCHE HYGIÈNE SPA -->
    <div class="bg-red-600 text-white font-semibold text-sm px-6 py-3 rounded-full mb-6 shadow-lg animate-pulse max-w-lg mx-auto">
      Le spa est vidé, désinfecté et rempli pour chaque nouveau client – Vidéo de preuve envoyée le jour de votre arrivée 📹
    </div>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="py-8">
    <h2 class="text-2xl font-bold mb-6">Galerie</h2>
    <div class="flex justify-center">
      <a href="{{ site.baseurl }}/assets/images/Spa.jpg" data-lightbox="blom" data-title="Spa BLŌM">
        <img src="{{ site.baseurl }}/assets/images/Spa.jpg" alt="Spa BLŌM" class="h-64 md:h-[28rem] w-auto max-w-full rounded shadow" />

      </a>
      <!-- Images masquées -->
      <a href="{{ site.baseurl }}/assets/images/femmemur.jpg" data-lightbox="blom" data-title="Salle de bain" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/sceau.jpg" data-lightbox="blom" data-title="Lit king size" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/tableromantique.jpg" data-lightbox="blom" data-title="Espace salon" style="display: none;"></a>
    </div>
  </section>

  <!-- SECTION PRESTATIONS -->
  <section id="prestations" class="py-12">
    <h2 class="text-2xl font-bold mb-6">Nos prestations</h2>
    <p class="max-w-xl mx-auto text-lg mb-6">
      BLŌM vous propose une expérience bien-être inoubliable : spa privatif, chambre avec lit king size, salle de massage, ambiance zen, salon TV et petit déjeuner inclus.
    </p>
    <div class="text-left max-w-md mx-auto mb-6">
      <ul class="list-disc list-inside space-y-2 text-white">
        <li><strong>Vendredi & samedi :</strong> 169 € / nuit</li>
        <li><strong>Dimanche :</strong> 190 € / nuit</li>
        <li><strong>Lundi au jeudi :</strong> 150 € / nuit</li>
        <li><strong>Formule journée (11h–16h) :</strong> 130 € <br><span class="text-sm text-gray-400">Sur demande, après validation</span></li>
        <li><strong>Formule 4h :</strong> sur demande personnalisée</li>
      </ul>
    </div>
    <a href="{{ site.baseurl }}/contact"
       class="bg-white text-black hover:bg-gray-300 font-semibold py-3 px-6 rounded-full transition inline-block">
      Réserver BLŌM
    </a>
  </section>

  <!-- AVIS CLIENTS -->
  <section class="py-12">
    <h2 class="text-2xl font-bold mb-6">Ce qu’en disent nos visiteurs</h2>
    <div class="relative w-full max-w-2xl mx-auto overflow-hidden">
      <div id="testimonial-carousel-blom" class="whitespace-nowrap transition-transform duration-700 ease-in-out">
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"Un week-end magique, tout était parfait."</p>
          <p class="text-sm text-gray-400">— Amélie & Kevin</p>
        </div>
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"L’espace spa est incroyable, très reposant."</p>
          <p class="text-sm text-gray-400">— Claire</p>
        </div>
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"Nous reviendrons, merci pour l’accueil !"</p>
          <p class="text-sm text-gray-400">— Romain</p>
        </div>
      </div>
    </div>
  </section>

  <script>
    let indexBlom = 0;
    const carouselBlom = document.getElementById('testimonial-carousel-blom');
    const slideCountBlom = carouselBlom.children.length;

    setInterval(() => {
      indexBlom = (indexBlom + 1) % slideCountBlom;
      carouselBlom.style.transform = `translateX(-${indexBlom * 100}%)`;
    }, 5000);
  </script>

</div>
