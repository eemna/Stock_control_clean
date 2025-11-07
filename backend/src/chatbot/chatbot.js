import dialogflow from "@google-cloud/dialogflow";
import config from "../config/devkey.js";

const sessionClient = new dialogflow.SessionsClient({
  projectId: config.projectId,
  credentials: {
    client_email: config.client_email,
    private_key: config.private_key,
  },
});

export const detectIntent = async (text, sessionId = "default-session") => {
  const sessionPath = sessionClient.projectAgentSessionPath(
    config.projectId,
    sessionId
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text,
        languageCode: "fr",
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    console.log("Detected intent:", responses[0].queryResult);
    return responses[0].queryResult;
  } catch (error) {
    console.error("Dialogflow Error:", error);
  }
};
