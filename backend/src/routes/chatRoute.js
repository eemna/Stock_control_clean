// routes/chatRoute.js
import express from "express";
import { detectIntent } from "../chatbot/chatbot.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message requis" });
    }

    const result = await detectIntent(message);
    res.json({
  reply: result.fulfillmentText,
  intent: result.intent.displayName,
});

  } catch (error) {
  console.error("Erreur /api/chat :", error.message || error);
  res.status(500).json({ error: "Erreur interne du serveur", details: error.message });
}

});
// Route GET pour tester facilement depuis le navigateur
router.get("/", (req, res) => {
  res.send("✅ Chat API is running. Use POST /api/chat to send messages.");
});

export default router;
