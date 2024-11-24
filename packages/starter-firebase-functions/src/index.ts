/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { hello } from "./hello.js";
import { getSecret } from "./getSecret.js";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
const defaultConfig = {
    region: "europe-west3",
    concurrency: 80,
    cpu: 1,
    minInstances: 0,
    maxInstances: 1,
    timeoutSeconds: 60 * 5,
    memory: "128MiB",
} as const;

// Simple hello world
export const helloFn = onRequest(
    {
        ...defaultConfig,
    },
    (_request, response) => {
        hello(_request, response, logger);
    },
);

// Secret
export const getSecretFn = onRequest(
    {
        ...defaultConfig,
        //https://firebase.google.com/docs/functions/config-env?hl=en&gen=2nd#secret-manager
        secrets: ["SECRET_NAME"],
    },
    (_request, response) => {
        getSecret(_request, response, logger);
    },
);

export const getSecretGlobalFn = onRequest(
    {
        ...defaultConfig,
        //https://firebase.google.com/docs/functions/config-env?hl=en&gen=2nd#secret-manager
        secrets: ["SECRET_NAME"],
    },
    async (_request, response) => {
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
        // Use dynamic import so that `process.SECRET_NAME` is not read on deployment
        const { getSecretGlobal } = await import("./getSecretGlobal.js");
        getSecretGlobal(_request, response, logger);
    },
);
