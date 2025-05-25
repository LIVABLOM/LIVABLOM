---
layout: default
title: BLōM
---

<div style="position: absolute; top: 20px; right: 20px; z-index: 999;">
  <a href="/LIVABLOM/" style="background-color: #222; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
    Accueil
  </a>
</div>

<style>
  html, body {
    max-width: 100%;
    overflow-x: hidden;
    background-color: black;
    color: white;
    font-family: sans-serif;
  }
  a {
    color: #25D366;
  }
  section, h1, h2, p, ul, li {
    color: white;
  }
  #avis-clients {
    background-color: #111;
  }
  #avis-clients div {
    background-color: #222 !important;
    color: white !important;
  }
  input, textarea {
    background-color: #333;
    color: white;
    border: 1px solid #666;
  }
</style>

<center>
  <h1>BLōM – "Petit dej offert"</h1>
  <p>Maison d'hôte avec spa privatif, salle de massage, lit King Size et petit déjeuner offert</p>
</center>

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; text-align: center; padding: 0 10px; box-sizing: border-box;">
  <img id="carousel" src="assets/images/image-jacuzzi.png" alt="Diaporama" style="max-height: 70vh; max-width: 100%; height: auto; width: auto; border-radius: 12px; transition: opacity 0.5s ease;">
  <div style="margin-top: 20px;">
    <button onclick="prevImage()" style="background: #333; color: white; padding: 10px 20px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
    <button onclick="nextImage()" style="background: #333; color: white; padding: 10px 20px; border: none; border-radius: 6px;">➡️</button>
  </div>
</div>

<script>
  const images = [
    "assets/images/image-jacuzzi.png",
    "assets/images/femmemur.jpg",
    "assets/images/table.jpg",
    "assets/images/sceau.jpg"
  ];
  let index = 0;
  const imgElement = document.getElementById("carousel");

  function showImage(i) {
    imgElement.style.opacity = 0;
    setTimeout(() => {
      imgElement.src = images[i];
      imgElement.style.opacity = 1;
      scrollToImage();
    }, 200);
  }

  function nextImage() {
    index = (index + 1) % images.length;
    showImage(index);
  }

  function prevImage() {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
  }

  function scrollToImage() {
    const imageContainer = imgElement.parentElement;
    imageContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }
</script>

<section>
  <h2>Le logement</h2>
  <p>Maison d'hôte avec accès sécurisé par digicode. Au rez-de-chaussée : jacuzzi, salon, salle à manger avec petit frigo et micro-ondes. À l'étage : grande chambre avec lit King Size, salle de massage et salle de douche.</p>
  <p>Salon avec canapé et TV Netflix. Petit déjeuner offert, servi en toute intimité. Logement non-fumeur (zone fumeurs à l'extérieur).</p>
  <p style="background: linear-gradient(90deg, #ff5a5f, #ffb347); color: black; font-weight: bold; padding: 12px 16px; border-radius: 8px; font-size: 16px; text-align: center; margin: 20px 0;">
    ✅ Votre jacuzzi est vidé et re-rempli le jour de votre arrivée. Une vidéo vous est transmise pour preuve.
  </p>
</section>

<section>
  <h2>Infos pratiques</h2>
  <ul>
    <li>Nombre de voyageurs : 2 maximum</li>
    <li>10 min de Douai et Gayant Expo</li>
    <li>Friterie juste à côté, nombreux restaurants à 5 min</li>
  </ul>
</section>

<section>
  <h2>Nos formules</h2>
  <p>Découvrez nos différentes offres disponibles à la nuitée ou à la journée, du lundi au dimanche :</p>
  <ul>
    <li><strong>Lundi au jeudi (nuitée) :</strong> 140 euros</li>
    <li><strong>Vendredi (nuitée) :</strong> 180 euros</li>
    <li><strong>Samedi (nuitée) :</strong> 180 euros</li>
    <li><strong>Dimanche (journée ou nuitée) :</strong> 200 euros</li>
    <li><strong>Formule journée (11h - 17h) :</strong> 150 euros</li>
    <li><strong>Formule journée 4H :</strong> 110 euros</li>
  </ul>
  <p style="margin-top: 10px;">Pour toute réservation ou demande spécifique, contactez-nous directement via WhatsApp ou le formulaire ci-dessous.</p>
</section>

## 💬 Ce que disent nos visiteurs

<section id="avis-clients" style="padding: 40px 20px;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">

    <div style="border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(255,255,255,0.1);">
      <p style="font-style: italic;">“Une pépite ! Un Abdel très sympathique, des instructions claires, une petite maison sur 2 étages, un salon cosy, une table joliment dressée, une salle de massage, un jacuzzi bien chaud, des peignoirs bien pratiques, un lit king size super confortable (dommage qu'on ne pouvait pas le ramener dans la voiture !), un petit déj bien consistant en tête à tête. Rien à redire !”</p>
      <p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">– Emilie, mars 2025</p>
    </div>

    <div style="border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(255,255,255,0.1);">
      <p style="font-style: italic;">“Très bon moment passé dans ce logement pour une soirée romantique. Abdel est un hôte très attentionné et disponible. Toutes les communications se font par message au long du séjour pour passer un très bon moment avec de nombreux services. Le logement est très propre, le jacuzzi nettoyé entre chaque locataire. Nous avons été très contents. La table est mise pour un dîner romantique et le petit déjeuner organisé pour l’intimité des locataires est parfait. Hôte et logement à recommander.”</p>
      <p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">– Melissa, janvier 2025</p>
    </div>

    <div style="border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(255,255,255,0.1);">
      <p style="font-style: italic;">“Parfait ! Parfait ! La vidéo du changement de l’eau avant notre arrivée signe le professionnalisme de ce propriétaire perfectionniste ! Logement impeccable, on avait envie d’y rester... rien à dire à part merci ☺️”</p>
      <p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">– Pilon, juin 2024</p>
    </div>

  </div>
</section>

<a href="https://www.airbnb.fr/rooms/985569147645507170" target="_blank" style="display: inline-block; background-color: #ff5a5f; color: black; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-top: 20px; font-size: 16px;">
  🔑 Réserver sur Airbnb
</a>

<a href="https://wa.me/33649831838" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-top: 10px; font-size: 16px;">
  📲 Réserver via WhatsApp
</a>

<form action="https://formspree.io/f/mrbqrnav" method="POST" style="m
