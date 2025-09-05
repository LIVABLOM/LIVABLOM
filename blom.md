---
layout: default
title: BLŌM – Spa et Séjour
---

<!-- Présentation principale -->
<section class="blom-intro">
  <h1>BLŌM – Votre espace bien-être</h1>
  <p>Profitez d’un séjour détente avec spa privatif et prestations haut de gamme.</p>
  <button id="open-calendar" class="btn-reserve">Voir le calendrier / Réserver</button>
</section>

<!-- Galerie d'images (exemple avec 3 images) -->
<section class="blom-gallery">
  <img src="/assets/galerie/blom/photo1.jpg" alt="Spa BLŌM">
  <img src="/assets/galerie/blom/photo2.jpg" alt="Chambre BLŌM">
  <img src="/assets/galerie/blom/photo3.jpg" alt="Salon BLŌM">
</section>

<!-- Prestations et tarifs -->
<section class="blom-prestations">
  <h2>Nos prestations</h2>
  <ul>
    <li>Nuitée : 150€–190€ selon le jour</li>
    <li>Formule journée (11h–16h) : 130€</li>
    <li>Formules 4h : sur demande</li>
  </ul>
</section>

<!-- Témoignages clients (chargés via fichier séparé) -->
<section class="blom-testimonials" id="blom-testimonials"></section>

<!-- Modal calendrier -->
<div id="blom-calendar-modal" class="calendar-modal hidden">
  <div class="calendar-content">
    <span class="calendar-close">&times;</span>
    <div id="blom-calendar"></div>
  </div>
</div>

<!-- Scripts -->
<script src="/assets/js/blom-calendar.js"></script>
<script src="/assets/js/blom-testimonials.js"></script>
