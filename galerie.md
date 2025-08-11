---
layout: default
title: Galerie
permalink: /galerie
---

<div class="px-4 py-8 bg-white">
  <h2 class="text-2xl font-bold text-center mb-6">Galerie</h2>

  <!-- Filtres -->
  <div class="flex justify-center space-x-4 mb-8">
    <button onclick="filterGallery('all', event)" class="filter-btn px-4 py-2 bg-black text-white rounded">Tous</button>
    <button onclick="filterGallery('liva', event)" class="filter-btn px-4 py-2 bg-gray-700 text-white rounded">LIVA</button>
    <button onclick="filterGallery('blom', event)" class="filter-btn px-4 py-2 bg-gray-700 text-white rounded">BLŌM</button>
  </div>

  <!-- Galerie -->
  <div id="gallery" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {% for i in (1..6) %}
      <img src="{{ site.baseurl }}/assets/galerie/liva/{{ i }}.jpg"
           alt="LIVA {{ i }}"
           class="gallery-item liva w-full h-48 object-cover rounded shadow" />
    {% endfor %}

    {% for i in (1..6) %}
      <img src="{{ site.baseurl }}/assets/galerie/blom/{{ i }}.jpg"
           alt="BLŌM {{ i }}"
           class="gallery-item blom w-full h-48 object-cover rounded shadow" />
    {% endfor %}
  </div>
</div>

<script>
  function filterGallery(category, event) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      if (category === 'all') {
        item.style.display = '';
      } else {
        item.style.display = item.classList.contains(category) ? '' : 'none';
      }
    });

    // Mise à jour des styles des boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('bg-black');
      btn.classList.add('bg-gray-700');
    });
    if (event) {
      event.target.classList.add('bg-black');
      event.target.classList.remove('bg-gray-700');
    }
  }

  // Au chargement, on affiche tout par défaut et active bouton 'Tous'
  document.addEventListener('DOMContentLoaded', () => {
    filterGallery('all');
  });
</script>
