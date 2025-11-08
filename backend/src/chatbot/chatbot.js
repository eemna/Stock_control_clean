// src/chatbot/chatbot.js
import dialogflow from "@google-cloud/dialogflow";
import {franc} from "franc";
import config from "../config/devkey.js";

// ✅ Création du client Dialogflow
const sessionClient = new dialogflow.SessionsClient({
  projectId: config.projectId,
  credentials: {
    client_email: config.client_email,
    private_key: config.private_key.replace(/\\n/g, "\n"), // ⚠️ important
  },
});

// ✅ Fonction principale
export const detectIntent = async (text, sessionId = "default-session") => {
  try {
    // --- Détection de la langue ---
    const langDetected = franc(text) || "fra";
    const lang = langDetected === "eng" ? "en" : "fr";

    // --- Création du chemin de session ---
    const sessionPath = sessionClient.projectAgentSessionPath(config.projectId, sessionId);

    // --- Requête à Dialogflow ---
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text,
          languageCode: lang,
        },
      },
    };

    const [response] = await sessionClient.detectIntent(request);

    // 🧠 DEBUG complet de la réponse
    console.log("🧠 --- RÉPONSE COMPLÈTE DE DIALOGFLOW ---");
    console.dir(response.queryResult, { depth: null });

    // Retourne seulement les infos nécessaires
    return response.queryResult;
  } catch (error) {
    console.error("❌ Erreur Dialogflow:", error);
    return {
      fulfillmentText: "Erreur de communication avec Dialogflow.",
      intent: { displayName: "Error" },
    };
  }
};
