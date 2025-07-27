---
layout: default
title: LIVA – Logement moderne et tout équipé à Guesnain
image: /assets/images/photolivablom1.png
permalink: /liva
---

<section class="text-center mt-12 max-w-4xl mx-auto px-4 animate-fadeIn delay-300">
  <h1 class="text-4xl font-bold mb-4">LIVA – Logement tout confort</h1>
  <p class="text-lg mb-6">Espace moderne, cuisine équipée, parking sécurisé. Idéal pour les couples, familles ou professionnels.</p>
</section>

<!-- Galerie d’images -->
<section class="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 animate-fadeIn delay-500">
  {% assign images = site.static_files | where_exp:"file","file.path contains '/assets/galerie/liva/'" %}
  {% for image in images %}
  <a href="{{ image.path }}" class="lightbox-trigger" role="button" tabindex="0" aria-label="Voir l'image en grand">
    <img src="{{ image.path }}" alt="Vue de LIVA - {{ forloop.index }}" class="object-cover w-full h-48 rounded shadow hover:scale-105 transition" loading="lazy">
  </a>
  {% endfor %}
</section>

<!-- Témoignages clients -->
<section class="mt-16 px-4 text-center animate-fadeIn delay-600">
  <h2 class="text-3xl font-bold mb-4">Ils ont séjourné à LIVA</h2>
  <div id="testimonialCarousel" class="overflow-hidden relative max-w-3xl mx-auto" role="region" aria-label="Témoignages clients">
    <div class="flex transition-transform duration-500 ease-in-out" id="testimonialTrack">
      {% for testimonial in site.data.avis.liva %}
      <div class="min-w-full px-4 py-6">
        <div class="bg-white text-black rounded-lg shadow p-4 relative">
          <p class="text-lg italic">"{{ testimonial.extrait }}"</p>
          <button class="text-blue-500 underline mt-2 open-modal" data-index="{{ forloop.index0 }}" aria-label="Lire le témoignage complet">Lire plus</button>
        </div>
      </div>
      {% endfor %}
    </div>
  </div>
</section>

<!-- Modal témoignages -->
<div id="testimonialModal" class="fixed inset-0 bg-black bg-opacity-70 hidden items-center justify-center z-50" role="dialog" aria-modal="true">
  <div class="bg-white text-black p-6 rounded max-w-xl mx-auto relative shadow-xl" tabindex="-1">
    <button id="closeModal" class="absolute top-2 right-2 text-2xl text-gray-700 hover:text-black" aria-label="Fermer le témoignage">&times;</button>
    <div id="modalContent"></div>
  </div>
</div>

<!-- Appel à l'action -->
<div class="mt-16 bg-white text-black py-6 px-4 text-center rounded-xl shadow-xl max-w-4xl mx-auto animate-fadeIn delay-600">
  <h3 class="text-2xl font-bold mb-2">Réservez LIVA</h3>
  <p class="mb-4">Logement tout équipé avec parking privé et sécurisé</p>
  <div class="flex flex-col sm:flex-row sm:justify-center gap-4 mt-4">
    <a href="{{ site.baseurl }}/contact"
       class="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-800 transition text-center">
      Réserver maintenant
    </a>
    {% include share.html %}
  </div>
</div>

<script>
document.querySelectorAll('.open-modal').forEach((button, index) => {
  button.addEventListener('click', () => {
    const testimonials = {{ site.data.avis.liva | jsonify }};
    document.getElementById('modalContent').innerHTML = `
      <h3 class="text-xl font-bold mb-2">${testimonials[index].nom}</h3>
      <p>${testimonials[index].texte}</p>
    `;
    document.getElementById('testimonialModal').classList.remove('hidden');
    document.getElementById('testimonialModal').focus();
  });
});

document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('testimonialModal').classList.add('hidden');
});
</script>
