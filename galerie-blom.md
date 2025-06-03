---
layout: default
title: Galerie BLŌM
permalink: /galerie-blom
---

<section class="p-6">
  <h2 class="text-2xl font-bold mb-4">Galerie – BLŌM</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    {% for image in site.static_files %}
      {% if image.path contains 'assets/galerie/blom' %}
        <a href="{{ site.baseurl }}{{ image.path }}" data-lightbox="blom" data-title="BLŌM">
          <img src="{{ site.baseurl }}{{ image.path }}" alt="Photo BLŌM" class="rounded shadow">
        </a>
      {% endif %}
    {% endfor %}
  </div>
</section>
