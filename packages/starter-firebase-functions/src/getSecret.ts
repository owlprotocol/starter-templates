// firebase functions has same type
import { Request, Response } from "express";
import { Logger } from "./types/Logger.js";

/**
 * Log SECRET_NAME from `process.env`
 * @param _request
 * @param response
 * @param logger
 */
export function getSecret(_request: Request, response: Response, logger: Logger = console) {
    logger.info(`Logging secret API key: ${process.env.SECRET_NAME}`, { structuredData: true });
    response.send(`The secret API key is ${process.env.SECRET_NAME}`);
}
