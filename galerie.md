---
layout: default
title: Galerie
permalink: /galerie
---

<section class="p-6 bg-black min-h-screen flex flex-col items-center justify-center text-white">

  <h1 class="text-3xl font-bold mb-12 text-center">Galerie Photos</h1>

  <div class="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl w-full">

    <!-- Bloc LIVA -->
    <a href="{{ site.baseurl }}/galerie-liva" class="block p-6 bg-gray-900 rounded-lg shadow hover:shadow-xl transition duration-300 text-center text-white">
      <h2 class="text-2xl font-semibold mb-4">Galerie LIVA</h2>
      <p class="mb-6">Découvrez toutes les photos du logement LIVA, idéal pour les familles et couples.</p>
      <img src="{{ site.baseurl }}/assets/galerie/liva/1.jpg" alt="Galerie LIVA" class="mx-auto rounded shadow h-48 object-cover w-full max-w-xs" />
      <button class="mt-6 px-6 py-2 bg-white text-black font-bold rounded hover:brightness-110 transition duration-300">
        Voir la galerie
      </button>
    </a>

    <!-- Bloc BLŌM -->
    <a href="{{ site.baseurl }}/galerie-blom" class="block p-6 bg-gray-900 rounded-lg shadow hover:shadow-xl transition duration-300 text-center text-white">
      <h2 class="text-2xl font-semibold mb-4">Galerie BLŌM</h2>
      <p class="mb-6">Découvrez toutes les photos du logement BLŌM, parfait pour un séjour spa et détente en couple.</p>
      <img src="{{ site.baseurl }}/assets/galerie/blom/1.jpg" alt="Galerie BLŌM" class="mx-auto rounded shadow h-48 object-cover w-full max-w-xs" />
      <button class="mt-6 px-6 py-2 bg-white text-black font-bold rounded hover:brightness-110 transition duration-300">
        Voir la galerie
      </button>
    </a>

  </div>
</section>
