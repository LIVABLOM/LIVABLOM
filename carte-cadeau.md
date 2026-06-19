---
layout: default
title: Carte cadeau LIVABLŌM
---

<section class="bg-black text-white min-h-screen flex flex-col justify-center items-center py-20 px-6 relative overflow-hidden">

  <!-- Dégradé subtil derrière le titre -->
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-64 bg-gradient-to-b from-yellow-200/10 to-black rounded-b-full -z-10"></div>

  <!-- Effet lumière animée derrière les boutons -->
  <div class="absolute w-full h-80 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-glow -z-20"></div>

  <!-- Titre principal -->
  <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 tracking-wide text-center">
    🎁 Offrez une parenthèse bien-être
  </h1>

  <!-- Introduction -->
  <p class="text-lg sm:text-xl text-gray-300 mb-16 text-center max-w-3xl">
    Faites plaisir à vos proches avec une <strong>carte cadeau LIVABLŌM</strong>, 
    valable sur l’ensemble de nos prestations BLŌM.  
    Idéal pour un anniversaire, la Saint-Valentin, Noël ou simplement pour faire plaisir.
  </p>

  <!-- Sous-titre -->
  <h2 class="text-3xl font-semibold mb-10 text-center">
    💳 Choisissez le montant
  </h2>

  <!-- Boutons Stripe -->
  <div class="flex flex-col sm:flex-row justify-center items-center gap-10 mb-12 w-full max-w-4xl">
    
    <div class="paiement flex flex-col items-center">
      <span class="text-2xl mb-2">💐 50€</span>
      <stripe-buy-button
        buy-button-id="buy_btn_1Sms4SIWRH02GJbecmxAKGAr"
        publishable-key="pk_live_51RgYd9IWRH02GJbeI26kTmFzkNFPUc9asYk3qTVT2NrOqCUB3Y9DkhSOV6GP50tWbBcJscjYDSRiIT3DDC3MRtkC00gtwbJ9U4">
      </stripe-buy-button>
    </div>

    <div class="paiement flex flex-col items-center">
      <span class="text-2xl mb-2">🌸 100€</span>
      <stripe-buy-button
        buy-button-id="buy_btn_1Sms7IIWRH02GJbeLOWI8wXW"
        publishable-key="pk_live_51RgYd9IWRH02GJbeI26kTmFzkNFPUc9asYk3qTVT2NrOqCUB3Y9DkhSOV6GP50tWbBcJscjYDSRiIT3DDC3MRtkC00gtwbJ9U4">
      </stripe-buy-button>
    </div>

    <div class="paiement flex flex-col items-center">
      <span class="text-2xl mb-2">🌺 150€</span>
      <stripe-buy-button
        buy-button-id="buy_btn_1Sms8gIWRH02GJbeP74tfZCH"
        publishable-key="pk_live_51RgYd9IWRH02GJbeI26kTmFzkNFPUc9asYk3qTVT2NrOqCUB3Y9DkhSOV6GP50tWbBcJscjYDSRiIT3DDC3MRtkC00gtwbJ9U4">
      </stripe-buy-button>
    </div>

  </div>

  <!-- EXPLICATION UTILISATION -->
  <div class="max-w-3xl text-center mb-16 px-4">
    <p class="text-xl text-gray-200 font-medium">
      ✨ Les cartes cadeaux LIVABLŌM sont des <strong>bons de valeur</strong>.
    </p>
    <p class="text-lg text-gray-400 mt-4">
      Elles peuvent être utilisées comme <strong>acompte ou complément</strong> lors de la réservation 
      d’une prestation (nuitée, formule journée…).  
      Le bénéficiaire règle simplement la différence si le montant de la carte ne couvre pas 
      l’intégralité de la prestation.
    </p>
  </div>

  <!-- Bloc informations importantes -->
  <div class="bg-gray-900 p-10 rounded-2xl max-w-3xl text-left shadow-lg">
    <h3 class="text-2xl font-semibold mb-4">ℹ️ Informations importantes</h3>
    <ul class="list-disc list-inside space-y-2 text-gray-300 text-lg">
      <li>Les cartes cadeaux <strong>ne constituent pas une réservation</strong>.</li>
      <li>Elles sont utilisables comme <strong>acompte ou complément de paiement</strong>.</li>
      <li>L’utilisation est <strong>soumise à disponibilité</strong>.</li>
      <li>La réservation se fait via notre formulaire habituel.</li>
      <li>La carte cadeau est valable <strong>12 mois</strong> après achat.</li>
      <li>Une confirmation est envoyée par email après paiement.</li>
    </ul>
  </div>

</section>
