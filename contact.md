---
layout: default
title: Contact
permalink: /contact
---

<section class="bg-black text-yellow-400 min-h-screen py-12 px-6 w-full">
  <div class="max-w-2xl mx-auto">

    <h2 class="text-3xl font-bold mb-8 text-center">Nous contacter</h2>

    <p class="text-center mb-6">
      Une question ? Une demande de réservation ? N'hésitez pas à nous écrire via ce formulaire.
    </p>

    <form action="https://formspree.io/f/xbjnyojp" method="POST" class="space-y-6">

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

      <div>
        <label for="message" class="block text-sm font-semibold mb-1">Message</label>
        <textarea id="message" name="message" rows="6" required
                  class="w-full p-3 rounded bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"></textarea>
      </div>

      <div class="text-center">
        <button type="submit"
                class="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition">
          Envoyer
        </button>
      </div>
    </form>

    <p class="text-sm text-center text-yellow-300 mt-8">
      Vous pouvez aussi nous écrire directement à : <br />
      <a href="mailto:livablom59@gmail.com" class="underline hover:text-yellow-200">livablom59@gmail.com</a>
    </p>

  </div>
</section>
