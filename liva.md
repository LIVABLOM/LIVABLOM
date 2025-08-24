---
layout: default
title: LIVA
---

<!-- Contenu de la page LIVA ici -->

<button id="btn-reserver-liva">Réserver</button>
<div id="calendar-liva" style="display:none;"></div>

<!-- Galerie ou carrousel -->
<div id="carousel">
  <!-- Slides ici -->
</div>

<!-- Modal témoignages -->
<div id="testimonialModal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
  <div class="bg-white p-4 rounded">
    <p id="modalText"></p>
    <button onclick="prevTestimonial()">Précédent</button>
    <button onclick="nextTestimonial()">Suivant</button>
    <button onclick="closeModal()">Fermer</button>
  </div>
</div>

<script>
document.getElementById('btn-reserver-liva').addEventListener('click', async () => {
  const container = document.getElementById('calendar-liva');
  container.style.display = 'block';
  if (container.innerHTML.trim() !== '') return;

  const calendar = new Calendar(container, {
    initialView: 'dayGridMonth',
    height: 600,
    events: [
      { url: 'https://calendar-proxy-production-08de.up.railway.app/calendar/liva' }
    ]
  });
  calendar.render();
  container.scrollIntoView({ behavior: 'smooth' });
});

let currentIndex = 0;
const fullTestimonials = [
  `Très bien situé, calme et parfaitement équipé. Nous avons passé un excellent séjour, tout était conforme à la description.`,
  `Propre, moderne, idéal pour notre séjour professionnel. L’appartement dispose de tout le nécessaire et la communication a été très facile.`,
  `L’appartement est spacieux, tout était conforme à l’annonce. Nous avons particulièrement apprécié la cuisine bien équipée.`,
];

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

// Carrousel automatique
const carousel = document.getElementById("carousel");
const totalItems = 3;
let carouselIndex = 0;

function showCarouselSlide(index) {
  const offset = -index * 100;
  carousel.style.transform = `translateX(${offset}%)`;
}

setInterval(() => {
  carouselIndex = (carouselIndex + 1) % totalItems;
  showCarouselSlide(carouselIndex);
}, 4000);
</script>
