<title> LIVABLOM
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BLōM - Petit dej offert</title>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Montserrat', sans-serif;
      background-color: #f9f9f9;
      color: #333;
    }
    header {
      background: #222;
      color: white;
      padding: 2rem;
      text-align: center;
    }
    header h1 {
      margin: 0;
      font-size: 2rem;
    }
    .hero {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 2rem 0;
    }
    .hero img {
      max-width: 300px;
      margin: 0.5rem;
      border-radius: 12px;
    }
    section {
      padding: 1.5rem;
      max-width: 800px;
      margin: auto;
    }
    section h2 {
      border-bottom: 2px solid #ddd;
      padding-bottom: 0.5rem;
      margin-top: 2rem;
    }
    form {
      display: flex;
      flex-direction: column;
    }
    form input, form textarea {
      margin: 0.5rem 0;
      padding: 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    form button {
      padding: 0.75rem;
      background: #222;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
    footer {
      text-align: center;
      padding: 1rem;
      background: #eee;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>BLōM – "Petit dej offert"</h1>
    <p>Maison d'hôte avec spa privatif, salle de massage, lit King Size et petit déjeuner offert</p>
  </header>

  <div class="hero">
    <img src="image-jacuzzi.png" alt="Spa haut de gamme">
    <img src="image-jacuzzi.png" alt="Jets et ambiance">
    <img src="image-jacuzzi.png" alt="Jacuzzi BLōM">
  </div>

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

  <section>
    <h2>Contact</h2>
    <form action="https://formspree.io/f/moqgdowv" method="POST">
      <input type="text" name="name" placeholder="Votre nom" required>
      <input type="email" name="email" placeholder="Votre e-mail" required>
      <textarea name="message" rows="5" placeholder="Votre message" required></textarea>
      <button type="submit">Envoyer</button>
    </form>
  </section>

  <footer>
    <p>© 2025 BLōM – Contact : <a href="mailto:livablom59@gmail.com">livablom59@gmail.com</a></p>
  </footer>
</body>
</html>

---

