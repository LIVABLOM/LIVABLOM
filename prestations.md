---
layout: default
title: Prestations
permalink: /prestations
---

<section class="bg-black text-white min-h-screen py-12 px-6 w-full">
  <div class="max-w-6xl mx-auto">

    <!-- TITRE -->
    <h2 class="text-3xl font-bold mb-8 text-center">Choisissez votre logement</h2>

    <p class="text-lg text-center mb-12">
      Découvrez nos prestations et choisissez le logement qui vous correspond :
    </p>

    <!-- Vignettes LIVA & BLŌM -->
    <div class="flex flex-col md:flex-row justify-center items-center gap-8">
      
      <!-- LIVA -->
      <div class="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition w-64">
        <img src="{{ site.baseurl }}/assets/galerie/liva/salon1.jpg" alt="LIVA" class="w-full h-40 object-cover">
        <div class="p-4 text-center">
          <h3 class="text-xl font-semibold mb-2 text-white">LIVA</h3>
          <a href="{{ site.baseurl }}/prestations-liva" 
             class="inline-block bg-white text-black font-semibold px-4 py-2 rounded shadow hover:brightness-110 transition">
            Voir les prestations
          </a>
        </div>
      </div>

      <!-- BLŌM -->
      <div class="bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition w-64">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom22.jpg" alt="BLŌM" class="w-full h-40 object-cover">
        <div class="p-4 text-center">
          <h3 class="text-xl font-semibold mb-2 text-white">BLŌM</h3>
          <a href="{{ site.baseurl }}/prestations-blom" 
             class="inline-block bg-white text-black font-semibold px-4 py-2 rounded shadow hover:brightness-110 transition">
            Voir les prestations
          </a>
        </div>
      </div>

    </div>

  </div>
</section>
