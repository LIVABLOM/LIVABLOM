---
layout: default
title: Confirmation de réservation
---

<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Confirmation Paiement</title>
  <style>
    body {
      font-family: 'Helvetica Neue', sans-serif;
      text-align: center;
      padding: 50px;
      background: #f5f5f5;
      color: #17252a;
    }
    h1 {
      color: #2b7a78;
      font-size: 2rem;
    }
    .success { color: #2b7a78; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .recap {
      background: #ffffff;
      display: inline-block;
      text-align: left;
      padding: 20px 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      margin-top: 20px;
      line-height: 1.6;
      font-size: 1rem;
    }
    a {
      text-decoration: none;
      color: #17252a;
      font-weight: bold;
      display: inline-block;
      margin-top: 30px;
      padding: 10px 20px;
      background: #2b7a78;
      border-radius: 8px;
      color: white;
    }
    a:hover { background: #3a9e8d; }
  </style>
</head>
<body>
  <h1>Merci pour votre réservation !</h1>
  <p id="message"></p>

  <div class="recap">
    <h2>Récapitulatif du séjour</h2>
    <p><strong>Logement :</strong> <span id="recapLogement">Non renseigné</span></p>
    <p><strong>Date d’arrivée :</strong> <span id="recapDate">Non renseignée</span></p>
    <p><strong>Nombre de nuits :</strong> <span id="recapNuits">Non renseigné</span></p>
    <p><strong>Montant payé :</strong> <span id="recapMontant">Non renseigné</span> €</p>
  </div>

  <a href="/blom/">Retour à BLŌM</a>

  <script>
    const params = new URLSearchParams(window.location.search);
    const msg = document.getElementById('message');

    if (params.get('success') === 'true') {
      msg.textContent = "Votre paiement a été effectué avec succès ✅";
      msg.className = "success";
    } else {
      msg.textContent = "Le paiement a été annulé ou a échoué ❌";
      msg.className = "error";
    }

    // Récupérer les informations du séjour depuis l'URL
    document.getElementById('recapLogement').textContent = params.get('logement') || 'Non renseigné';
    const dateStr = params.get('date') ? new Date(params.get('date')).toLocaleDateString('fr-FR') : 'Non renseignée';
    document.getElementById('recapDate').textContent = dateStr;
    document.getElementById('recapNuits').textContent = params.get('nuits') || 'Non renseigné';
    document.getElementById('recapMontant').textContent = params.get('montant') || 'Non renseigné';
  </script>
</body>
</html>
