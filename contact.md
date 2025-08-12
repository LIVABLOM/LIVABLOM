---
layout: default
title: Contact
permalink: /contact
---

<a href="https://m.me/livablom59" target="_blank" class="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-500 transition">
  💬 Messenger
</a>

<section class="bg-black text-yellow-400 min-h-screen py-12 px-6 w-full">
  <div class="max-w-2xl mx-auto">

    <h2 class="text-3xl font-bold mb-8 text-center">Nous contacter</h2>

    <p class="text-center mb-6">
      Une question ? Une demande de réservation ? N'hésitez pas à nous écrire via ce formulaire.
    </p>

    <form action="https://formspree.io/f/mblyrrna" method="POST" class="space-y-6">

      <div>
        <label for="name" class="block text-sm font-semibold mb-1">Nom</label>
        <input type="text" id="name" name="name" required
               class="w-full p-3 rounded bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300" />
      </div>

      <div>
        <label for="email" class="block text-sm font-semibold mb-1">Email</label>
        <input type="email" id="email" name="_replyto" required
               class="w-full p-3 rounded bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300" />
      </div>

      <!-- Sélecteur de dates -->
      <div>
        <label for="dates" class="block text-sm font-semibold mb-1">Dates souhaitées</label>
        <input type="text" id="dates" name="dates" required placeholder="Cliquez pour choisir" readonly
               class="w-full p-3 rounded bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300" />
        <p class="text-xs text-yellow-300 mt-2">Sélectionnez une plage (arrivée → départ).</p>
      </div>

      <div>
        <label for="message" class="block text-sm font-semibold mb-1">Mes
