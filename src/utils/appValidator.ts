//==========================================
// Application validator
//==========================================

import { openApiValidator } from "../../open-api/openApiValidator";
import { createLogger } from "../utils/logger";
import * as express from "express";

let logger = createLogger("server");

/**
 * Validates that the app is valid, for example in
 * regard to its Open API specs file.
 */
export function validateApp(app: express.Express): Promise<void> {

    logger.info("Validating the application...");

    //==========================================
    // Validates Open API
    //==========================================
    return openApiValidator.validate(app).then(() => {
        logger.info("The application is valid!");
        return Promise.resolve();
    }).catch((err: any) => {
        throw new Error(`Error validating the application :\n${err}`);
    });
}
