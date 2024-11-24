/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import { app } from "./app.js";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
export const base = onRequest(
    {
        region: "europe-west3",
        concurrency: 80,
        cpu: 1,
        minInstances: 1,
        maxInstances: 1,
        timeoutSeconds: 60 * 5,
        memory: "2GiB",
    },
    app,
);
