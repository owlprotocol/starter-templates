import { Request, Response } from "express";
import { Logger } from "./types/Logger.js";

/**
 * Simple hello world
 * @param _request
 * @param response
 * @param logger
 */
export function hello(_request: Request, response: Response, logger: Logger = console) {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
}
