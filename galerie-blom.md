---
layout: default
title: Galerie BLŌM
permalink: /galerie-blom

photos_standard:
  - "/assets/galerie/blom/blom-story.png"
  - "/assets/galerie/blom/portail.png"
  - "/assets/galerie/blom/spa-ciel-peignoir.png"
  - "/assets/galerie/blom/petitdej.png"
  - "/assets/galerie/blom/salon intime.png"
  - "/assets/galerie/blom/salle de massage.png"
  - "/assets/galerie/blom/chambre romantique.png"
  - "/assets/galerie/blom/douche.png"
  - "/assets/galerie/blom/vasque.png"

photos_ambiance:
  - "/assets/galerie/blom/pack-romantique-blom.png"

photos_signature:
- "/assets/galerie/blom/pack-signature-blom.png"
- "/assets/galerie/blom/sdm.png"

photos_autres:
  - "/assets/galerie/blom/table romantique.png"
---

<!-- ========================= -->
<!-- GALERIE BLŌM STANDARD -->
<!-- ========================= -->

<section class="px-6 py-12">
  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-10">
      <p class="text-gray-500 uppercase tracking-[0.2em] text-sm mb-3">
        Découvrez BLŌM
      </p>

      <h1 class="text-3xl md:text-4xl font-semibold mb-4">
        La suite BLŌM
      </h1>

      <p class="text-gray-600 max-w-2xl mx-auto">
        Découvrez la suite, le spa privatif, l’espace massage
        et les différents espaces de BLŌM dans leur configuration habituelle.
      </p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

      {% for image in page.photos_standard %}

        <a href="{{ site.baseurl }}{{ image }}"
           data-lightbox="blom-standard"
           data-title="BLŌM">

          <img
            src="{{ site.baseurl }}{{ image }}"
            alt="BLŌM – Suite et spa privatif près de Douai"
            class="rounded shadow w-full h-full object-cover"
            loading="lazy">

        </a>

      {% endfor %}

    </div>

  </div>
</section>


<!-- ========================= -->
<!-- MISES EN SCÈNE EN OPTION -->
<!-- ========================= -->

<section class="px-6 py-14 bg-black text-white">

  <div class="max-w-6xl mx-auto">

    <div class="text-center mb-12">

      <p class="text-yellow-500 uppercase tracking-[0.2em] text-sm mb-3">
        Personnalisez votre expérience
      </p>

      <h2 class="text-3xl md:text-4xl font-semibold mb-4">
        Mises en scène romantiques
      </h2>

      <p class="text-gray-300 max-w-2xl mx-auto">
        Les décorations présentées ci-dessous sont proposées en option
        et ne sont pas incluses dans la réservation standard.
      </p>

    </div>


    <!-- ========================= -->
    <!-- AMBIANCE ROMANTIQUE 59 € -->
    <!-- ========================= -->

    {% if page.photos_ambiance.size > 0 %}

      <div class="mb-16">

        <div class="text-center mb-7">

          <h3 class="text-2xl font-semibold">
            Ambiance Romantique Premium
          </h3>

          <p class="text-gray-400 mt-2">
            Ambiance dans la suite et la salle de bain · 59 € · En option
          </p>

        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

          {% for image in page.photos_ambiance %}

            <div class="relative overflow-hidden rounded shadow">

              <a href="{{ site.baseurl }}{{ image }}"
                 data-lightbox="blom-ambiance"
                 data-title="Ambiance Romantique Premium – 59 € – En option">

                <img
                  src="{{ site.baseurl }}{{ image }}"
                  alt="Ambiance Romantique Premium BLŌM"
                  class="w-full h-full object-cover"
                  loading="lazy">

                <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs sm:text-sm text-center py-2 px-2">
                  Ambiance Romantique · En option
                </div>

              </a>

            </div>

          {% endfor %}

        </div>

      </div>

    {% endif %}


    <!-- ========================= -->
    <!-- SIGNATURE 79 € -->
    <!-- ========================= -->

    {% if page.photos_signature.size > 0 %}

      <div class="mb-16">

        <div class="text-center mb-7">

          <h3 class="text-2xl font-semibold">
            Expérience Signature BLŌM
          </h3>

          <p class="text-gray-400 mt-2">
            Ambiance dans toutes les pièces · 79 € · En option
          </p>

        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

          {% for image in page.photos_signature %}

            <div class="relative overflow-hidden rounded shadow">

              <a href="{{ site.baseurl }}{{ image }}"
                 data-lightbox="blom-signature"
                 data-title="Expérience Signature BLŌM – 79 € – En option">

                <img
                  src="{{ site.baseurl }}{{ image }}"
                  alt="Expérience Signature BLŌM"
                  class="w-full h-full object-cover"
                  loading="lazy">

                <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs sm:text-sm text-center py-2 px-2">
                  Expérience Signature · En option
                </div>

              </a>

            </div>

          {% endfor %}

        </div>

      </div>

    {% endif %}


    <!-- ========================= -->
    <!-- TABLE ROMANTIQUE -->
    <!-- ========================= -->

    {% if page.photos_autres.size > 0 %}

      <div>

        <div class="text-center mb-7">

          <h3 class="text-2xl font-semibold">
            Table romantique
          </h3>

          <p class="text-gray-400 mt-2">
            Mise en place sur demande
          </p>

        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">

          {% for image in page.photos_autres %}

            <div class="relative overflow-hidden rounded shadow">

              <a href="{{ site.baseurl }}{{ image }}"
                 data-lightbox="blom-table"
                 data-title="Table romantique – sur demande">

                <img
                  src="{{ site.baseurl }}{{ image }}"
                  alt="Table romantique BLŌM"
                  class="w-full h-full object-cover"
                  loading="lazy">

                <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-xs sm:text-sm text-center py-2 px-2">
                  Mise en scène sur demande
                </div>

              </a>

            </div>

          {% endfor %}

        </div>

      </div>

    {% endif %}

  </div>
</section>