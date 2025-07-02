---
layout: default
title: LIVA – Logement tout confort
permalink: /liva
---

<div class="bg-gray-50 min-h-screen px-6 py-8 max-w-5xl mx-auto text-center font-sans text-gray-900">

  <!-- HEADER -->
  <header class="mb-12">
    <h1 class="text-5xl font-extrabold mb-4">LIVA – Logement tout confort</h1>
    <p class="text-xl max-w-3xl mx-auto leading-relaxed">
      Pour familles, couples ou professionnels. Un espace spacieux, une cuisine entièrement équipée, et une ambiance moderne et chaleureuse.
    </p>
  </header>

  <!-- SECTIONS DÉTAILLÉES -->
  <section id="presentation" class="mb-14 px-4">
    <h2 class="text-3xl font-semibold mb-6">Présentation</h2>
    <p class="max-w-4xl mx-auto text-lg leading-relaxed">
      LIVA est un appartement confortable pensé pour accueillir familles, couples ou voyageurs professionnels.  
      Vous y trouverez un espace de vie lumineux avec un grand salon, une cuisine équipée haut de gamme, et plusieurs chambres pour votre confort.  
      L’emplacement est calme tout en restant proche des commodités.
    </p>
  </section>

  <section id="equipements" class="mb-14 px-4">
    <h2 class="text-3xl font-semibold mb-6">Équipements</h2>
    <ul class="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-lg">
      <li>✔️ Cuisine complète avec lave-vaisselle, four, micro-ondes</li>
      <li>✔️ Wi-Fi très haut débit</li>
      <li>✔️ TV écran plat avec Chromecast</li>
      <li>✔️ Machine à laver et sèche-linge</li>
      <li>✔️ Literie king size et lits enfants sur demande</li>
      <li>✔️ Parking privé et sécurisé</li>
    </ul>
  </section>

  <!-- GALERIE PHOTOS -->
  <section id="galerie" class="mb-14">
    <h2 class="text-3xl font-semibold mb-6">Galerie</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-5xl mx-auto cursor-pointer">
      {% assign photos = 
        "/assets/galerie/liva/salon1.jpg,
         /assets/galerie/liva/cuisine.jpg,
         /assets/galerie/liva/chambre1.jpg,
         /assets/galerie/liva/coin-repas.jpg,
         /assets/galerie/liva/salle-bain.jpg" | split: "," %}
      {% for photo in photos %}
      <a href="{{ site.baseurl }}{{ photo | strip }}" data-lightbox="liva" data-title="LIVA - {{ photo | split: '/' | last | remove: '.jpg' | replace: '-', ' ' | capitalize }}">
        <img src="{{ site.baseurl }}{{ photo | strip }}" alt="Photo LIVA" class="rounded-lg shadow-md hover:scale-105 transition-transform duration-300" loading="lazy" />
      </a>
      {% endfor %}
    </div>
  </section>

  <!-- TARIFS -->
  <section id="tarifs" class="mb-14 px-4 max-w-3xl mx-auto text-left">
    <h2 class="text-3xl font-semibold mb-6">Tarifs</h2>
    <table class="w-full text-left border-collapse border border-gray-300 rounded-lg overflow-hidden">
      <thead class="bg-gray-200">
        <tr>
          <th class="py-3 px-4 border border-gray-300">Période</th>
          <th class="py-3 px-4 border border-gray-300">Prix par nuit</th>
        </tr>
      </thead>
      <tbody>
        <tr class="hover:bg-gray-50">
          <td class="py-3 px-4 border border-gray-300">Vendredi et samedi</td>
          <td class="py-3 px-4 border border-gray-300">150 €</td>
        </tr>
        <tr class="hover:bg-gray-50">
          <td class="py-3 px-4 border border-gray-300">Dimanche</td>
          <td class="py-3 px-4 border border-gray-300">130 €</td>
        </tr>
        <tr class="hover:bg-gray-50">
          <td class="py-3 px-4 border border-gray-300">Lundi au jeudi</td>
          <td class="py-3 px-4 border border-gray-300">120 €</td>
        </tr>
      </tbody>
    </table>
    <p class="mt-3 italic text-sm text-gray-600">Tarifs dégressifs pour longs séjours. Contactez-nous pour un devis personnalisé.</p>
  </section>

  <!-- AVIS CLIENTS -->
  <section id="avis" class="mb-14 px-4">
    <h2 class="text-3xl font-semibold mb-6">Ce qu’en disent nos visiteurs</h2>
    <div class="relative max-w-3xl mx-auto overflow-hidden rounded-lg shadow-lg">
      <div id="carousel-liva" class="flex transition-transform duration-700">
        <div class="min-w-full px-8 py-6 cursor-pointer" onclick="openModalLiva(0)">
          <p class="italic text-lg">"Très bien situé, calme et parfaitement équipé."</p>
          <p class="text-sm text-gray-600 mt-3">— Julien</p>
        </div>
        <div class="min-w-full px-8 py-6 cursor-pointer bg-gray-50" onclick="openModalLiva(1)">
          <p class="italic text-lg">"Propre, moderne, idéal pour notre séjour professionnel."</p>
          <p class="text-sm text-gray-600 mt-3">— Marion & Thierry</p>
        </div>
        <div class="min-w-full px-8 py-6 cursor-pointer" onclick="openModalLiva(2)">
          <p class="italic text-lg">"L’appartement est spacieux, tout était conforme à l’annonce."</p>
          <p class="text-sm text-gray-600 mt-3">— Élise</p>
        </div>
      </div>
    </div>
  </section>

  <!-- MODALE AVIS -->
  <div id="testimonialModalLiva" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
    <div class="bg-white text-black max-w-xl p-6 rounded-xl relative">
      <button onclick="closeModalLiva()" class="absolute top-2 right-4 text-3xl font-bold text-gray-600 hover:text-gray-900">&times;</button>
      <p id="modalTextLiva" class="text-lg leading-relaxed mb-4"></p>
      <div class="flex justify-between mt-4">
        <button onclick="prevTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
        <button onclick="nextTestimonialLiva()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
      </div>
    </div>
  </div>

  <!-- BOUTONS D'ACTION -->
  <div class="flex flex-col sm:flex-row justify-center gap-6 max-w-md mx-auto">
    <a href="{{ site.baseurl }}/contact" 
       class="bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition">
      Réserver LIVA
    </a>
    <a href="{{ site.baseurl }}/contact#questions" 
       class="bg-gray-300 text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-400 transition">
      Nous contacter
    </a>
  </div>

</div>

<script>
  let indexLiva = 0;
  const carouselLiva = document.getElementById('carousel-liva');
  const slideCountLiva = carouselLiva.children.length;

  setInterval(() => {
    indexLiva = (indexLiva + 1) % slideCountLiva;
    carouselLiva.style.transform = `translateX(-${indexLiva * 100}%)`;
  }, 4500);

  const fullTestimonialsLiva = [
    `Très bien situé, calme et parfaitement équipé.`,
    `Propre, moderne, idéal pour notre séjour professionnel.`,
    `L’appartement est spacieux, tout était conforme à l’annonce.`
  ];

  let currentLiva = 0;

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
    document.getElementById("modalTextLiva").innerText = fullTestimonialsLiva[currentLiva];
  }

  function prevTestimonialLiva() {
    currentLiva = (currentLiva - 1 + fullTestimonialsLiva.length) % fullTestimonialsLiva.length;
    updateModalTextLiva();
  }

  function nextTestimonialLiva() {
    currentLiva = (currentLiva + 1) % fullTestimonialsLiva.length;
    updateModalTextLiva();
  }
</script>
