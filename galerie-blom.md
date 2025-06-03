---
layout: default
title: Galerie BLŌM
permalink: /galerie-blom
---

<div class="px-4 py-8 bg-white">
  <h2 class="text-2xl font-bold text-center mb-6">Galerie BLŌM</h2>

  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {% for i in (1..6) %}
      <img src="{{ site.baseurl }}/assets/galerie/blom/{{ i }}.jpg"
           alt="BLŌM {{ i }}"
           class="w-full h-48 object-cover rounded shadow" />
    {% endfor %}
  </div>
</div>
