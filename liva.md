---
layout: default
title: LIVA
---

<div style="position: absolute; top: 20px; right: 20px; z-index: 999;">
  <a href="/LIVABLOM/" style="background-color: #222; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">
    Accueil
  </a>
</div>

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
  <h1>LIVA – "Maison avec parking sécurisé"</h1>
  <p>Cet hébergement élégant est parfait pour les groupes et NON FUMEURS.
Pour une réservation de plus de 3 nuits nous mettons a disposition un bip d'accès portail. Carrefour market est en face du logement GAYANT EXPO est a 10 minutes en voiture.
De nombreux restaurants a 10 minutes du logement.( LE BUREAU, PANDA WOK, VOLFONI, GUR KEBAB, MC DO, QUICK ETC .)
Une friterie est a côté du logement.</p>
</center>

<div style="text-align: center; position: relative; max-width: 100%; margin: auto;">
  <img id="carousel" src="assets/images/salon1.jpg" alt="Diaporama" style="width: 400px; max-width: 100%; height: auto; border-radius: 12px; transition: opacity 0.5s ease;">
  <div style="margin-top: 10px;">
    <button onclick="prevImage()" style="background: #333; color: white; padding: 8px 16px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
    <button onclick="nextImage()" style="background: #333; color: white; padding: 8px 16px; border: none; border-radius: 6px;">➡️</button>
  </div>
</div>

<script>
  const images = [
    "assets/images/salon.jpg",
    "assets/images/chaise.jpg",
    "assets/images/espacerepas.jpg"
"
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
  <p>Bonjour, ce logement entier type maison est tout équipé de la cuisine au salon jusqu'au chambres et salle de bain.
Un accès sécurisé par un portail et digicode ( code communiqué une heure avant l'arrivée).
La voiture sera donc en sécurité dans une cour.
Une fois dans le logement vous vous sentirez chez vous que ce soit pour un court ou long séjour.</p>
  <p>Salon avec canapé et TV Netflix. Logement non-fumeur (zone fumeurs à l'extérieur).</p>
  <p>Arrivée et départ en totale autonomie.</p>
</section>

<section>
  <h2>Infos pratiques</h2>
  <ul>
    <li>Nombre de voyageurs : 5 maximum</li>
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

