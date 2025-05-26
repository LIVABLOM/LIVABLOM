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

<div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center;">
  <img id="carousel" src="assets/images/image-Spa.jpg" alt="Diaporama" style="max-height: 70vh; width: auto; border-radius: 12px; transition: opacity 0.5s ease;">
  <div style="margin-top: 20px;">
    <button onclick="prevImage()" style="background: #333; color: white; padding: 10px 20px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
    <button onclick="nextImage()" style="background: #333; color: white; padding: 10px 20px; border: none; border-radius: 6px;">➡️</button>
  </div>
</div>

<script>
  const images = [
  "assets/images/Spa.jpg",
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

<section id="avis-clients" style="padding: 40px 20px; background-color: #111; text-align: center;">
  <h2 style="margin-bottom: 20px;">💬 Ce que disent nos visiteurs</h2>
  <div id="carousel-avis" style="max-width: 600px; margin: 0 auto; position: relative;">
    <div id="avis-slide" style="transition: opacity 0.5s ease;"></div>
    <div style="margin-top: 20px;">
      <button onclick="prevAvis()" style="background: #333; color: white; padding: 10px 16px; margin-right: 10px; border: none; border-radius: 6px;">⬅️</button>
      <button onclick="nextAvis()" style="background: #333; color: white; padding: 10px 16px; border: none; border-radius: 6px;">➡️</button>
    </div>
  </div>
</section>

<div style="display: flex; flex-direction: column; align-items: center; margin-top: 30px;">
  <a href="https://www.airbnb.fr/rooms/985569147645507170" target="_blank" style="display: inline-block; background-color: #ff5a5f; color: black; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px; margin-bottom: 10px;">
    🔑 Réserver sur Airbnb
  </a>

  <a href="https://wa.me/33649831838" target="_blank" style="display: inline-block; background-color: #25D366; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 16px;">
    📲 Réserver via WhatsApp
  </a>
</div>

<form action="https://formspree.io/f/mrbqrnav" method="POST" style="margin-top: 30px; text-align: center;">
  <label>Nom :<br><input type="text" name="name" required></label><br><br>
  <label>Email :<br><input type="email" name="_replyto" required></label><br><br>
  <label>Message :<br><textarea name="message" rows="4" required></textarea></label><br><br>
  <button type="submit" style="background-color: #222; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-size: 15px; font-weight: bold; cursor: pointer;">
    Envoyer
  </button>
</form>

<script>
  const avisList = [
    {
      texte: "“Une pépite ! Un Abdel très sympathique, des instructions claires, une petite maison sur 2 étages, un salon cosy, une table joliment dressée, une salle de massage, un jacuzzi bien chaud, des peignoirs bien pratiques, un lit king size super confortable (dommage qu'on ne pouvait pas le ramener dans la voiture !), un petit déj bien consistant en tête à tête. Rien à redire !”",
      auteur: "– Emilie, mars 2025"
    },
    {
      texte: "“Très bon moment passé dans ce logement pour une soirée romantique. Abdel est un hôte très attentionné et disponible. Toutes les communications se font par message au long du séjour pour passer un très bon moment avec de nombreux services. Le logement est très propre, le jacuzzi nettoyé entre chaque locataire. Nous avons été très contents. La table est mise pour un dîner romantique et le petit déjeuner organisé pour l’intimité des locataires est parfait. Hôte et logement à recommander.”",
      auteur: "– Melissa, janvier 2025"
    },
    {
      texte: "“Parfait ! Parfait ! La vidéo du changement de l’eau avant notre arrivée signe le professionnalisme de ce propriétaire perfectionniste ! Logement impeccable, on avait envie d’y rester... rien à dire à part merci ☺️”",
      auteur: "– Pilon, juin 2024"
    }
  ];

  let currentAvis = 0;
  const avisContainer = document.getElementById("avis-slide");

  function renderAvis(index) {
    const avis = avisList[index];
    avisContainer.style.opacity = 0;
    setTimeout(() => {
      avisContainer.innerHTML = `
        <div style="border-radius: 16px; padding: 20px; background-color: #222; color: white;">
          <p style="font-style: italic;">${avis.texte}</p>
          <p style="font-size: 0.9em; color: #ccc; margin-top: 10px;">${avis.auteur}</p>
        </div>
      `;
      avisContainer.style.opacity = 1;
    }, 200);
  }

  function nextAvis() {
    currentAvis = (currentAvis + 1) % avisList.length;
    renderAvis(currentAvis);
  }

  function prevAvis() {
    currentAvis = (currentAvis - 1 + avisList.length) % avisList.length;
    renderAvis(currentAvis);
  }

  renderAvis(currentAvis);
</script>
