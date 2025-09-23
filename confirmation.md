---
layout: default
title: Confirmation de réservation
---

<link href="https://cdn.jsdelivr.net/npm/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: #000; /* fond noir */
    overflow-x: hidden;
    color: #fff; /* texte général blanc pour contraste */
  }

  .confirmation-container {
    max-width: 550px;
    margin: 80px auto;
    background: #ffffff; /* cadre blanc */
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    padding: 50px 35px;
    text-align: center;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeIn 0.8s forwards;
  }

  @keyframes fadeIn {
    to { opacity: 1; transform: translateY(0); }
  }

  .logo {
    max-width: 120px;
    margin-bottom: 25px;
  }

  .checkmark {
    font-size: 4rem;
    color: #2b7a78;
    margin-bottom: 20px;
  }

  h1 {
    color: #2b7a78;
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .status {
    font-size: 1.1rem;
    margin-bottom: 30px;
    font-weight: bold;
    color: #333;
  }

  .recap {
    text-align: left;
    background: #f7f9fa;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
    color: #17252a;
  }

  .recap h2 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .recap h2 i {
    color: #2b7a78;
  }

  .recap p {
    font-size: 1rem;
    margin: 8px 0;
  }

  .btn-home {
    display: inline-block;
    padding: 14px 28px;
    background: #2b7a78;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-weight: bold;
    font-size: 1rem;
    transition: 0.3s;
  }

  .btn-home:hover {
    background: #1f5f5a;
  }

  @media (max-width: 600px) {
    .confirmation-container {
      margin: 40px 20px;
      padding: 35px 20px;
    }
  }
</style>

<div class="confirmation-container">
  <img src="/assets/logo/livablom-logo.png" alt="LIVABLŌM" class="logo">
  <i class='bx bxs-check-circle checkmark'></i>
  <h1>Merci pour votre réservation !</h1>
  <p class="status" id="status"></p>

  <div class="recap">
    <h2><i class='bx bx-calendar-event'></i> Récapitulatif du séjour</h2>
    <p>Logement : <span id="recapLogement"></span></p>
    <p>Date d’arrivée : <span id="recapDate"></span></p>
    <p>Nombre de nuits : <span id="recapNuits"></span></p>
    <p>Montant payé : <span id="recapMontant"></span> €</p>
  </div>

  <a href="/blom/" class="btn-home">Retour à BLŌM</a>
</div>

<script>
const params = new URLSearchParams(window.location.search);
const status = document.getElementById('status');
const logement = params.get('logement') || 'Non renseigné';
const date = params.get('date') || 'Non renseignée';
const nuits = params.get('nuits') || 'Non renseigné';
const montant = params.get('montant') || 'Non renseigné';

status.textContent = params.get('success') === 'true'
  ? 'Votre paiement a été effectué avec succès ✅'
  : 'Le paiement a été annulé ou a échoué ❌';

document.getElementById('recapLogement').textContent = logement;
document.getElementById('recapDate').textContent = date !== 'Non renseignée' ? new Date(date).toLocaleDateString('fr-FR') : date;
document.getElementById('recapNuits').textContent = nuits;
document.getElementById('recapMontant').textContent = montant;
</script>
