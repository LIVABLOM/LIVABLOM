---
layout: default
title: Galerie
permalink: /galerie
---

<div class="bg-black text-white min-h-screen px-4 py-8 text-center">

  <h1 class="text-3xl font-bold mb-6">Galerie LIVABLŌM</h1>

  <!-- BOUTONS DE FILTRE -->
  <div class="flex justify-center space-x-4 mb-8">
    <button onclick="filterGallery('all')" class="filter-btn bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300">Tous</button>
    <button onclick="filterGallery('liva')" class="filter-btn bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300">LIVA</button>
    <button onclick="filterGallery('blom')" class="filter-btn bg-white text-black px-4 py-2 rounded-full hover:bg-gray-300">BLŌM</button>
  </div>

  <!-- GALERIE -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="gallery">
    <!-- LIVA -->
    <a href="{{ site.baseurl }}/assets/galerie/liva/salon1.jpg" data-lightbox="galerie" data-title="Salon LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon1.jpg" alt="Salon LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/salon2.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon2.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/salon3.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon3.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
     <a href="{{ site.baseurl }}/assets/galerie/liva/salon4.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon4.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
     <a href="{{ site.baseurl }}/assets/galerie/liva/salon5.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon5.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
     <a href="{{ site.baseurl }}/assets/galerie/liva/salon6.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon6.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
     <a href="{{ site.baseurl }}/assets/galerie/liva/salon7.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/salon7.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
     <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine1.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine1.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine2.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine2.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine3.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine3.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine4.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine4.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine5.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine5.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/liva/cuisine6.jpg" data-lightbox="galerie" data-title="Cuisine LIVA" class="gallery-item liva">
      <img src="{{ site.baseurl }}/assets/galerie/liva/cuisine6.jpg" alt="Cuisine LIVA" class="rounded shadow" />
    </a>
    <!-- BLŌM -->
    <a href="{{ site.baseurl }}/assets/galerie/blom/Spa.jpg" data-lightbox="galerie" data-title="Spa BLŌM" class="gallery-item blom">
      <img src="{{ site.baseurl }}/assets/galerie/blom/Spa.jpg" alt="Spa BLŌM" class="rounded shadow" />
    </a>
    <a href="{{ site.baseurl }}/assets/galerie/blom/femmemur.jpg" data-lightbox="galerie" data-title="Chambre BLŌM" class="gallery-item blom">
      <img src="{{ site.baseurl }}/assets/galerie/blom/femmemur.jpg" alt="Chambre BLŌM" class="rounded shadow" />
    </a>
  </div>

</div>

<script>
  function filterGallery(category) {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      if (category === 'all') {
        item.style.display = 'block';
      } else {
        item.style.display = item.classList.contains(category) ? 'block' : 'none';
      }
    });
  }
</script>
