---
layout: default
title: LIVABLŌM
---

<div class="relative flex flex-col md:flex-row h-screen w-screen overflow-hidden">

  <!-- Titre visible uniquement sur desktop, en haut -->
  <header class="hidden md:block absolute top-0 w-full text-center py-6 bg-black z-20">
    <h1 class="text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-md">LIVABLŌM</h1>
  </header>

  <!-- Partie LIVA -->
  <div class="w-full md:w-1/2 h-1/2 md:h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 text-center text-black" style="background-image: url('{{ site.baseurl }}/assets/images/salon1.jpg');">
    <div class="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-sm">
      <h2 class="text-3xl font-bold mb-4">LIVA – Logement tout confort</h2>
      <p class="mb-6 text-lg font-semibold text-black">
        <strong>Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.</strong>
      </p>
      <a href="{{ site.baseurl }}/liva" class="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">Découvrir LIVA</a>
    </div>
  </div>

  <!-- Titre centré uniquement sur mobile -->
  <div class="block md:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
    <h1 class="text-4xl font-extrabold tracking-wide text-white drop-shadow-md">LIVABLŌM</h1>
  </div>

  <!-- Partie BLŌM -->
  <div class="w-full md:w-1/2 h-1/2 md:h-screen bg-cover bg-center text-white flex flex-col items-center justify-center p-6 text-center" style="background-image: url('{{ site.baseurl }}/assets/images/tableromantique.jpg');">
    <div class="bg-black/70 p-4 rounded-lg">
      <h2 class="text-3xl font-bold mb-4">BLŌM – Évasion romantique</h2>
      <p class="mb-6 text-lg max-w-xs">Conçu pour les couples en quête de détente. Spa privatif, lit king-size, petit-déjeuner inclus.</p>
      <a href="{{ site.baseurl }}/blom" class="bg-white text-black py-2 px-4 rounded hover:bg-gray-200">Découvrir BLŌM</a>
    </div>
  </div>

</div>
