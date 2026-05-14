---
layout: default
title: BLŌM – Suite avec spa privatif à Guesnain
description: "BLŌM : suite romantique avec spa privatif, lit king-size et petit-déjeuner inclus. Expérience bien-être à Guesnain."
image: /assets/galerie/blom/blom.jpeg
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
    height: 75dvh;
    background-size: cover;
    background-position: center 25%;
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
       style="background-image:url('{{ site.baseurl }}/assets/galerie/blom/blom.jpeg');">

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- Contenu -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 max-w-2xl mx-auto">

      <h1 class="text-5xl md:text-7xl font-bold tracking-[0.2em] mb-6">
        BLŌM
      </h1>

      <p class="text-xl md:text-2xl mb-4 font-light">
        Suite avec spa privatif à Guesnain
      </p>

      <p class="text-base md:text-lg text-gray-200 mb-10 leading-relaxed max-w-xl mx-auto">
        Une expérience romantique, intime et relaxante pensée uniquement pour deux.
      </p>

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
      Profitez d’un espace entièrement privatif conçu pour le bien-être, la détente et les moments à deux.
    </p>

    <div class="grid md:grid-cols-3 gap-8">

      <div class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
        <h3 class="text-2xl font-semibold mb-4">Spa privatif</h3>
        <p class="text-gray-300 leading-relaxed">
          Un espace bien-être accessible en toute intimité pour un moment de relaxation absolue.
        </p>
      </div>

      <div class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
        <h3 class="text-2xl font-semibold mb-4">Ambiance romantique</h3>
        <p class="text-gray-300 leading-relaxed">
          Lumières tamisées, décoration soignée et atmosphère chaleureuse.
        </p>
      </div>

      <div class="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
        <h3 class="text-2xl font-semibold mb-4">Confort premium</h3>
        <p class="text-gray-300 leading-relaxed">
          Lit king-size, arrivée autonome et équipements pensés pour votre confort.
        </p>
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

 <a href="{{ site.baseurl }}/contact"
   class="bg-white text-black px-10 py-5 rounded-xl font-semibold hover:bg-gray-200 transition duration-300 shadow-xl inline-block hidden md:inline-block">
  Réserver maintenant
</a>

</section>

<!-- BOUTON MOBILE FIXE -->
<div class="floating-book-btn md:hidden">
  <a href="{{ site.baseurl }}/contact"
     class="block text-center bg-white text-black py-4 rounded-2xl font-bold shadow-2xl">
    Réserver maintenant
  </a>
</div>
