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
import chatRoute from "./src/routes/chatRoute.js";

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
    let responseText = "";

    // Intent 1 : nombre total de produits
    if (intent === "NombreProduits") {
      const result = await sql`SELECT COUNT(*) AS total FROM products`;
      responseText = `Il y a ${result[0].total} produits enregistrés dans le stock.`;
    }

    // Intent 2 : quantité d’un produit spécifique
    else if (intent === "QuantiteProduit") {
      const produit = parameters.produit?.toLowerCase();
      const result = await sql`
        SELECT quantity 
        FROM products 
        WHERE LOWER(title) = LOWER(${produit})
      `;
      if (result.length > 0) {
        responseText = `Il reste ${result[0].quantity} unités de ${produit}.`;
      } else {
        responseText = `Je ne trouve pas de produit nommé ${produit}.`;
      }
    }

    // Intent inconnu
    else {
      responseText = "Je n’ai pas compris la question, peux-tu la reformuler ?";
    }

    // Réponse à Dialogflow
    res.json({ fulfillmentText: responseText });

  } catch (error) {
    console.error("Erreur webhook:", error);
    res.json({ fulfillmentText: "Erreur interne du serveur." });
  }
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