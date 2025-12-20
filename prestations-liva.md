---
layout: default
title: Prestations LIVA
permalink: /prestations-liva
---

<section class="bg-black text-white py-12 px-4 w-full overflow-x-hidden">
  <div class="max-w-6xl mx-auto space-y-16">

    <!-- TITRE -->
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">LIVA – Confort & Évasion</h1>
    <p class="text-lg text-center max-w-2xl mx-auto mt-4 animate-fadeIn delay-50">
      LIVA est un logement spacieux de 68 m², idéal pour les couples, familles ou professionnels en déplacement.
      Profitez d’un séjour tout confort avec lit king size, salon cosy avec TV, cuisine équipée, machine à laver et wifi fibre gratuit.
      L’arrivée et le départ se font en toute autonomie.
    </p>

    <!-- Bloc Confort & Équipements -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-150">
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <ul class="list-disc list-inside space-y-2 text-lg">
          <li>Logement tout équipé de 68 m²</li>
          <li>Literie ultra confortable</li>
          <li>Salon avec grand TV </li>
          <li>Wifi fibre gratuit</li>
          <li>Cuisine équipée (micro-ondes, frigo, plaque, etc.)</li>
          <li>Machine à laver et sèche-cheveux</li>
          <li>Arrivée et départ en toute autonomie</li>
        </ul>
      </div>
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/images/salon1.jpg" alt="Séjour LIVA" class="w-full h-auto object-cover brightness-75">
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
    </div>

    <!-- Bloc Tarifs -->
    <div class="flex flex-col items-center bg-gray-900 text-white py-12 px-6 rounded-xl shadow-lg space-y-4 animate-fadeIn delay-200">
      <h2 class="text-3xl font-bold text-center">Tarifs & Formules</h2>
      <p class="text-center max-w-2xl text-lg">
        LIVA propose des tarifs flexibles selon la durée du séjour et le nombre de personnes. Idéal pour des courts séjours ou des séjours prolongés.
      </p>
      <ul class="text-lg space-y-1 text-center list-disc list-inside">
        <li>À partir de 79 €/nuit pour 2 personnes</li>
        <li>Tarifs ajustables selon la durée et le nombre de personnes</li>
      </ul>
      <a href="{{ '/contact' | relative_url }}" class="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-red-700 transition mt-4">
        Voir les disponibilités & réserver
      </a>
    </div>

    <!-- Bloc Accès -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-300">
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <h2 class="text-2xl font-semibold">Accès & Localisation</h2>
        <p>LIVA est situé à Guesnain, à 10 minutes de Douai et 30 minutes de Lille. Parking gratuit et sécurisé disponible. 
        Idéal pour les professionnels ou les familles en déplacement.</p>
      </div>
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/liva/liva2.jpg" alt="Accès LIVA" class="w-full h-auto object-cover brightness-75">
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
    </div>

    <!-- Bloc CTA final -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-400">
  <h3 class="text-2xl font-bold mb-2">Réservez LIVA</h3>
  <p class="mb-4">Logement tout équipé pour couples, familles ou professionnels</p>

  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <a href="/assets/html/liva-calendar.html" 
       class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </a>
    <a href="{{ '/contact' | relative_url }}" 
       class="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold shadow hover:bg-yellow-300 transition text-center">
      Nous contacter
    </a>
    {% include share.html %}
  </div>
</div>

