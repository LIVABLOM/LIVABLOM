---
layout: default
title: BLŌM – Suite romantique avec spa privatif près de Douai
description: "BLŌM : suite romantique et spa privatif près de Douai. Nuitée avec lit king-size ou formule sans nuitée de 3 heures à 109 € pour deux à Guesnain."
image: /assets/galerie/blom/spa-ciel-peignoir.png
permalink: /
---

<style>
 .hero-blom {
  height: calc(100vh - 80px);
  background-size: cover;
  background-position: center top;
  animation: zoomHero 18s ease-in-out infinite alternate;
}

/* DESKTOP animation */
@keyframes zoomHero {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

/* MOBILE FIX GLOBAL */
@media (max-width: 767px) {
  .hero-blom {
    height: 100dvh;
    background-size: cover;
    background-position: center 20%;
    background-repeat: no-repeat;
    background-color: black;
  }
}

/* FLOATING BUTTON */
.floating-book-btn {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  width: calc(100% - 32px);
  max-width: 400px;
}

@media (min-width: 768px) {
  .floating-book-btn {
    display: none;
  }
}

@media (max-width: 767px) and (orientation: portrait) {
  .hero-blom {
    height: 78dvh;
    background-size: cover;
    background-position: center 30%;
  }
}

@media (max-width: 767px) and (orientation: landscape) {
  .hero-blom {
    height: 100dvh;
    background-size: cover;
    background-position: center 15%;
  }
}

</style>

<!-- HERO -->
<div class="relative overflow-hidden bg-black">

  <!-- Image de fond -->
  <div class="hero-blom flex items-start justify-center pt-24 text-white"
       style="background-image:url('{{ site.baseurl }}/assets/galerie/blom/spa-ciel-peignoir.png');">

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Contenu -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-2xl mx-auto">

      <h1 class="text-5xl md:text-7xl font-bold tracking-[0.2em] mb-6">
        BLŌM
      </h1>

      <p class="text-xl md:text-2xl mb-4 font-light">
        Suite romantique avec spa privatif près de Douai
      </p>

      <p class="text-base md:text-lg text-gray-200 mb-10 leading-relaxed max-w-xl mx-auto">
        Offrez-vous une parenthèse romantique avec spa privatif, massage et petit-déjeuner inclus.
      </p>

<a href="{{ site.baseurl }}/blom/"
   class="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition duration-300 shadow-xl inline-block mt-4">
  Découvrir la suite BLŌM
</a>

  </div>

  </div>
</div>

<!-- SECTION EXPERIENCE -->
<section class="bg-black text-white py-20 px-6">

  <div class="max-w-6xl mx-auto text-center">

    <h2 class="text-3xl md:text-5xl font-bold mb-6">
      Une nuit hors du temps
    </h2>

    <p class="text-gray-300 max-w-2xl mx-auto mb-16 text-lg">
      Profitez d’un espace entièrement privatif conçu pour le bien-être,
      la détente et les moments à deux.
    </p>

    <div class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
      <h3 class="text-2xl font-semibold mb-4">
        Spa privatif – eau neuve à chaque séjour
      </h3>

      <p class="text-gray-300 leading-relaxed mb-5">
        Après chaque départ, le spa est entièrement vidé, nettoyé et désinfecté,
        puis rempli d’eau neuve pour votre arrivée.
      </p>

      <p class="text-gray-200 font-medium mb-5">
        Une vidéo de sa préparation vous est envoyée le jour de votre arrivée.
      </p>

      <a href="{{ site.baseurl }}/hygiene-spa-blom/"
         class="text-white underline underline-offset-4 hover:text-gray-300 transition">
        Découvrir notre protocole d’hygiène →
      </a>
    </div>

    <div class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
      <h3 class="text-2xl font-semibold mb-4">
        Ambiance romantique
      </h3>

      <p class="text-gray-300 leading-relaxed">
        Lumières tamisées, décoration soignée et atmosphère chaleureuse.
      </p>
    </div>

    <div class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
      <h3 class="text-2xl font-semibold mb-4">
        Confort premium
      </h3>

      <p class="text-gray-300 leading-relaxed">
        Lit king-size, arrivée autonome et équipements pensés pour votre confort.
      </p>
    </div>

  </div>

</section>

<!-- OFFRE SPA SANS NUITÉE -->
<section class="bg-black text-white py-20 px-6 border-t border-white/10">

  <div class="max-w-5xl mx-auto">

    <div class="grid md:grid-cols-2 gap-10 items-center">

      <!-- Colonne de gauche -->
      <div>

        <h2 class="text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Spa privatif pendant 3 heures près de Douai
        </h2>

        <p class="text-gray-300 text-lg leading-relaxed mb-6">
          Privatisez BLŌM pour deux personnes et profitez du jacuzzi intérieur
          72 jets, du salon, de la table romantique et de la salle de massage
          en autonomie, sans réserver de nuitée.
        </p>

        <p class="text-2xl font-bold mb-2">
          3 heures – 109 € pour deux
        </p>

        <p class="text-gray-400 mb-8">
          Sur réservation et selon les créneaux disponibles.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">

          <a href="{{ site.baseurl }}/prestations-blom"
             class="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-200 transition duration-300 text-center">
            Découvrir l’offre 3 heures
          </a>

          <a href="{{ site.baseurl }}/contact"
             class="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-black transition duration-300 text-center">
            Demander un créneau
          </a>

        </div>

      </div>

      <!-- Colonne de droite -->
      <div class="bg-white/5 border border-white/10 rounded-2xl p-8">

        <h3 class="text-2xl font-semibold mb-6">
          Votre parenthèse privative comprend
        </h3>

        <ul class="space-y-4 text-gray-300">
          <li>✓ Jacuzzi intérieur privatif 72 jets</li>
          <li>✓ Eau entièrement renouvelée avant votre arrivée</li>
          <li>✓ Salon et table romantique</li>
          <li>✓ Salle de massage en autonomie, sans praticien</li>
          <li>✓ Espace entièrement réservé à deux personnes</li>
        </ul>

      </div>

    </div>

  </div>

</section>

<!-- CTA FINAL -->
<section class="bg-black text-white py-24 px-6 text-center border-t border-white/10">

  <h2 class="text-4xl md:text-5xl font-bold mb-6">
    Laissez le quotidien à la porte
  </h2>

  <p class="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
    Réservez votre moment BLŌM et profitez d’une expérience unique à deux.
  </p>

  <div class="flex flex-col md:flex-row gap-4 justify-center items-center">

    <!-- Découvrir BLŌM -->
    <a href="{{ site.baseurl }}/blom/"
       class="bg-white text-black px-10 py-5 rounded-xl font-semibold hover:bg-gray-200 transition duration-300 shadow-xl inline-block">
      Découvrir BLŌM
    </a>

    <!-- Réserver -->
    <a href="{{ site.baseurl }}/contact"
       class="border border-white text-white px-10 py-5 rounded-xl hover:bg-white hover:text-black transition duration-300 inline-block hidden md:inline-block">
      Réserver maintenant
    </a>

  </div>



<!-- BOUTON MOBILE FIXE -->
<div class="floating-book-btn md:hidden">
  <a href="{{ site.baseurl }}/contact"
     class="block text-center bg-white text-black py-4 rounded-2xl font-bold shadow-2xl">
    Réserver maintenant
  </a>
</div>
</section>
