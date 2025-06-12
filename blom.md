---
layout: default
title: BLŌM
permalink: /blom
---

<h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">BLŌM – Détente & Évasion</h1>

<!-- Bandeau hygiène -->
<div class="bg-red-600 text-white text-sm px-6 py-3 rounded-full shadow-md text-center max-w-md mx-auto mb-6 animate-fadeIn delay-100">
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
  <div class="relative max-w-3xl mx-auto overflow-hidden">
    <div id="carousel" class="flex transition-transform duration-700">
      {% for temoignage in site.data.temoignages %}
      <div class="min-w-full px-4 cursor-pointer" onclick="openModal({{ forloop.index0 }})">
        <div class="flex justify-center mb-2">
          {% for i in (1..5) %}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.201 4.665 24 6 15.596 0 9.748l8.332-1.73z"/>
          </svg>
          {% endfor %}
        </div>
        <p class="italic text-lg truncate text-center">“{{ temoignage.texte | truncate: 100 }}”</p>
        <span class="block mt-2 text-sm text-gray-400 text-center">– {{ temoignage.auteur }}</span>
      </div>
      {% endfor %}
    </div>
  </div>
</div>

<!-- Modal témoignage -->
<div id="testimonialModal" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
  <div class="bg-white text-black max-w-xl p-6 rounded-xl relative">
    <button onclick="closeModal()" class="absolute top-2 right-4 text-2xl font-bold text-gray-600">&times;</button>
    <p id="modalText" class="text-lg leading-relaxed mb-4"></p>
    <div class="flex justify-between mt-4">
      <button onclick="prevTestimonial()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
      <button onclick="nextTestimonial()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
    </div>
  </div>
</div>

<!-- Appel à l'action -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
  <h3 class="text-2xl font-bold mb-2">Réservez votre escapade bien-être</h3>
  <p class="mb-4">Spa privatif, massage et confort haut de gamme vous attendent</p>
  <a href="{{ site.baseurl }}/contact"
     class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition">
    Réserver maintenant
  </a>
</div>
