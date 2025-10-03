// Clé publique live Stripe
const stripe = Stripe("pk_live_51RgYd9IWRH02GJbeI26kTmFzkNFPUc9asYk3qTVT2NrOqCUB3Y9DkhSOV6GP50tWbBcJscjYDSRiIT3DDC3MRtkC00gtwbJ9U4"); // 🔑 remplace par ta clé publique live

document.getElementById('checkout').addEventListener('click', async () => {
  // Données de la réservation
  const body = {
    date: "2025-09-10",
    logement: "BLŌM",
    nuits: 2,
    prix: 150
  };

  try {
    const res = await fetch('https://livablom-stripe-production.up.railway.app/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    window.location.href = data.url; // Redirection vers Stripe
  } catch (err) {
    console.error(err);
    alert('Erreur création session Stripe');
  }
});
