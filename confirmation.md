---
layout: default
title: Confirmation Réservation
---

<div style="max-width:600px; margin:50px auto; background:#f5f5f5; padding:30px; border-radius:12px; text-align:center; font-family:sans-serif;">
  <h1 style="color:#2b7a78;">Merci pour votre réservation !</h1>
  <p id="message" style="font-size:1.1rem; margin-bottom:20px;"></p>

  <h2>Récapitulatif du séjour</h2>
  <ul style="list-style:none; padding:0; font-size:1rem; text-align:left;">
    <li><strong>Logement :</strong> <span id="recapLogement"></span></li>
    <li><strong>Date d’arrivée :</strong> <span id="recapDate"></span></li>
    <li><strong>Nombre de nuits :</strong> <span id="recapNuits"></span></li>
    <li><strong>Montant payé :</strong> <span id="recapMontant"></span> €</li>
  </ul>

  <a href="/blom/" style="display:inline-block; margin-top:20px; padding:10px 20px; background:#2b7a78; color:white; text-decoration:none; border-radius:8px;">Retour à BLŌM</a>
</div>

<script>
  const params = new URLSearchParams(window.location.search);

  const success = params.get('success') === 'true';
  document.getElementById('message').textContent = success 
    ? "Votre paiement a été effectué avec succès ✅"
    : "Le paiement a été annulé ou a échoué ❌";
  document.getElementById('message').style.color = success ? 'green' : 'red';

  document.getElementById('recapLogement').textContent = params.get('logement') || 'Non renseigné';
  document.getElementById('recapDate').textContent = params.get('date') || 'Non renseignée';
  document.getElementById('recapNuits').textContent = params.get('nuits') || 'Non renseigné';
  document.getElementById('recapMontant').textContent = params.get('montant') || 'Non renseigné';
</script>
