---
layout: default
title: Confirmation Paiement
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Confirmation Paiement</title>
  <style>
    body {
      font-family: 'Helvetica Neue', sans-serif;
      background: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      color: #17252a;
    }
    .container {
      background: #ffffff;
      padding: 40px 30px;
      border-radius: 16px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    h1 {
      color: #2b7a78;
      font-size: 1.8rem;
      margin-bottom: 10px;
    }
    .success-icon {
      font-size: 3rem;
      color: #3b82f6;
      margin-bottom: 20px;
    }
    p {
      margin: 8px 0;
      font-size: 1rem;
    }
    .summary {
      background: #e0f2f1;
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      text-align: left;
      font-size: 0.95rem;
    }
    .summary p { margin: 6px 0; }
    .btn {
      display: inline-block;
      padding: 12px 24px;
      margin: 8px;
      background: #3b82f6;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      transition: background 0.3s;
    }
    .btn:hover { background: #2563eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">✅</div>
    <h1>Merci pour votre réservation !</h1>
    <p id="statusMessage"></p>

    <div class="summary">
      <h3>Récapitulatif du séjour</h3>
      <p><strong>Logement :</strong> <span id="logement"></span></p>
      <p><strong>Date d’arrivée :</strong> <span id="dateArrivee"></span></p>
      <p><strong>Nombre de nuits :</strong> <span id="nuits"></span></p>
      <p><strong>Montant payé :</strong> <span id="montant"></span> €</p>
    </div>

    <a href="/blom/" class="btn">Retour à BLŌM</a>
    <a href="/blom-calendrier/" class="btn">Voir le calendrier</a>
  </div>

  <script>
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success') === 'true';
    const logement = params.get('logement') || 'Non renseigné';
    const date = params.get('date') || 'Non renseignée';
    const nuits = params.get('nuits') || 'Non renseigné';
    const montant = params.get('montant') || 'Non renseigné';

    document.getElementById('statusMessage').textContent = success 
      ? "Votre paiement a été effectué avec succès !" 
      : "Le paiement a été annulé ou a échoué ❌";

    document.getElementById('logement').textContent = logement;
    document.getElementById('dateArrivee').textContent = date;
    document.getElementById('nuits').textContent = nuits;
    document.getElementById('montant').textContent = montant;
  </script>
</body>
</html>
