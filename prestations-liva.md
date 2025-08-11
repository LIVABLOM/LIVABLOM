---
layout: default
title: Prestations LIVA
permalink: /prestations-liva
---
<!-- Bouton hamburger visible uniquement sur mobile -->
<button id="menu-toggle" aria-label="Ouvrir le menu" style="display:none; position: fixed; top: 1rem; left: 1rem; z-index: 1001; background: #FFD600; border: none; padding: 0.5rem 1rem; border-radius: 4px; font-weight: bold;">
  ☰ Menu
</button>

<!-- Menu latéral caché -->
<nav id="side-menu" style="position: fixed; top: 0; left: -250px; width: 250px; height: 100vh; background: #111; color: #FFD600; padding: 2rem 1rem; box-shadow: 2px 0 8px rgba(0,0,0,0.7); transition: left 0.3s ease; z-index: 1000;">
  <button id="menu-close" aria-label="Fermer le menu" style="background: none; border: none; color: #FFD600; font-size: 1.5rem; font-weight: bold; position: absolute; top: 1rem; right: 1rem; cursor: pointer;">×</button>
  <ul style="list-style: none; padding: 0; margin-top: 3rem;">
    <li style="margin-bottom: 1rem;"><a href="{{ '/prestations' | relative_url }}" style="color: #FFD600; text-decoration: none; font-weight: 600;">← Retour aux prestations</a></li>
    <li style="margin-bottom: 1rem;"><a href="{{ '/prestations-liva' | relative_url }}" style="color: #FFD600; text-decoration: none;">Prestations LIVA</a></li>
    <li><a href="{{ '/prestations-blom' | relative_url }}" style="color: #FFD600; text-decoration: none;">Prestations BLŌM</a></li>
  </ul>
</nav>

<p class="mb-6">
  <a href="{{ '/prestations' | relative_url }}" class="text-yellow-400 hover:underline">← Retour aux prestations</a>
</p>

<section class="bg-black text-yellow-400 min-h-screen py-12 px-6 w-full">
  <div class="max-w-4xl mx-auto">

    <h1 class="text-3xl font-bold mb-8 text-center">Nos prestations – LIVA</h1>

    <div class="space-y-4 text-lg leading-relaxed">
      <section>
        <h2 class="text-2xl font-semibold mb-4">Confort & équipements</h2>
        <ul class="list-disc list-inside space-y-2">
          <li>Logement tout équipé de 68 m²</li>
          <li>Lit king size</li>
          <li>Salon avec grand TV </li>
          <li>Wifi fibre gratuit</li>
          <li>Cuisine équipée (micro-ondes, frigo, plaque, etc.)</li>
          <li>Machine à laver et sèche-cheveux</li>
          <li>Arrivée et départ en toute autonomie</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Tarifs</h2>
        <ul class="list-disc list-inside space-y-2">
          <li>À partir de 79 €/nuit pour deux personnes</li>
          <li>Tarifs ajustables selon la durée du séjour et le nombre de personnes</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-semibold mb-4">Accès</h2>
        <p>LIVA est situé à Guesnain à 10 minutes de Douai, 30 minutes de Lille, avec stationnement gratuit dans notre parking sécurisée. Idéal pour les professionnels ou les familles en déplacement.</p>
      </section>

      <p class="mt-6 text-center">
        <a href="{{ '/contact' | relative_url }}" class="inline-block bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition">
          Demander une réservation
        </a>
      </p>
      
      <p class="text-sm text-center text-yellow-300 mt-12">
        Pour toute demande spécifique, contactez-nous directement.
      </p>
    </div>

  </div>
</section>
