//==========================================
// Open API/Swagger configurations and routes.
//==========================================

import * as express from "express";
import { configs } from "../config/configs";
import { constants, EndpointTypes } from "../config/constants";
import { addRoute } from "../src/app";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as getRawBody from "raw-body";
import { IHandlerRoute, HttpMethods } from "../src/models/core/route";
import { utils } from "../src/utils/utils";
import { createLogger } from "../src/utils/logger";
import * as HttpStatusCodes from "http-status-codes";

let logger = createLogger("openApiConfigurer");

/**
 * Open API doc cache.
 */
let openAPiDocCache: string;

/**
 * Open API Editor Config cache.
 */
let openAPiEditorConfigCache: string;

/**
 * Configures Open IPA and adds the required routes.
 *
 * @param port The port may be something else then the
 * default API port, if we start the Swagger Editor in
 * standalone mode.
 */
export function configureOpenApi(app: express.Express,
    serveSpecsFile: boolean = true,
    serveEditor: boolean = true,
    serveUi: boolean = true,
    port: number = configs.api.port) {

    let openApiSpecsUrl = utils.createPublicUrl(configs.routing.routes.openAPI.specsFile, EndpointTypes.DOCUMENTATION, port);
    let openApiSpecsFullPath = utils.createPublicFullPath(configs.routing.routes.openAPI.specsFile, EndpointTypes.DOCUMENTATION);

    //==========================================
    // Open API/Swagger specs file
    //==========================================
    const apiDocPath = configs.root + "/open-api/open-api.yaml";

    if (serveSpecsFile) {

        addRoute(app,
            {
                method: HttpMethods.GET,
                path: configs.routing.routes.openAPI.specsFile,
                handler: async function (req, res, next) {
                    res.setHeader("content-type", "application/x-yaml");

                    if (!openAPiDocCache || configs.environment.isDev) {

                        //==========================================
                        // We dynamically add the right "scheme", "host"
                        // and "basePath"
                        //==========================================
                        let doc = yaml.safeLoad(fs.readFileSync(apiDocPath, 'UTF-8'));
                        doc.host = configs.api.host + ":" + configs.api.port;
                        doc.schemes = [configs.api.scheme];
                        doc.basePath = utils.createPublicFullPath("/", EndpointTypes.API);

                        openAPiDocCache = yaml.safeDump(doc);
                    }

                    res.send(openAPiDocCache);
                },
                endpointType: EndpointTypes.DOCUMENTATION
            }
        );
    }

    //==========================================
    // Open API/Swagger UI
    //==========================================
    if (serveUi) {

        let uiFullPath = utils.createPublicFullPath(configs.routing.routes.openAPI.ui, EndpointTypes.DOCUMENTATION);
        addRoute(app,
            {
                method: HttpMethods.GET,
                path: configs.routing.routes.openAPI.ui,
                handler: async function (req, res, next) {
                    //==========================================
                    // If no url is specified, we redirect to our
                    // api docs.
                    //==========================================
                    if (!req.query.url) {
                        res.redirect("?url=" + openApiSpecsUrl);
                    } else {
                        next();
                    }
                },
                endpointType: EndpointTypes.DOCUMENTATION
            }
        );


        app.use(uiFullPath, express.static(configs.root + "/node_modules/swagger-ui/dist"));
    }

    //==========================================
    // Open API/Swagger Editor
    //==========================================
    if (serveEditor && configs.openApi.exposeSwaggerEditor) {

        //==========================================
        // The editor configuration file.
        // This route MUST be "config/defaults.json" relatively
        // to the editor root.
        //==========================================
        addRoute(app,
            {
                method: HttpMethods.GET,
                path: configs.routing.routes.openAPI.editor + "/config/defaults.json",
                handler: async function (req, res, next) {
                    res.setHeader("content-type", "application/json");

                    if (!openAPiEditorConfigCache) {

                        //==========================================
                        // We dynamically add the correct "backendEndpoint"
                        // property.
                        //==========================================
                        let content = require("./swagger-editor-config.json");
                        content.backendEndpoint = openApiSpecsUrl;
                        openAPiEditorConfigCache = JSON.stringify(content);
                    }

                    res.send(openAPiEditorConfigCache);
                },
                endpointType: EndpointTypes.DOCUMENTATION
            }
        );

        //==========================================
        // Writable endpoint for the editor
        //==========================================
        addRoute(app,
            {
                method: HttpMethods.PUT,
                path: configs.routing.routes.openAPI.specsFile,
                handler: async function (req, res, next) {

                    return getRawBody(req, "UTF-8").then((content: string) => {

                        //==========================================
                        // We do not save the "scheme", "host" or
                        // "basePath" properties.
                        // They are going to be added dynamically when the doc
                        // is served.
                        //==========================================
                        let doc;
                        try {
                            doc = yaml.safeLoad(content);
                        } catch (err) {
                            logger.warning(`Invalid YAML, the specs file won't be saved : ${err.message}`);
                            res.statusCode = HttpStatusCodes.BAD_REQUEST;
                            return res.end("err");
                        }

                        delete doc.host;
                        delete doc.schemes;
                        delete doc.basePath;
                        content = yaml.safeDump(doc);

                        fs.writeFileSync(apiDocPath, content, "UTF-8");

                        // delete doc cache
                        openAPiDocCache = null;

                        res.end("ok");
                    });
                },
                endpointType: EndpointTypes.DOCUMENTATION
            }
        );

        //==========================================
        // For some reason, a "/editor/undefined" request
        // is sometimes made when starting the editor. This
        // simply swallows it.
        //==========================================
        addRoute(app,
            {
                method: HttpMethods.GET,
                path: configs.routing.routes.openAPI.editor + "/undefined",
                handler: async function (req: express.Request, res: express.Response, next: express.NextFunction) {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end();
                },
                endpointType: EndpointTypes.DOCUMENTATION
            });

        //==========================================
        // The editor itself
        // Must be added *after* the previous routes!
        //==========================================
        let fullPath = utils.createPublicFullPath(configs.routing.routes.openAPI.editor, EndpointTypes.DOCUMENTATION);
        app.use(fullPath, express.static(configs.root + "/node_modules/swagger-editor"));

    }
}
