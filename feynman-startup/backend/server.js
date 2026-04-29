import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import Stripe from "stripe";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET);
const GEMINI_KEY = process.env.GEMINI_API_KEY;

// ===== IA =====
async function gemini(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

// ===== ENDPOINT IA =====
app.post("/generate", async (req, res) => {
  const { text } = req.body;
  const result = await gemini("Explique e crie estudo: " + text);
  res.json({ result });
});

// ===== PAGAMENTO =====
app.post("/create-checkout", async (req, res) => {

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],

    line_items: [{
      price_data: {
        currency: "brl",
        product_data: { name: "Feynman Premium" },
        unit_amount: 2900
      },
      quantity: 1
    }],

    subscription_data: {
      trial_period_days: 7
    },

    success_url: "https://SEU-FRONTEND.vercel.app/sucesso",
    cancel_url: "https://SEU-FRONTEND.vercel.app"
  });

  res.json({ url: session.url });
});

app.get("/", (req, res) => {
  res.send("API online 🚀");
});

app.listen(process.env.PORT || 3000);