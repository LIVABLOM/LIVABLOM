---
layout: default
title: Prestations
permalink: /prestations
---

<section class="bg-black min-h-screen py-16 px-6 w-full">
  <div class="max-w-5xl mx-auto text-center space-y-12">

    <h1 class="text-4xl md:text-5xl font-bold text-yellow-400">Choisissez votre logement</h1>
    <p class="text-gray-300 text-lg max-w-2xl mx-auto">
      Découvrez nos prestations et choisissez le logement qui correspond le mieux à vos envies.
      Que vous cherchiez un séjour romantique ou un hébergement tout confort pour famille ou professionnel, nous avons la solution.
    </p>

    <div class="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">

      <!-- LIVA -->
      <a href="{{ site.baseurl }}/prestations-liva"
         class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition">
        <img src="{{ site.baseurl }}/assets/galerie/liva/salon1.jpg" alt="LIVA" class="w-full h-64 object-cover brightness-75">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="bg-yellow-400 bg-opacity-90 text-black font-bold px-6 py-3 rounded text-xl">
            Prestations LIVA
          </span>
        </div>
      </a>

      <!-- BLŌM -->
      <a href="{{ site.baseurl }}/prestations-blom"
         class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom22.jpg" alt="BLŌM" class="w-full h-64 object-cover brightness-75">
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="bg-yellow-400 bg-opacity-90 text-black font-bold px-6 py-3 rounded text-xl">
            Prestations BLŌM
          </span>
        </div>
      </a>

    </div>
  </div>
</section>
