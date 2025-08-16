---
layout: default
title: BLŌM – Spa privatif et hébergement romantique à Guesnain
description: "Offrez-vous une parenthèse romantique à BLŌM : logement de charme, spa privatif, détente et petit‑déjeuner inclus."
image: "/assets/galerie/blom/blom22.jpg"
permalink: /blom/
---

<section class="bg-black text-white py-12 px-4 w-full overflow-x-hidden">
  <div class="max-w-6xl mx-auto space-y-16">

    <h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">BLŌM – Détente & Évasion</h1>

    <p class="text-lg text-center max-w-2xl mx-auto mt-4 animate-fadeIn delay-50">
 Découvrez BLŌM, un refuge romantique où le bien‑être prend tout son sens
· Au rez-de-chaussée, un salon chaleureux invite à la détente, tandis que le spa privatif vous enveloppe dans une atmosphère paisible. Une table élégamment dressée vous attend pour des moments de partage à deux.
· À l’étage, un espace dédié au bien-être : une chambre spacieuse et raffinée, une douche moderne et une salle de massage apaisante. Chaque détail est pensé pour offrir sérénité, volupté et moments intimes.
</p>

    <!-- Bandeau hygiène -->
    <div class="bg-red-600 text-white text-sm px-6 py-3 rounded-full shadow-md text-center max-w-md mx-auto mb-6 animate-pulse">
  Le spa est vidé, désinfecté et rempli pour chaque client – Vidéo envoyée le jour de votre arrivée 📹
</div>

    <!-- Bloc 1 -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-200 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/image-jacuzzi.png" alt="Jacuzzi privatif"
             class="w-full h-auto max-w-full object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Jacuzzi privatif</h2>
        <p>Jacuzzi intérieur à température idéale pour un moment de détente à deux. Ambiance tamisée et intimité garantie.</p>
      </div>
    </div>

    <!-- Bloc 2 -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-300 transition-all">
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <div class="relative w-full rounded-xl overflow-hidden shadow-lg">
          <img src="{{ site.baseurl }}/assets/galerie/blom/blom31.jpg" alt="Table de massage manuelle"
               class="w-full h-auto object-cover filter brightness-75" />
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div class="relative w-full rounded-xl overflow-hidden shadow-lg">
          <img src="{{ site.baseurl }}/assets/galerie/blom/blom37.jpg" alt="Table de massage électrique"
               class="w-full h-auto object-cover filter brightness-75" />
          <div class="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Espace Massage</h2>
        <p>Deux types de massage : manuel à partager en duo, ou table de massage électrique avec 16 programmes et fonction chauffante, parfaite pour un moment de détente en solo ou à deux.</p>
      </div>
    </div>

    <!-- Bloc 3 -->
    <div class="flex flex-col md:flex-row items-center gap-6 md:gap-12 animate-fadeIn delay-400 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom13.jpg" alt="Lit king size et coin salon"
             class="w-full h-auto object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Lit King Size & Salon</h2>
        <p>Un lit spacieux avec coin salon et TV connectée. Idéal pour un séjour romantique dans un cadre cosy.</p>
      </div>
    </div>

    <!-- Bloc 4 -->
    <div class="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 animate-fadeIn delay-500 transition-all">
      <div class="relative w-full md:w-1/2 rounded-xl overflow-hidden shadow-lg">
        <img src="{{ site.baseurl }}/assets/galerie/blom/blom10.jpg" alt="Table romantique dressée"
             class="w-full h-auto object-cover filter brightness-75" />
        <div class="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      <div class="w-full md:w-1/2 text-lg space-y-2">
        <h2 class="text-2xl font-semibold">Table Romantique</h2>
        <p>Vous souhaitez apporter votre dîner ? Une table romantique vous attend, dressée avec soin pour sublimer votre soirée.</p>
      </div>
    </div>

<!-- Bloc témoignages -->
<div class="mt-20">
  <h2 class="text-2xl font-bold text-center mb-6">Ils ont séjourné chez BLŌM</h2>

  <!-- Carrousel -->
  <div class="swiper-container max-w-4xl mx-auto">
    <div class="swiper-wrapper">
      {% for avis in site.data.avis_blom %}
      <div class="swiper-slide">
        <div class="avis-card cursor-pointer" onclick="openModal({{ forloop.index0 }})">
          <p class="italic truncate">“{{ avis.texte | truncate: 80 }}”</p>
          <span class="block mt-2 text-sm text-gray-400">– {{ avis.nom }}</span>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</div>

<!-- Modal témoignages -->
<div id="avisModal" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
  <div class="bg-white text-black max-w-xl p-6 rounded-xl relative">
    <button onclick="closeModal()" class="absolute top-2 right-4 text-2xl font-bold text-gray-600">&times;</button>
    <p id="modalText" class="text-lg leading-relaxed mb-4"></p>
  </div>
</div>

<!-- Swiper CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"/>

<style>
  .swiper-container {
    overflow: visible;
    padding: 20px 0;
  }
  .swiper-slide {
    width: 250px; /* largeur d’un avis */
    margin-right: 20px;
  }
  .avis-card {
    background: #fff;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
</style>

<!-- Swiper JS -->
<script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

<script>
  // Charger les avis depuis _data/avis.yml
  var avis = {{ site.data.avis_blom | jsonify }};

  // Initialisation du carrousel
  var swiper = new Swiper(".swiper-container", {
    slidesPerView: 2.5, // affichage partiel
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 4000,
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      480: { slidesPerView: 1.2 },
    },
  });

  // Modal
  function openModal(index) {
    document.getElementById('modalText').innerText = avis[index].texte;
    document.getElementById('avisModal').classList.remove('hidden');
    document.getElementById('avisModal').classList.add('flex');
  }

  function closeModal() {
    document.getElementById('avisModal').classList.add('hidden');
    document.getElementById('avisModal').classList.remove('flex');
  }

  // Fermer en cliquant à l’extérieur
  window.onclick = function(event) {
    let modal = document.getElementById('avisModal');
    if (event.target == modal) {
      closeModal();
    }
  }
</script>


  <!-- Appel à l'action -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
  <h3 class="text-2xl font-bold mb-2">Réservez votre escapade bien-être</h3>
  <p class="mb-4">Spa privatif, massage et confort apaisant vous attendent</p>

  <!-- Bloc boutons responsive -->
  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <a href="{{ site.baseurl }}/contact"
       class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </a>

    {% include share.html %}
  </div>
</div>

