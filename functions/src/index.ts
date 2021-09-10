import * as functions from "firebase-functions";
import * as Login from "./login";
import * as Webhook from "./webhook";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const login = Login.login;
export const webhook = Webhook.webhook;
