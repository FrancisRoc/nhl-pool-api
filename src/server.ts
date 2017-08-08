//==========================================
// Export a function to start the server for the
// application.
//==========================================

import { createLogger } from "./utils/logger";
import { configs } from "../config/configs";
import { constants } from "../config/constants";
import { createDefaultApp } from "./app";
import { validateApp } from "./utils/appValidator";
import { utils } from "./utils/utils";
import { EndpointTypes } from "../config/constants";
import { dbConnectionService } from "./services/dbConnectionService";
import * as express from "express";

export async function startServer(): Promise<express.Express> {

    //==========================================
    // Logger with a name related to the current
    // file.
    //==========================================
    let logger = createLogger("server");

    //==========================================
    // Warning if there is no NODE_ENV envrionment variable
    // set.
    //==========================================
    let env: string = process.env[constants.EnvVariables.ENV_TYPE];
    if (!env) {
        logger.warning(`No ${constants.EnvVariables.ENV_TYPE} environment variable found! A default will be used : ` + configs.environment.type);
    }

    //==========================================
    // Creates the application, with the default
    // API routes.
    //==========================================
    let app = await createDefaultApp();

    //==========================================
    // Validates the application
    //==========================================
    try {
        await validateApp(app);
    } catch (err) {

        logger.error(err);

        if (configs.openApi.exposeSwaggerEditor) {
            console.log(`NOTE : You still can run "gulp editor" to serve the Swagger Editor to help you edit the specs file!`);
        }
        return process.exit(-1);
    }

    //==========================================
    // Connect to DB
    //==========================================
    try {
        await dbConnectionService.mongoInit();
    } catch (err) {

        logger.error(JSON.stringify(err));
        console.log("Server will exit, database connection error.");
        process.exit(-1);
        return Promise.reject(null);
    }

    //==========================================
    // Starts the server!
    //==========================================
    await new Promise(function (resolve, reject) {

        try {
            let port = process.env.PORT || configs.server.port;
            app.listen(port, function () {

                logger.info(`Server started on port ${configs.server.port}`);
                logger.info(`Project root : ${configs.root}`);

                const packageJson = require(`${configs.root}/package.json`);

                let apiBaseUrl = utils.createPublicUrl("/", EndpointTypes.API);
                let root = utils.createPublicUrl("/", EndpointTypes.NONE);

                console.log(`\n==========================================`);
                console.log(`~~~ ${packageJson.description || packageJson.name} ~~~\n`);
                console.log(`Info page : ${root}`);
                console.log(`API entry point : ${apiBaseUrl}`);
                console.log(`Server port : ${configs.server.port}`);
                console.log(`Environment type : ${configs.environment.type}`);
                console.log(`==========================================\n`);

                resolve();
            });
        } catch (err) {
            reject(err);
        }
    });

    return Promise.resolve(app);
}
