---
layout: default
title: BLŌM
permalink: /blom
---

<section class="bg-black text-white py-12 px-4 w-full overflow-x-hidden">
  <div class="max-w-6xl mx-auto space-y-16">

    <h1 class="text-3xl md:text-4xl font-bold text-center mb-10 animate-fadeIn">BLŌM – Détente & Évasion</h1>

    <!-- Bandeau hygiène -->
    <div class="bg-red-600 text-white text-sm px-6 py-3 rounded-full shadow-md text-center max-w-md mx-auto mb-6 animate-fadeIn delay-100">
      Le spa est vidé, désinfecté et rempli pour chaque client – Vidéo envoyée le jour de votre arrivée 📹
    </div>

    <!-- Bloc 1 à Bloc 4 (identiques à avant, pas modifiés) -->
    <!-- ... -->

    <!-- Bloc témoignages dynamique -->
    <div class="mt-20">
      <!-- Étoiles dorées -->
      <div class="flex justify-center mb-2">
        {% for i in (1..5) %}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.201 4.665 24 6 15.596 0 9.748l8.332-1.73z"/></svg>
        {% endfor %}
      </div>

      <h2 class="text-2xl font-bold text-center mb-6">Ils ont séjourné chez BLŌM</h2>

      <div class="relative max-w-3xl mx-auto overflow-hidden">
        <div id="carousel" class="flex transition-transform duration-700">
          {% for temoignage in site.data.temoignages %}
          <div class="min-w-full px-4 cursor-pointer" onclick="openModal({{ forloop.index0 }})">
            <p class="italic text-lg truncate">“{{ temoignage.texte | truncate: 100 }}”</p>
            <span class="block mt-2 text-sm text-gray-400">– {{ temoignage.auteur }}</span>
          </div>
          {% endfor %}
        </div>
      </div>
    </div>

    <!-- Modal avec étoiles ajoutées -->
    <div id="testimonialModal" class="fixed inset-0 bg-black bg-opacity-80 hidden items-center justify-center z-50 px-4">
      <div class="bg-white text-black max-w-xl p-6 rounded-xl relative">
        <button onclick="closeModal()" class="absolute top-2 right-4 text-2xl font-bold text-gray-600">&times;</button>

        <!-- Étoiles dans la popup -->
        <div class="flex justify-center mb-4">
          {% for i in (1..5) %}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 20.201 4.665 24 6 15.596 0 9.748l8.332-1.73z"/></svg>
          {% endfor %}
        </div>

        <p id="modalText" class="text-lg leading-relaxed mb-4"></p>

        <div class="flex justify-between mt-4">
          <button onclick="prevTestimonial()" class="text-sm font-semibold text-blue-600 hover:underline">&larr; Précédent</button>
          <button onclick="nextTestimonial()" class="text-sm font-semibold text-blue-600 hover:underline">Suivant &rarr;</button>
        </div>
      </div>
    </div>

    <!-- Réserver -->
    <div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
      <h3 class="text-2xl font-bold mb-2">Réservez votre escapade bien-être</h3>
      <p class="mb-4">Spa privatif, massage et confort haut de gamme vous attendent</p>
      <a href="{{ site.baseurl }}/contact"
         class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition">
        Réserver maintenant
      </a>
    </div>
  </div>
</section>

<!-- Scripts -->
<script>
let currentIndex = 0;

function openModal(i) {
  currentIndex = i;
  updateModalText();
  document.getElementById("testimonialModal").classList.remove("hidden");
  document.getElementById("testimonialModal").classList.add("flex");
}

function closeModal() {
  document.getElementById("testimonialModal").classList.add("hidden");
  document.getElementById("testimonialModal").classList.remove("flex");
}

function updateModalText() {
  document.getElementById("modalText").innerText = fullTestimonials[currentIndex];
}

function prevTestimonial() {
  currentIndex = (currentIndex - 1 + fullTestimonials.length) % fullTestimonials.length;
  updateModalText();
}

function nextTestimonial() {
  currentIndex = (currentIndex + 1) % fullTestimonials.length;
  updateModalText();
}
</script>

<script>
const fullTestimonials = [
  {% for temoignage in site.data.temoignages %}
    `{{ temoignage.texte | strip_newlines | escape }}`,
  {% endfor %}
];
</script>

<script>
let carouselIndex = 0;
const carousel = document.getElementById("carousel");
const totalItems = {{ site.data.temoignages | size }};

function showCarouselSlide(index) {
  const offset = -index * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}

setInterval(() => {
  carouselIndex = (carouselIndex + 1) % totalItems;
  showCarouselSlide(carouselIndex);
}, 4000);
</script>
