---
layout: default
title: Galerie LIVA
permalink: /galerie-liva
---

<section class="p-6">
  <h2 class="text-2xl font-bold mb-4">Galerie – LIVA</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {% for image in site.static_files %}
      {% if image.path contains 'assets/galerie/liva' %}
        <a href="{{ site.baseurl }}{{ image.path }}" data-lightbox="liva" data-title="LIVA">
          <img src="{{ site.baseurl }}{{ image.path }}" alt="Photo LIVA" class="rounded shadow">
        </a>
      {% endif %}
    {% endfor %}
  </div>
</section>
