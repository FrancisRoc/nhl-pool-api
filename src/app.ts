//==========================================
// Application object
//==========================================

import { getAPIRoutes } from "./routes";
import { createLogger } from "./utils/logger";
import { configs } from "../config/configs";
import { constants, EndpointTypes } from "../config/constants";
import { utils } from "./utils/utils";
import { LogLevel } from "./utils/logLevel";
import { errorController } from "./controllers/core/errorController";
import { createError } from "./models/core/apiError";
import { devController } from "./controllers/core/devController";
import { IHandlerRoute, HttpMethods } from "./models/core/route";
import { configureOpenApi } from "../open-api/openApiConfigurer";
import { validateApp } from "./utils/appValidator";
import { IncomingMessage, ServerResponse, createServer } from "http";
import { loadPlayersStatsService } from "./services/loadPlayersStatsService"
import { dbConnectionService } from "./services/dbConnectionService";
import * as HttpStatusCodes from "http-status-codes";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as fs from "fs";
import * as _ from "lodash";
import * as handlerbars from "express-handlebars";

// Import the required dependencies for auth0
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

let logger = createLogger("app");

// We are going to implement a JWT middleware that will ensure the validity of our token. We'll require each protected route to have a valid access_token sent in the Authorization header
const authCheck = jwt({
  secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://nhlpoolhelper.auth0.com/.well-known/jwks.json"
    }),
    // This is the identifier we set when we created the API
    audience: 'nhl-pool-helper-api',
    issuer: "https://nhlpoolhelper.auth0.com/",
    algorithms: ['RS256'],
    leeway: 30
});

/**
 * Creates an application object.
 *
 * @param apiRoutes the public API routes to add to this app.
 * Use createDefaultApp() to create an application object using the
 * default API routes taken from the "src/routes.ts" file.
 */
export async function createApp(apiRoutes: IHandlerRoute[]): Promise<express.Express> {

    //==========================================
    // Express app
    //==========================================
    const app = express();

    //==========================================
    // Case sensitive routing?
    //
    // This config *must* be set before any other
    // "set"...
    // @see https://github.com/expressjs/express/issues/2505#issuecomment-70505092
    //==========================================
    app.set("case sensitive routing", configs.routing.caseSensitive);

    app.disable("x-powered-by");
    app.use(bodyParser.urlencoded({ extended: true, limit: configs.routing.maxRequestSizeMb + "mb" }));
    app.use(bodyParser.json({ limit: configs.routing.maxRequestSizeMb + "mb" }));

    //==========================================
    // Catch error from bodyParser to parse JSON
    //==========================================
    app.use(function (error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
        if (error.status === 400 && error instanceof SyntaxError && 'body' in error) {
            throw createError(constants.errors.codes.INVALID_JSON_BODY, "Invalid body content: " + error)
                .httpStatus(HttpStatusCodes.BAD_REQUEST)
                .publicMessage("Invalid body content")
                .target("body")
                .logLevel(LogLevel.INFO)
                .logStackTrace(false)
                .build();
        }
        else {
            next(error);
        }
    });

    //==========================================
    // Handlerbars templating engine (mostly for the
    // root HTML "info" page).
    //==========================================
    app.engine(".hbs", handlerbars({
        extname: ".hbs",
        layoutsDir: "html/layouts/",
        partialsDir: "html/partials/",
        defaultLayout: "mainLayout"
    }));
    app.set("views", "html");
    app.set("view engine", ".hbs");
    if (configs.templatingEngine.enableCache) {
        app.enable("view cache");
    }

    // required for auth0
    //app.use(authCheck);

    //==========================================
    // Static dev public files, under "/public".
    //
    // Those will only be available locally, when in
    // development. They are a quick way for a developer
    // to get informations about the current project.
    //==========================================
    let devPublicPathRoot = utils.createPublicFullPath("/public", EndpointTypes.NONE);
    app.use(devPublicPathRoot, express.static("html/public"));

    //==========================================
    // Enable CORS
    //
    // For fine grain configuration, have a look
    // at https://github.com/expressjs/cors
    //==========================================
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', "X-HTTP-Method-Override, Origin");
        res.header("Access-Control-Allow-Credentials", "true");
        //intercepts OPTIONS method
        if ('OPTIONS' === req.method) {
            //respond with 200
            res.status(HttpStatusCodes.OK);
            res.send("GET, POST, PUT, DELETE");
        }
        else {
            //move on
            next();
        }
    });

    app.use(cors());

    //==========================================
    // Configures Open API/Swagger and adds the
    // associated routes
    //==========================================
    configureOpenApi(app);

    //==========================================
    // Adds the public API routes
    //==========================================
    addRoutes(app, apiRoutes);

    //==========================================
    // Adds the unlisted routes
    //==========================================
    addRoutes(app, getUnlistedRoutes());

    //==========================================
    // Adds error handlers.
    // Those must go *after* the regular routes
    // definitions.
    //==========================================
    addErrorHandlers(app);

    //==========================================
    // Initializes some components
    //==========================================
    await initComponents();

    //==========================================
    // Get nhl players stats and stor in mongodb
    //==========================================
    loadPlayersStats();

    return app;
}

/**
 * Creates the default application object, using the
 * default API routes taken from the "src/routes.ts" file.
 */
export async function createDefaultApp(): Promise<express.Express> {
    return createApp(getAPIRoutes());
}

/**
 * Adds the route to the Express app but first wraps ot with the special
 * "wrapAsyncHandler()" function to manage some errors automatically.
 */
