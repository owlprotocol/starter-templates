// firebase functions has same type
import { Request, Response } from "express";
import { Logger } from "./types/Logger.js";

const secret = process.env.SECRET_NAME;
if (!secret) {
    throw new Error(`secret should not load until set by firebase`);
}

/**
 * Log `secret` that was loaded in global scope. `getSecretGlobal` MUST be loaded dynamically such that firebase loads the envvar first
 * @param _request
 * @param response
 * @param logger
 */
export function getSecretGlobal(_request: Request, response: Response, logger: Logger = console) {
    logger.info(`Logging secret API key in global scope: ${secret}`, { structuredData: true });
    response.send(`The secret API key is global scope ${secret}`);
}
