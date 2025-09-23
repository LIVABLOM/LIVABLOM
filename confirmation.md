---
layout: default
title: Confirmation de réservation
---

<h1>Merci pour votre réservation !</h1>
<p id="status"></p>

<div id="recap" style="margin-top:30px; font-size:1.1rem;">
  <h2>Récapitulatif du séjour</h2>
  <p>Logement : <span id="recapLogement"></span></p>
  <p>Date d’arrivée : <span id="recapDate"></span></p>
  <p>Nombre de nuits : <span id="recapNuits"></span></p>
  <p>Montant payé : <span id="recapMontant"></span> €</p>
</div>

<a href="/blom/" style="display:inline-block; margin-top:20px; text-decoration:none; padding:10px 20px; background:#2b7a78; color:white; border-radius:8px;">Retour à BLŌM</a>

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
document.getElementById('recapDate').textContent = new Date(date).toLocaleDateString('fr-FR');
document.getElementById('recapNuits').textContent = nuits;
document.getElementById('recapMontant').textContent = montant;
</script>