export function addRoute(app: express.Express, route: IHandlerRoute) {
    return addRoutes(app, [route]);
}

/**
 * Adds the routes to the Express app but first wraps them with the special
 * "wrapAsyncHandler()" function to manage some errors automatically.
 */
export function addRoutes(app: express.Express, routes: IHandlerRoute[]) {
    if (app && routes) {
        routes.forEach((route) => {
            if (route) {

                //==========================================
                // Creates the full path, given the type of
                // endpoint.
                //==========================================
                let fullPath = utils.createPublicFullPath(route.path, route.endpointType);
                let middlewares = route.middlewares || [];

                app[HttpMethods.toExpressMethodName(route.method)](fullPath, middlewares, wrapAsyncHandler(route.handler));
            }
        });
    }
}

/**
 * Calls Express's "next(error)" automatically when an error occured in
 * the specified async handler. Also makes sure the handler correctly manage
 * its async manipulations by forcing it to generate a
 * response, to call "next()" or "render()" by itself.
 */
export function wrapAsyncHandler(handler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>):
    (req: express.Request, res: express.Response, next: express.NextFunction) => void {

    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {

        //==========================================
        // Wrapper to check if "next()" was called.
        //==========================================
        let nextWasCalled = false;
        let nextWrapper = function (err?: any) {
            nextWasCalled = true;
            next(err);
        };

        //==========================================
        // Wrapper to check if "render()" was called.
        //==========================================
        let renderWasCalled = false;
        let renderOriginal = res.render;
        res.render = function (...params: any[]) {
            renderWasCalled = true;
            renderOriginal.apply(res, params);
        };

        try {

            //==========================================
            // Calls the handler.
            //==========================================
            await handler(req, res, nextWrapper);

            //==========================================
            // We force the handlers to generate a
            // response, to call "next()" or "render()".
            //==========================================
            if (!res.headersSent && !nextWasCalled && !renderWasCalled) {
                throw new Error("The handler did not send any response and did not call 'next()' or 'render()'! Request : " + req.url);
            }

        } catch (error) {
            next(error);
        }
    };
}

/**
 * Initialize some components before the application
 * is actually started.
 */
async function initComponents() {

    //==========================================
    // Creates the "test-data" folder, if required
    //==========================================
    if (!fs.existsSync(configs.testDataDir)) {
        fs.mkdirSync(configs.testDataDir);
    }

    dbConnectionService.connect();

    //==========================================
    // Manages program interuption
    //==========================================
    process.on('SIGINT', () => {
        logger.info("SIGINT occured: Releasing Mongo connection");
        dbConnectionService.release()

        logger.debug("Killing process... Press Enter to continu");
        process.exit(1);
    });
}

function loadPlayersStats() {
    //loadPlayersStatsService.loadAllPlayersStats();
}

/**
 * Adds error handlers.
 *
 * Those routes *must* be registered after the
 * regular routes.
 */
function addErrorHandlers(app: express.Express) {

    //==========================================
    // 404 / Not Found route
    //==========================================
    app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
        errorController.notFoundErrorHandler(req, res, next);
    });

    //==========================================
    // Generic Server error handler
    //==========================================
    app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {

        try {
            errorController.genericErrorHandler(err, req, res, next);
        } catch (err2) {

            try {
                res.statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
                res.send("An error occured.");
                logger.error("Error while managing an error : " + err2);
            } catch (err3) {
                // too bad!
            }
        }
    });

    //==========================================
    // Manages unhandled promises rejections
    //==========================================
    process.on('unhandledRejection', (reason: any, p: any) => {

        try {
            logger.error("Promise rejection error : " + reason);
        } finally {

            // TODO Should we die?
            // currently, we only log...
            //process.exit(1);
        }
    });

    //==========================================
    // Manages uncaught exceptions.
    //
    // If you are thinking about modifying this function,
    // make sure you read :
    // https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
    //
    //==========================================
    process.on('uncaughtException', (err: any) => {

        try {
            logger.error("An uncaught exception occured : " + err);
        } finally {
            process.exit(1);
        }
    });
}

/**
 * Routes that are *not* part of the public API, not
 * listed in the Open API specs file!
 */
function getUnlistedRoutes(): IHandlerRoute[] {

    let dummyImageHandler = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end();
    };

    let dummyTextHandler = async function (req: express.Request, res: express.Response, next: express.NextFunction) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end();
    };

    let routes: IHandlerRoute[] = [

        //==========================================
        // Common files that can be requested in development
        // but that we don't care about since this is an API.
        // Those handlers prevent 404 errors to be logged.
        //==========================================
        { method: HttpMethods.GET, path: "/favicon.ico", handler: dummyImageHandler, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/apple-touch-icon.png", handler: dummyImageHandler, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/tile.png", handler: dummyImageHandler, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/tile-wide.png", handler: dummyImageHandler, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/robots.txt", handler: dummyTextHandler, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/humans.txt", handler: dummyTextHandler, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/browserconfig.xml", handler: dummyTextHandler, endpointType: EndpointTypes.NONE },

        //==========================================
        // Root/Dev endpoints
        //
        // Those will only be available locally, during
        // development. They are a quick way for a developer
        // to get informations about the current project.
        //==========================================
        { method: HttpMethods.GET, path: "/", handler: devController.index, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/open-api", handler: devController.openAPI, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/health", handler: devController.health, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/metrics", handler: devController.metrics, endpointType: EndpointTypes.NONE },
        { method: HttpMethods.GET, path: "/readme", handler: devController.readme, endpointType: EndpointTypes.NONE },

    ];

    return routes;
}

