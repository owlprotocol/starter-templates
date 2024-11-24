import * as functions from "firebase-functions";
import { webhookCallback } from "grammy";
// import { defineString } from "firebase-functions/params";
import { bot } from "../bot.js";

//TODO: Use for logging
// import * as logger from "firebase-functions/logger";

//TODO: Technically firebase is trusted environment and doesn't need private key
// defineString("DOTENV_KEY");

// During development, you can trigger your function from https://localhost/<firebase-projectname>/us-central1/telegramWebhook
//TODO: What is the default adapter? HTTP?
//@ts-expect-error
export const telegramWebhook = functions.https.onRequest(webhookCallback(bot));
