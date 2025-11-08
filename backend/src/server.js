import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import usersRoute from "./routes/usersRoute.js";
import suppliersRoute from "./routes/suppliersRoute.js";
import productsRoute from "./routes/productsRoute.js";
import job from "./config/cron.js";
import cors from "cors";
import { sql } from "./config/db.js";
import chatRoute from "./routes/chatRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5002;

if (process.env.NODE_ENV === "production") job.start();
app.use(rateLimiter);
// middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


app.get("/", (req, res) => 
{ res.send("It's working");
});

app.use("/api/transactions",transactionsRoute);
app.use("/api/users", usersRoute);
app.use("/api/suppliers", suppliersRoute);
app.use("/api/products", productsRoute);
app.use("/api/chat", chatRoute);
app.post("/webhook", async (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;
    const lang = req.body.queryResult.languageCode || "fr";
    let text = "";

    // === Liste des fournisseurs ===
    if (intent === "ListeFournisseurs") {
      const result = await sql`SELECT name FROM suppliers`;
      const names = result.map(r => r.name).join(", ");
      text = lang === "fr"
        ? `Voici la liste des fournisseurs : ${names}`
        : `Here is the list of suppliers: ${names}`;
    }

    // === Liste des produits ===
    else if (intent === "ListeProduits") {
      const result = await sql`SELECT title FROM products`;
      const names = result.map(r => r.title).join(", ");
      text = lang === "fr"
        ? `Voici la liste des produits : ${names}`
        : `Here is the list of products: ${names}`;
    }

    // === Nombre total de produits ===
    else if (intent === "NombreProduits") {
      const result = await sql`SELECT COUNT(*) AS total FROM products`;
      text = lang === "fr"
        ? `Il y a ${result[0].total} produits dans le stock.`
        : `There are ${result[0].total} products in the stock.`;
    }

    // === Quantité d’un produit ===
    else if (intent === "QuantiteProduit") {
      const produit = parameters.produit?.toLowerCase();
      const result = await sql`SELECT quantity FROM products WHERE LOWER(title) = ${produit}`;
      if (result.length > 0) {
        text = lang === "fr"
          ? `Il reste ${result[0].quantity} unités de ${produit}.`
          : `There are ${result[0].quantity} units of ${produit} left.`;
      } else {
        text = lang === "fr"
          ? `Je ne trouve pas de produit nommé ${produit}.`
          : `I can't find any product named ${produit}.`;
      }
    }

    // === Valeur totale du stock ===
    else if (intent === "ValeurTotaleStock") {
      const result = await sql`SELECT SUM(amount * quantity) AS total_value FROM products`;
      const total = result[0].total_value || 0;
      text = lang === "fr"
        ? `La valeur totale du stock est de ${total} dinars.`
        : `The total stock value is ${total} dinars.`;
    }

    // === Produits en stock critique ===
    else if (intent === "StockCritique") {
      const result = await sql`SELECT title FROM products WHERE quantity < 5`;
      if (result.length > 0) {
        const names = result.map(r => r.title).join(", ");
        text = lang === "fr"
          ? `Les produits en rupture sont : ${names}`
          : `Low stock products are: ${names}`;
      } else {
        text = lang === "fr"
          ? `Aucun produit en rupture de stock.`
          : `No products are in low stock.`;
      }
    }

    // === Statistiques du stock ===
    else if (intent === "StatistiquesStock") {
      const stats = await sql`
        SELECT 
          AVG(quantity) AS avg_qty,
          MAX(quantity) AS max_qty,
          MIN(quantity) AS min_qty
        FROM products
      `;
      const s = stats[0];
      const avgQty = parseFloat(s.avg_qty) || 0;
      const maxQty = parseInt(s.max_qty) || 0;
      const minQty = parseInt(s.min_qty) || 0;
      text = lang === "fr"
        ? `Moyenne: ${s.avg_qty.toFixed(2)}, Max: ${s.max_qty}, Min: ${s.min_qty}.`
        : `Average: ${s.avg_qty.toFixed(2)}, Max: ${s.max_qty}, Min: ${s.min_qty}.`;
    }

    // === Intent inconnu ===
    else {
      text = lang === "fr"
        ? "Je n’ai pas compris la question, peux-tu la reformuler ?"
        : "I didn’t understand the question, could you please rephrase?";
    }

    res.json({ fulfillmentText: text });
  } catch (err) {
    console.error("Erreur webhook:", err);
    res.json({ fulfillmentText: "Erreur serveur interne." });
  }
});

app.get("/debug-routes", (req, res) => {
  res.json(app._router.stack
    .filter(r => r.route)
    .map(r => r.route.path));
});

const startServer = async () => {
  try {
    await initDB();
    app.listen(PORT, () =>
      console.log(` Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("Erreur init DB:", err);
  }
};

startServer();