// src/chatbot/chatbot.js
import dialogflow from "@google-cloud/dialogflow";
import config from "../config/devkey.js";

// ✅ Création du client Dialogflow
const sessionClient = new dialogflow.SessionsClient({
  projectId: config.projectId,
  credentials: {
    client_email: config.client_email,
    private_key: config.private_key.replace(/\\n/g, "\n"), // ✅ important
  },
});

// ✅ Fonction principale
export const detectIntent = async (text, sessionId = "default-session") => {
  const langDetected = franc(query); // exemple: "fra" ou "eng"
  const lang = langDetected === "eng" ? "en" : "fr"; // simple mapping
  const sessionPath = sessionClient.projectAgentSessionPath(config.projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: lang,
      },
    },
  };

  try {
    const [response] = await sessionClient.detectIntent(request);
    console.log("🧠 Intent détecté:", response.queryResult.intent.displayName);
    return response.queryResult;
  } catch (error) {
    console.error("❌ Erreur Dialogflow:", error);
    return {
      fulfillmentText: "Erreur de communication avec Dialogflow.",
      intent: { displayName: "Error" },
    };
  }
};
