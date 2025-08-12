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
        <label for="message" class="block text-sm font-semibold mb-1">Message</label>
        <textarea id="message" name="message" rows="6" required
                  class="w-full p-3 rounded bg-gray-900 text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-300"></textarea>
      </div>

      <!-- reCAPTCHA visible -->
      <div class="g-recaptcha" data-sitekey="6LcYg6ErAAAAALJjzA7BQOPxvqtdbnebR_d9Lepu" data-callback="enableSubmit"></div>

      <div class="text-center">
        <button type="submit" id="submitBtn" disabled
                class="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 transition cursor-not-allowed">
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

<!-- Flatpickr (CSS + JS) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
<script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>

<!-- Google reCAPTCHA -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<script>
  // Init calendrier Flatpickr
  flatpickr("#dates", {
    mode: "range",
    dateFormat: "d/m/Y",
    minDate: "today",
    locale: {
      firstDayOfWeek: 1
    }
  });

  // Active le bouton Envoyer quand captcha validé
  function enableSubmit() {
    const btn = document.getElementById('submitBtn');
    btn.disabled = false;
    btn.classList.remove('cursor-not-allowed');
  }
</script>
