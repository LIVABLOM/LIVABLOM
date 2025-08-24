---
layout: default
title: LIVA
---

# LIVA – Logement Tout Confort

Bienvenue dans notre appartement LIVA, idéal pour familles, couples ou séjours professionnels.  
Vous y trouverez tout le nécessaire pour un séjour confortable et agréable.

---

## Nos Prestations

- Cuisine entièrement équipée  
- Salon avec TV et Wifi  
- Chambre spacieuse  
- Salle de bain moderne  
- Linge de maison fourni  

---

## Galerie Photos

<div id="carousel" class="overflow-hidden relative w-full mt-4">
  <div class="flex transition-transform duration-500">
    <img src="/assets/galerie/liva/photo1.jpg" alt="Salon LIVA" class="w-full">
    <img src="/assets/galerie/liva/photo2.jpg" alt="Chambre LIVA" class="w-full">
    <img src="/assets/galerie/liva/photo3.jpg" alt="Cuisine LIVA" class="w-full">
  </div>
</div>

---

## Réserver

<button id="btn-reserver-liva" class="bg-blue-600 text-white px-4 py-2 rounded mt-4">
  Réserver
</button>

<div id="calendar-liva" style="display:none; margin-top:20px;"></div>

---

## Témoignages Clients

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  <div onclick="openModal(0)" class="p-4 bg-gray-100 rounded cursor-pointer">
    Très bien situé, calme et parfaitement équipé. Nous avons passé un excellent séjour, tout était conforme à la description.
  </div>
  <div onclick="openModal(1)" class="p-4 bg-gray-100 rounded cursor-pointer">
    Propre, moderne, idéal pour notre séjour professionnel. L’appartement dispose de tout le nécessaire et la communication a été très facile.
  </div>
  <div onclick="openModal(2)" class="p-4 bg-gray-100 rounded cursor-pointer">
    L’appartement est spacieux, tout était conforme à l’annonce. Nous avons particulièrement apprécié la cuisine bien équipée.
  </div>
</div>

<!-- Modal témoignages -->
<div id="testimonialModal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center">
  <div class="bg-white p-6 rounded max-w-lg mx-auto">
    <p id="modalText" class="mb-4"></p>
    <div class="flex justify-between">
      <button onclick="prevTestimonial()" class="bg-gray-300 px-3 py-1 rounded">Précédent</button>
      <button onclick="nextTestimonial()" class="bg-gray-300 px-3 py-1 rounded">Suivant</button>
      <button onclick="closeModal()" class="bg-red-500 text-white px-3 py-1 rounded">Fermer</button>
    </div>
  </div>
</div>

---

## Mentions Légales

<p class="text-sm mt-6">© 2025 LIVABLŌM. Tous droits réservés.</p>

<!-- Script JS à la fin -->
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
const carousel = document.getElementById("carousel").querySelector("div");
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
