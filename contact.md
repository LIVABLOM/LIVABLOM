---
layout: default
title: Contactez-nous
permalink: /contact
---

<div class="min-h-screen bg-white text-black px-4 py-12 text-center">
  <h1 class="text-3xl font-bold mb-6">Nous contacter</h1>
  <p class="text-lg mb-8 max-w-xl mx-auto">
    Une question, une demande de réservation ou de renseignement ? Écrivez-nous via ce formulaire, nous vous répondrons rapidement.
  </p>

  <form action="https://formspree.io/f/mblyrrna" method="POST" class="space-y-6 max-w-md mx-auto">
    <!-- Redirection corrigée avec URL absolue -->
    <input type="hidden" name="_redirect" value="https://livablom.github.io/LIVABLOM/merci" />

    <div>
      <label for="name" class="block text-left text-sm font-medium mb-1">Nom</label>
      <input type="text" id="name" name="name" required class="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black" />
    </div>

    <div>
      <label for="email" class="block text-left text-sm font-medium mb-1">Email</label>
      <input type="email" id="email" name="email" required class="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black" />
    </div>

    <div>
      <label for="message" class="block text-left text-sm font-medium mb-1">Message</label>
      <textarea id="message" name="message" rows="5" required class="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-black"></textarea>
    </div>

    <button type="submit" class="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition">
      Envoyer
    </button>
  </form>
</div>
