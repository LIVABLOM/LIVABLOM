---
layout: default
title: BLōM
---

<style>
  body {
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

<div style="text-align: center; position: relative; max-width: 100%; margin: auto;">
  <img id="carousel" src="assets/images/image-jacuzzi.png" alt="Diaporama" style="width: 400px; max-width: 100%; height: auto; border-radius: 12px; transition: opacity 0.5s ease;">
  <div style="margin-top: 10px;">
    <button onclick="prevImage()" style="background: #333; color: white; padding: 8px 16px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
    <button onclick="nextImage()" style="background: #333; color: white; padding: 8px 16px; border: none; border-radius: 6px;">➡️</button>
  </div>
</div>

<script>
  const images = [
    "assets/images/image-jacuzzi.png",
    "assets/images/femmemur.jpg",
    "assets/images/sceau.jpg"
  ];
  let index = 0;
  const imgElement = document.getElementById("carousel");

  function showImage(i) {
    imgElement.style.opacity = 0;
    setTimeout(() => {
      imgElement.src = images[i];
      imgElement.style.opacity = 1;
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
</script>



<section>
  <h2>Le logement</h2>
  <p>Maison d'hôte avec accès sécurisé par digicode. Au rez-de-chaussée : jacuzzi, salon, salle à manger avec petit frigo et micro-ondes. À l'étage : grande chambre avec lit King Size, salle de massage et salle de douche.</p>
  <p>Salon avec canapé et TV Netflix. Petit déjeuner offert, servi en toute intimité. Logement non-fumeur (zone fumeurs à l'extérieur).</p>
  <p>Arrivée et départ en totale autonomie. Jacuzzi vidé et rempli avec vidéo de preuve le jour de votre arrivée.</p>
</section>

<section>
  <h2>Infos pratiques</h2>
  <ul>
    <li>Nombre de voyageurs : 2 maximum</li>
    <li>Prix par nuit : 160€</li>
    <li>10 min de Douai et Gayant Expo</li>
    <li>Friterie juste à côté, nombreux restaurants à 5 min</li>
  </ul>
</section>

## 💬 Ce que disent nos visiteurs

<section id="avis-clients" style="padding: 40px 20px;">
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">

    <div style="border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(255,255,255,0.1);">
      <p style="font-style: italic;">“Une pépite ! Un hote très sympathique...”</p>
      <p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">– Emilie, mars 2025</p>
    </div>

    <div style="border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(255,255,255,0.1);">
      <p style="font-style: italic;">“Très bon moment passé...”</p>
      <p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">– Melissa, janvier 2025</p>
    </div>

    <div style="border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(255,255,255,0.1);">
      <p style="font-style: italic;">“Parfait ! La vidéo du changement...”</p>
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

<form action="https://formspree.io/f/mrbqrnav" method="POST" style="margin-top: 20px;">
  <label>Nom :<br><input type="text" name="name" required></label><br><br>
  <label>Email :<br><input type="email" name="_replyto" required></label><br><br>
  <label>Message :<br><textarea name="message" rows="4" required></textarea></label><br><br>
  <button type="submit" style="background-color: #222; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer;">
    Envoyer
  </button>
</form>

[⬅️ Retour à l’accueil](index.md)
