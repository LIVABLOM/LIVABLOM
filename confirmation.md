---
layout: default
title: Confirmation de réservation
---

<div style="text-align:center; font-family:sans-serif; padding:50px; background:#f5f5f5;">
  <h1 style="color:#2b7a78;">Merci pour votre réservation !</h1>
  <div id="message" style="margin:20px 0; font-size:1.1rem;"></div>

  <div id="details" style="background:#fff; padding:20px; border-radius:12px; display:inline-block; text-align:left; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    <p><strong>Logement :</strong> <span id="logement"></span></p>
    <p><strong>Date d’arrivée :</strong> <span id="date"></span></p>
    <p><strong>Nombre de nuits :</strong> <span id="nuits"></span></p>
  </div>

  <div style="margin-top:30px;">
    <a href="/blom/" style="display:inline-block; padding:12px 25px; background:#2b7a78; color:white; border-radius:8px; text-decoration:none;">Retour à BLŌM</a>
  </div>
</div>

<script>
  const params = new URLSearchParams(window.location.search);
  const msg = document.getElementById('message');
  const logementEl = document.getElementById('logement');
  const dateEl = document.getElementById('date');
  const nuitsEl = document.getElementById('nuits');

  if (params.get('success') === 'true') {
    msg.textContent = "Votre paiement a été effectué avec succès ✅";
    msg.style.color = "green";
  } else {
    msg.textContent = "Le paiement a été annulé ou a échoué ❌";
    msg.style.color = "red";
  }

  logementEl.textContent = params.get('logement') || "Non renseigné";
  dateEl.textContent = params.get('date') ? new Date(params.get('date')).toLocaleDateString('fr-FR') : "Non renseignée";
  nuitsEl.textContent = params.get('nuits') || "Non renseigné";
</script>
