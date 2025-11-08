const dialogflow = require('@google-cloud/dialogflow');
const path = require('path');

// Chemin vers ta clé JSON
const keyPath = path.join(__dirname, 'config', 'stockbot-xltr-1c8839d08418.json');

// Crée le client
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: keyPath,
});

// ID de ton projet
const projectId = 'stockbot-xltr';

async function detectIntent(query, sessionId = '123456') {
  const langDetected = franc(query); // exemple: "fra" ou "eng"
  const lang = langDetected === "eng" ? "en" : "fr"; // simple mapping
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: lang,
      },
    },
  };

  const responses = await sessionClient.detectIntent(request);
  return responses[0].queryResult;
}

module.exports = { detectIntent };
