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
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
  #avis-clients {
    background-color: #111;
    overflow: hidden;
  }
  #avis-carousel {
    display: flex;
    transition: transform 0.5s ease-in-out;
  }
  .avis {
    min-width: 100%;
    box-sizing: border-box;
    padding: 20px;
    background-color: #222;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(255,255,255,0.1);
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

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center;">
  <img id="carousel" src="assets/images/salon1.jpg" alt="Diaporama" style="max-height: 70vh; width: auto; border-radius: 12px; transition: opacity 0.5s ease;">
  <div style="margin-top: 20px;">
    <button onclick="prevImage()" style="background: #333; color: white; padding: 10px 20px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
    <button onclick="nextImage()" style="background: #333; color: white; padding: 10px 20px; border: none; border-radius: 6px;">➡️</button>
  </div>
</div>

<script>
  const images = [
    "assets/images/salon.jpg",
    "assets/images/chaise.jpg",
    "assets/images/espacerepas.jpg"
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
    <li>Prix par nuit : 89€/2 Personnes</li>
    <li>10 min de Douai et Gayant Expo</li>
    <li>Fr
