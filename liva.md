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
    margin: 0;
    padding: 0;
    overflow-x: hidden;
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
  #avis-clients .avis-item {
    background-color: #222 !important;
    color: white !important;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(255,255,255,0.1);
    transition: opacity 0.5s ease;
    min-height: 160px;
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
    <li>Friterie juste à côté, nombreux restaurants à 5 min</li>
  </ul>
</section>

## 💬 Ce que disent nos visiteurs

<section id="avis-clients" style="padding: 40px 20px; text-align: center;">
  <div id="avis-container" style="max-width: 600px; margin: 0 auto; position: relative;">
    <div class="avis-item" id="avis-slide"></div>
    <div style="margin-top: 20px;">
      <button onclick="prevAvis()" style="background: #333; color: white; padding: 10px 20px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
      <button onclick="nextAvis()" style="background: #333; color: white; padding: 10px 20px; border: none; border-radius: 6px;">➡️</button>
    </div>
  </div>
</section>

<script>
  const avisList = [
    {
      texte: "“Conforme aux photos, très bien décoré, on se sent réellement chez soi. Literie confortable. Top! Rien à redire!...”",
      auteur: "– Joelle, Avril 2025"
    },
    {
      texte: "“Charmante petite maison au calme, bonne literie,  hôte réactif, stationnement privé et sécurisé, commerce aux alentours,  séjour appréciée grâce à tout ces points positifs.”",
      auteur: "– Lelievre, Avril 2025"
    },
    {
      texte: "“Super logement !  J’ai passé une nuit dans cet Airbnb et tout s’est très bien déroulé. Le logement était propre, facile d’accès, et les instructions de l’hôte étaient claires. Je recommande sans hésiter !”",
      auteur: "– Victoire, Mars 2025"
    }
  ];

  let avisIndex = 0;
  const avisSlide = document.getElementById("avis-slide");

  function renderAvis(i) {
    avisSlide.style.opacity = 0;
    setTimeout(() => {
      avisSlide.innerHTML = `<p style="font-style: italic;">${avisList[i].texte}</p><p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">${avisList[i].auteur}</p>`;
      avisSlide.style.opacity = 1;
    }, 200);
  }

  function nextAvis() {
    avisIndex = (avisIndex + 1) % avisList.length;
    renderAvis(avisIndex);
  }

  function prevAvis() {
    avisIndex = (avisIndex - 1 + avisList.length) % avisList.length;
    renderAvis(avisIndex);
  }

  renderAvis(avisIndex);
</script>

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
