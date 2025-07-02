---
layout: default
title: LIVA – Logement tout confort
permalink: /liva
---

<div class="bg-gray-100 min-h-screen px-6 py-8 text-center flex flex-col">

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="mb-12 max-w-3xl mx-auto">
    <h1 class="text-5xl font-extrabold mb-6 text-gray-900">LIVA – Logement tout confort</h1>
    <p class="text-xl text-gray-800 max-w-xl mx-auto">
      <strong>
        Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.
      </strong>
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="mb-12 max-w-5xl mx-auto">
    <h2 class="text-3xl font-semibold mb-8 text-gray-900">Galerie</h2>
    <div class="flex flex-wrap justify-center gap-6">
      <!-- Images comme avant -->
      <a href="{{ site.baseurl }}/assets/images/salon1.jpg" data-lightbox="liva" data-title="Salon LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/salon1.jpg" alt="Salon LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/Liva.jpg" data-lightbox="liva" data-title="Salon LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/Liva.jpg" alt="Salon LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/chaise.jpg" data-lightbox="liva" data-title="Chaise design LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/chaise.jpg" alt="Chaise design LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/espacerepas.jpg" data-lightbox="liva" data-title="Coin repas LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/espacerepas.jpg" alt="Coin repas LIVA" class="w-full h-40 object-cover" />
      </a>
      <a href="{{ site.baseurl }}/assets/images/the.jpg" data-lightbox="liva" data-title="Table LIVA" class="block rounded-lg shadow-lg overflow-hidden w-64 hover:scale-105 transition-transform">
        <img src="{{ site.baseurl }}/assets/images/the.jpg" alt="Table LIVA" class="w-full h-40 object-cover" />
      </a>
    </div>
  </section>

  <!-- SECTION TARIFS -->
  <section id="tarifs" class="mb-12 max-w-3xl mx-auto text-left px-4">
    <h2 class="text-3xl font-semibold mb-6 text-gray-900">Tarifs</h2>
    <p class="text-xl">
      Tarif unique : <span class="font-bold text-blue-600">75 € par nuit</span>
    </p>
    <p class="mt-3 italic text-sm text-gray-600">
      Tarifs dégressifs possibles pour les séjours longs. Contactez-nous pour plus d'informations.
    </p>
  </section>

  <!-- BOUTON RÉSERVER -->
  <div class="mb-12">
    <a href="{{ site.baseurl }}/contact"
       class="bg-blue-600 text-white font-semibold py-4 px-8 rounded-full hover:bg-blue-700 transition inline-block shadow-lg">
      Réserver LIVA
    </a>
  </div>

  <!-- AVIS CLIENTS -->
  <section class="mb-12 max-w-3xl mx-auto text-left px-4">
    <h2 class="text-3xl font-semibold mb-6 text-gray-900">Ce qu’en disent nos visiteurs</h2>
    <div id="testimonial-list" class="relative overflow-hidden rounded-lg shadow-md bg-white flex gap-4 px-4 py-6 justify-center"></div>
  </section>

  <!-- MODALE AVIS -->
  <div id="testimonialModalLiva" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
    <div class="bg-white text-black max-w-xl p-6 rounded-xl relative shadow-lg">
      <button onclick="closeModalLiva()" class="absolute top-2 right-4 text-3xl font-bold text-gray-600 hover:text-gray-900">&times;</button>
      <p id="modalTextLiva" class="text-lg leading-relaxed mb-4 text-gray-800"></p>
      <div class="flex justify-between mt-4">
        <button onclick="prevTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
        <button onclick="nextTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
      </div>
    </div>
  </div>

</div>

<script>
  let testimonialsLiva = [];
  let currentLiva = 0;

  // Charger les témoignages JSON
  fetch('{{ site.baseurl }}/assets/data/temoignages-liva.json')
    .then(response => response.json())
    .then(data => {
      testimonialsLiva = data;
      renderTestimonials();
    })
    .catch(error => {
      console.error("Erreur chargement témoignages :", error);
      document.getElementById('testimonial-list').innerText = "Impossible de charger les témoignages.";
    });

  function renderTestimonials() {
    const container = document.getElementById('testimonial-list');
    container.innerHTML = '';
    testimonialsLiva.forEach((t, i) => {
      // On affiche un extrait (max 80 caractères) avec "..." si trop long
      const excerpt = t.texte.length > 80 ? t.texte.substring(0, 77) + "..." : t.texte;
      const div = document.createElement('div');
      div.className = "min-w-[250px] cursor-pointer px-4 py-6 border rounded shadow hover:shadow-lg transition";
      div.innerHTML = `<p class="italic text-gray-700">${excerpt}</p><p class="text-sm text-gray-500 mt-2">— ${t.auteur}</p>`;
      div.onclick = () => openModalLiva(i);
      container.appendChild(div);
    });
  }

  function openModalLiva(i) {
    currentLiva = i;
    updateModalTextLiva();
    const modal = document.getElementById("testimonialModalLiva");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function closeModalLiva() {
    const modal = document.getElementById("testimonialModalLiva");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  function updateModalTextLiva() {
    const modalText = document.getElementById("modalTextLiva");
    modalText.innerHTML = `<em>"${testimonialsLiva[currentLiva].texte}"</em><br><br><strong>— ${testimonialsLiva[currentLiva].auteur}</strong>`;
  }

  function prevTestimonialLiva() {
    currentLiva = (currentLiva - 1 + testimonialsLiva.length) % testimonialsLiva.length;
    updateModalTextLiva();
  }

  function nextTestimonialLiva() {
    currentLiva = (currentLiva + 1) % testimonialsLiva.length;
    updateModalTextLiva();
  }
</script>
