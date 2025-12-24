import express from "express";
import { sql } from "../config/db.js";
import { askLLM } from "../services/ollama.js";

const router = express.Router();

/**
 * Détection simple d’intention
 */
function detectIntent(message) {
  const text = message.toLowerCase();

  if (text.includes("rupture")) return "OUT_OF_STOCK";
  if (text.includes("faible")) return "LOW_STOCK";
  if (text.includes("stock")) return "ALL_STOCK";
  if (text.includes("prix")) return "PRICE";
  if (text.includes("bonjour") || text.includes("salut")) return "HELLO";

  return "UNKNOWN";
}
function isStockQuestion(intent) {
  return [
    "OUT_OF_STOCK",
    "LOW_STOCK",
    "ALL_STOCK",
    "PRICE",
    "HELLO",
  ].includes(intent);
}
/**
 * Endpoint chatbot
 */
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message manquant" });
    }

    const intent = detectIntent(message);

    // 👋 SALUTATION
    if (intent === "HELLO") {
      return res.json({ reply: "Bonjour 👋 Comment puis-je vous aider ?" });
    }

    // 🚨 PRODUITS EN RUPTURE
    if (intent === "OUT_OF_STOCK") {
      const rows = await sql`
        SELECT title FROM products WHERE quantity = 0
      `;

      if (rows.length === 0) {
        return res.json({ reply: "Aucun produit en rupture de stock." });
      }

      return res.json({
        reply:
          "🚨 Produits en rupture :\n" +
          rows.map(r => `- ${r.title}`).join("\n"),
      });
    }

    // ⚠️ STOCK FAIBLE
    if (intent === "LOW_STOCK") {
      const rows = await sql`
        SELECT title, quantity FROM products WHERE quantity < 5
      `;

      if (rows.length === 0) {
        return res.json({ reply: "Aucun produit avec stock faible." });
      }

      return res.json({
        reply:
          "⚠️ Stock faible :\n" +
          rows.map(r => `- ${r.title} (stock ${r.quantity})`).join("\n"),
      });
    }

    // 📦 LISTE STOCK
    if (intent === "ALL_STOCK") {
      const rows = await sql`
        SELECT title, quantity, amount FROM products ORDER BY title
      `;

      return res.json({
        reply:
          "📦 Stock actuel :\n" +
          rows
            .map(
              r =>
                `- ${r.title} | Stock: ${r.quantity} | Prix: ${r.amount} TND`
            )
            .join("\n"),
      });
    }

    // 💰 PRIX PRODUIT
    if (intent === "PRICE") {
      const keyword = message.split(" ").pop();

      const rows = await sql`
        SELECT title, amount FROM products
        WHERE title ILIKE ${"%" + keyword + "%"}
        LIMIT 1
      `;

      if (rows.length === 0) {
        return res.json({ reply: "Produit introuvable." });
      }

      return res.json({
        reply: `💰 Prix de ${rows[0].title} : ${rows[0].amount} TND`,
      });
    }

    // 🤖 FALLBACK
// 🤖 QUESTION GÉNÉRALE → LLM
if (!isStockQuestion(intent)) {
  const llmReply = await askLLM(
    `Réponds clairement en français : ${message}`
  );

  return res.json({
    reply: llmReply || "Je n'ai pas pu générer de réponse."
  });
}

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ reply: "Erreur serveur chatbot" });
  }
});

export default router;
