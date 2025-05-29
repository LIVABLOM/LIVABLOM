---
layout: default
title: LIVA – Logement tout confort
permalink: /liva
---

<div class="bg-gray-100 min-h-screen px-4 text-center">

  <!-- MENU DE NAVIGATION -->
  <nav class="flex justify-center space-x-6 py-6 text-sm font-semibold uppercase tracking-wide">
    <a href="{{ site.baseurl }}/" class="hover:underline">Accueil</a>
    <a href="#galerie" class="hover:underline">Galerie</a>
    <a href="#prestations" class="hover:underline">Prestations</a>
    <a href="#contact" class="hover:underline">Contact</a>
  </nav>

  <!-- SECTION ACCUEIL -->
  <section id="accueil" class="py-6">
    <h1 class="text-4xl font-bold mb-4">LIVA – Logement tout confort</h1>
    <p class="text-lg max-w-xl mx-auto mb-6">
      <strong class="text-black">
        Pour familles, couples ou professionnels. Espace spacieux, cuisine équipée, ambiance moderne.
      </strong>
    </p>
  </section>

  <!-- SECTION GALERIE -->
  <section id="galerie" class="py-8">
    <h2 class="text-2xl font-bold mb-6">Galerie</h2>
    <div class="flex justify-center">
      <a href="{{ site.baseurl }}/assets/images/salon1.jpg" data-lightbox="liva" data-title="Salon LIVA">
        <img src="{{ site.baseurl }}/assets/images/salon1.jpg" alt="Salon LIVA" class="h-48 rounded shadow" />
      </a>
      <!-- Images masquées -->
      <a href="{{ site.baseurl }}/assets/images/Liva.jpg" data-lightbox="liva" data-title="Salon LIVA" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/chaise.jpg" data-lightbox="liva" data-title="Salon LIVA" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/espacerepas.jpg" data-lightbox="liva" data-title="Coin repas LIVA" style="display: none;"></a>
      <a href="{{ site.baseurl }}/assets/images/the.jpg" data-lightbox="liva" data-title="Table LIVA" style="display: none;"></a>
    </div>
  </section>

  <!-- SECTION PRESTATIONS -->
  <section id="prestations" class="py-12">
    <h2 class="text-2xl font-bold mb-6">Nos prestations</h2>
    <p class="max-w-xl mx-auto text-lg mb-6">
      LIVA vous accueille dans un logement spacieux, lumineux et moderne avec une cuisine équipée, une literie confortable et un espace de vie chaleureux.
    </p>
    <a href="https://www.airbnb.fr/rooms/41095534?guests=1&adults=2&s=67&unique_share_id=e0082f3f-afbb-4a7f-8e36-141205d4c373"
       class="bg-white text-black hover:bg-gray-300 font-semibold py-3 px-6 rounded-full transition inline-block">
      Réserver LIVA
    </a>
  </section>

  <!-- AVIS CLIENTS -->
  <section class="py-12">
    <h2 class="text-2xl font-bold mb-6">Ce qu’en disent nos visiteurs</h2>
    <div class="relative w-full max-w-2xl mx-auto overflow-hidden">
      <div id="testimonial-carousel-liva" class="whitespace-nowrap transition-transform duration-700 ease-in-out">
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"Très bien situé, calme et parfaitement équipé."</p>
          <p class="text-sm text-gray-600">— Julien</p>
        </div>
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"Propre, moderne, idéal pour notre séjour professionnel."</p>
          <p class="text-sm text-gray-600">— Marion & Thierry</p>
        </div>
        <div class="inline-block w-full px-4">
          <p class="text-lg italic mb-2">"L’appartement est spacieux, tout était conforme à l’annonce."</p>
          <p class="text-sm text-gray-600">— Élise</p>
        </div>
      </div>
    </div>
  </section>

  <script>
    let indexLiva = 0;
    const carouselLiva = document.getElementById('testimonial-carousel-liva');
    const slideCountLiva = carouselLiva.children.length;

    setInterval(() => {
      indexLiva = (indexLiva + 1) % slideCountLiva;
      carouselLiva.style.transform = `translateX(-${indexLiva * 100}%)`;
    }, 5000);
  </script>

  <!-- SECTION CONTACT -->
  <section id="contact" class="text-center py-12">
  <h2 class="text-2xl font-bold mb-4">Contact</h2>
  <p class="text-lg mb-4">
    Vous souhaitez réserver ou poser une question ? Contactez-nous via le formulaire ci-dessous.
  </p>
  <<form action="https://formspree.io/f/mwkgrvlw" method="POST" class="max-w-xl mx-auto text-left space-y-4">
  <label class="block">
    <span class="text-white">Nom</span>
    <input type="text" name="nom" required class="mt-1 block w-full rounded border-gray-300 text-black" />
  </label>
  <label class="block">
    <span class="text-white">Email</span>
    <input type="email" name="email" required class="mt-1 block w-full rounded border-gray-300 text-black" />
  </label>
  <label class="block">
    <span class="text-white">Message</span>
    <textarea name="message" required class="mt-1 block w-full rounded border-gray-300 text-black"></textarea>
  </label>
  <button type="submit" class="bg-white text-black hover:bg-gray-300 font-semibold py-2 px-4 rounded">
    Envoyer
  </button>
</form>
</section>


</div>
