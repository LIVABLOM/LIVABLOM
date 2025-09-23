---
layout: default
title: Confirmation de réservation
---

<div style="text-align:center; padding:50px; font-family:sans-serif; background:#f5f5f5; min-height:70vh; display:flex; flex-direction:column; justify-content:center; align-items:center;">
  <img src="/assets/images/logo.png" alt="LIVABLŌM" style="width:120px; margin-bottom:30px;">
  <h1 style="color:#2b7a78; margin-bottom:20px;">Merci pour votre réservation !</h1>

  <p id="message" style="font-size:1.1rem; margin-bottom:20px;"></p>

  <div style="background:#fff; padding:20px 30px; border-radius:12px; box-shadow:0 4px 15px rgba(0,0,0,0.2); margin-bottom:20px; max-width:400px;">
    <h2 style="margin-top:0; color:#17252a;">Détails de votre réservation</h2>
    <ul style="list-style:none; padding-left:0; text-align:left; font-size:0.95rem;">
      <li><strong>Logement :</strong> <span id="logement"></span></li>
      <li><strong>Date d'arrivée :</strong> <span id="date"></span></li>
      <li><strong>Nombre de nuits :</strong> <span id="nuits"></span></li>
    </ul>
  </div>

  <a href="/blom/" style="display:inline-block; padding:12px 25px; background:#2b7a78; color:white; text-decoration:none; border-radius:8px; font-weight:bold; transition:0.3s;">Retour à BLŌM</a>
</div>

<script>
  const params = new URLSearchParams(window.location.search);
  const msg = document.getElementById('message');
  const logement = document.getElementById('logement');
  const date = document.getElementById('date');
  const nuits = document.getElementById('nuits');

  const log = params.get('logement') || '—';
  const dat = params.get('date') || '—';
  const n = params.get('nuits') || '—';

  logement.textContent = log;
  date.textContent = dat;
  nuits.textContent = n;

  if (params.get('success') === 'true') {
    msg.textContent = "Votre paiement a été effectué avec succès ✅";
    msg.style.color = "#2b7a78";
  } else {
    msg.textContent = "Le paiement a été annulé ou a échoué ❌";
    msg.style.color = "red";
  }
</script>
