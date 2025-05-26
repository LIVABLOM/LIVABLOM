---
title: "BLŌM – Petit dej offert"
description: "Logement avec spa, salle de massage, lit king size, salon TV, petit déjeuner inclus, et arrivée autonome."
image: assets/images/Spa.jpg
---

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
  background-color: black;
  color: white;
}
section {
  padding: 1rem;
  max-width: 800px;
  margin: auto;
  text-align: center;
}
img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  background: white;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
#image-slider {
  position: relative;
}
#image-slider img {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
}
#image-slider button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.6);
}
#prev {
  left: 10px;
}
#next {
  right: 10px;
}
.avis {
  overflow: hidden;
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem 0;
}
#avis-carousel {
  display: flex;
  transition: transform 0.5s ease;
}
.avis-item {
  flex: 0 0 100%;
  padding: 1rem;
}
</style>

<section>
  <h1>Bienvenue chez <strong>BLŌM</strong></h1>
  <p><em>Un moment suspendu entre détente et raffinement.</em></p>

  <div id="image-slider">
    <img id="slider-image" src="assets/images/Spa.jpg" alt="Image de BLŌM" />
    <button id="prev" onclick="changeImage(-1)">‹</button>
    <button id="next" onclick="changeImage(1)">›</button>
  </div>

  <p style="margin-top: 1rem;">
    <strong>BLŌM</strong> est un logement élégant pour deux, avec lit king-size, spa privatif, salle de massage, salon TV et petit déjeuner offert. Idéal pour une escapade romantique en toute autonomie.
  </p>

  <p style="font-size: 1.2rem; background: linear-gradient(90deg, #ff9a9e, #fad0c4); -webkit-background-clip: text; color: transparent;">
    Jacuzzi, massage, détente...
  </p>

  <div>
    <a href="https://airbnb.com" target="_blank"><button>Réserver sur Airbnb</button></a>
    <a href="https://wa.me/123456789" target="_blank"><button>Réserver en direct</button></a>
  </div>

  <h2>Nos formules à la nuitée ou journée</h2>
  <ul>
    <li><strong>Lundi au jeudi (nuitée) :</strong> 140 euros</li>
    <li><strong>Vendredi (nuitée) :</strong> 180 euros</li>
    <li><strong>Samedi (nuitée) :</strong> 180 euros</li>
    <li><strong>Dimanche (journée ou nuitée) :</strong> 200 euros</li>
    <li><strong>Formule journée (11h - 17h) :</strong> 150 euros</li>
    <li><strong>Formule journée 4H :</strong> 110 euros</li>
  </ul>
</section>

<section class="avis">
  <h2>Avis de nos visiteurs</h2>
  <div id="avis-carousel">
    <div class="avis-item">“Un havre de paix avec un jacuzzi parfait !” – Alice</div>
    <div class="avis-item">“Séjour inoubliable, tout était impeccable.” – Karim</div>
    <div class="avis-item">“Le petit déjeuner au lit, un vrai plus !” – Sophie</div>
  </div>
</section>

<script>
const images = [
  "assets/images/femmemur.jpg",
  "assets/images/sceau.jpg",
  "assets/images/table.jpg",
];
let currentIndex = 0;
const sliderImage = document.getElementById("slider-image");

function showImage(index) {
  if (!sliderImage) return;
  sliderImage.src = images[index];
}

function changeImage(direction) {
  currentIndex = (currentIndex + direction + images.length) % images.length;
  showImage(currentIndex);
}
showImage(currentIndex);

// Carousel des avis
let avisIndex = 0;
const avisCarousel = document.getElementById("avis-carousel");

function nextAvis() {
  avisIndex = (avisIndex + 1) % 3;
  avisCarousel.style.transform = `translateX(-${avisIndex * 100}%)`;
}

setInterval(nextAvis, 4000);
</script>
