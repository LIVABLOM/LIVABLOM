---
layout: default
title: Confirmation de réservation
---

<style>
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f4f8;
    color: #333;
    margin: 0;
    padding: 0;
  }
  .confirmation-container {
    max-width: 500px;
    margin: 80px auto;
    background: white;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    text-align: center;
  }
  .confirmation-container h1 {
    color: #2b7a78;
    font-size: 1.8rem;
    margin-bottom: 10px;
  }
  .confirmation-container p.status {
    font-size: 1.1rem;
    margin-bottom: 30px;
    font-weight: bold;
  }
  .confirmation-container .recap h2 {
    font-size: 1.3rem;
    margin-bottom: 15px;
    color: #17252a;
  }
  .confirmation-container .recap p {
    font-size: 1rem;
    margin: 6px 0;
  }
  .btn-home {
    display: inline-block;
    margin-top: 25px;
    padding: 12px 25px;
    background: #2b7a78;
    color: white;
    text-decoration: none;
    border-radius: 10px;
    font-weight: bold;
    transition: 0.3s;
  }
  .btn-home:hover {
    background: #1f5f5a;
  }
</style>

<div class="confirmation-container">
  <h1>Merci pour votre réservation !</h1>
  <p class="status" id="status"></p>

  <div class="recap">
    <h2>Récapitulatif du séjour</h2>
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
