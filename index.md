---
layout: default
title: LIVABLŌM
---

<div class="relative flex h-screen w-screen overflow-hidden">

  <!-- Partie LIVA -->
  <div class="w-1/2 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
    <h2 class="text-3xl font-bold mb-4">LIVA – Logement tout confort</h2>
    <p class="mb-6 text-lg max-w-xs">Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.</p>
    <a href="{{ site.baseurl }}/liva" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition">Découvrir LIVA</a>
  </div>

  <!-- Centre logo + nom -->
  <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
    <img src="{{ site.baseurl }}/assets/images/lotus.jpg" alt="Logo Lotus" class="mx-auto w-24 h-24 mb-2">

    <h1 class="text-4xl font-extrabold tracking-wide">
      <span class="text-black">LIVA</span><span class="text-white">BLŌM</span>
    </h1>
  </div>

  <!-- Partie BLŌM -->
  <div class="w-1/2 bg-black text-white flex flex-col items-center justify-center p-6 text-center">
    <h2 class="text-3xl font-bold mb-4">BLŌM – Évasion romantique</h2>
    <p class="mb-6 text-lg max-w-xs">Conçu pour les couples en quête de détente. Spa privatif, lit king-size, petit-déjeuner inclus.</p>
    <a href="{{ site.baseurl }}/blom" class="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full transition">Découvrir BLŌM</a>
  </div>

</div>

<style>
@media (max-width: 768px) {
  .flex {
    flex-direction: column;
  }
  .w-1/2 {
    width: 100%;
  }
  .absolute {
    position: static;
    transform: none;
    margin: 2rem 0;
  }
}
</style>
