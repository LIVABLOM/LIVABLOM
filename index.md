---
layout: default
title: LIVABLŌM
---

<!-- Contenu principal pleine hauteur (moins header) -->
<div class="flex flex-col md:flex-row w-screen overflow-hidden" style="height: calc(100vh - 80px);">

  <!-- Partie LIVA -->
  <div class="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center flex flex-col items-center justify-center p-6 text-center text-black" style="background-image: url('{{ site.baseurl }}/assets/images/salon1.jpg');">
    <div class="bg-white/80 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-sm">
      <h2 class="text-3xl font-bold mb-4">LIVA – Logement tout confort</h2>
      <p class="mb-6 text-lg font-semibold text-black">
        <strong>Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.</strong>
      </p>
      <a href="{{ site.baseurl }}/liva" class="bg-black text-white py-2 px-4 rounded hover:bg-gray-800">Découvrir LIVA</a>
    </div>
  </div>

  <!-- Partie BLŌM -->
  <div class="w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center text-white flex flex-col items-center justify-center p-6 text-center" style="background-image: url('{{ site.baseurl }}/assets/images/tableromantique.jpg');">
    <div class="bg-black/70 p-4 rounded-lg">
      <h2 class="text-3xl font-bold mb-4">BLŌM – Évasion romantique</h2>
      <p class="mb-6 text-lg max-w-xs">Conçu pour les couples en quête de détente. Spa privatif, lit king-size, petit-déjeuner inclus.</p>
      <a href="{{ site.baseurl }}/blom" class="bg-white text-black py-2 px-4 rounded hover:bg-gray-200">Découvrir BLŌM</a>
    </div>
  </div>

</div>
