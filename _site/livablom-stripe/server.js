require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Endpoint pour créer un paiement
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, captureLater } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // en centimes, ex: 169€ -> 16900
      currency: 'eur',
      payment_method_types: ['card'],
      capture_method: captureLater ? 'manual' : 'automatic', // empreinte ou paiement direct
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));

