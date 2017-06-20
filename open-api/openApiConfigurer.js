//==========================================
// Open API/Swagger configurations and routes.
//==========================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const configs_1 = require("../config/configs");
const constants_1 = require("../config/constants");
const app_1 = require("../src/app");
const fs = require("fs");
const yaml = require("js-yaml");
const getRawBody = require("raw-body");
const route_1 = require("../src/models/core/route");
const utils_1 = require("../src/utils/utils");
const logger_1 = require("../src/utils/logger");
const HttpStatusCodes = require("http-status-codes");
let logger = logger_1.createLogger("openApiConfigurer");
/**
 * Open API doc cache.
 */
let openAPiDocCache;
/**
 * Open API Editor Config cache.
 */
let openAPiEditorConfigCache;
/**
 * Configures Open IPA and adds the required routes.
 *
 * @param port The port may be something else then the
 * default API port, if we start the Swagger Editor in
 * standalone mode.
 */
function configureOpenApi(app, serveSpecsFile = true, serveEditor = true, serveUi = true, port = configs_1.configs.api.port) {
    let openApiSpecsUrl = utils_1.utils.createPublicUrl(configs_1.configs.routing.routes.openAPI.specsFile, constants_1.EndpointTypes.DOCUMENTATION, port);
    let openApiSpecsFullPath = utils_1.utils.createPublicFullPath(configs_1.configs.routing.routes.openAPI.specsFile, constants_1.EndpointTypes.DOCUMENTATION);
    //==========================================
    // Open API/Swagger specs file
    //==========================================
    const apiDocPath = configs_1.configs.root + "/open-api/open-api.yaml";
    if (serveSpecsFile) {
        app_1.addRoute(app, {
            method: route_1.HttpMethods.GET,
            path: configs_1.configs.routing.routes.openAPI.specsFile,
            handler: function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    res.setHeader("content-type", "application/x-yaml");
                    if (!openAPiDocCache || configs_1.configs.environment.isDev) {
                        //==========================================
                        // We dynamically add the right "scheme", "host"
                        // and "basePath"
                        //==========================================
                        let doc = yaml.safeLoad(fs.readFileSync(apiDocPath, 'UTF-8'));
                        doc.host = configs_1.configs.api.host + ":" + configs_1.configs.api.port;
                        doc.schemes = [configs_1.configs.api.scheme];
                        doc.basePath = utils_1.utils.createPublicFullPath("/", constants_1.EndpointTypes.API);
                        openAPiDocCache = yaml.safeDump(doc);
                    }
                    res.send(openAPiDocCache);
                });
            },
            endpointType: constants_1.EndpointTypes.DOCUMENTATION
        });
    }
    //==========================================
    // Open API/Swagger UI
    //==========================================
    if (serveUi) {
        let uiFullPath = utils_1.utils.createPublicFullPath(configs_1.configs.routing.routes.openAPI.ui, constants_1.EndpointTypes.DOCUMENTATION);
        app_1.addRoute(app, {
            method: route_1.HttpMethods.GET,
            path: configs_1.configs.routing.routes.openAPI.ui,
            handler: function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    //==========================================
                    // If no url is specified, we redirect to our
                    // api docs.
                    //==========================================
                    if (!req.query.url) {
                        res.redirect("?url=" + openApiSpecsUrl);
                    }
                    else {
                        next();
                    }
                });
            },
            endpointType: constants_1.EndpointTypes.DOCUMENTATION
        });
        app.use(uiFullPath, express.static(configs_1.configs.root + "/node_modules/swagger-ui/dist"));
    }
    //==========================================
    // Open API/Swagger Editor
    //==========================================
    if (serveEditor && configs_1.configs.openApi.exposeSwaggerEditor) {
        //==========================================
        // The editor configuration file.
        // This route MUST be "config/defaults.json" relatively
        // to the editor root.
        //==========================================
        app_1.addRoute(app, {
            method: route_1.HttpMethods.GET,
            path: configs_1.configs.routing.routes.openAPI.editor + "/config/defaults.json",
            handler: function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
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
                });
            },
            endpointType: constants_1.EndpointTypes.DOCUMENTATION
        });
        //==========================================
        // Writable endpoint for the editor
        //==========================================
        app_1.addRoute(app, {
            method: route_1.HttpMethods.PUT,
            path: configs_1.configs.routing.routes.openAPI.specsFile,
            handler: function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getRawBody(req, "UTF-8").then((content) => {
                        //==========================================
                        // We do not save the "scheme", "host" or
                        // "basePath" properties.
                        // They are going to be added dynamically when the doc
                        // is served.
                        //==========================================
                        let doc;
                        try {
                            doc = yaml.safeLoad(content);
                        }
                        catch (err) {
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
                });
            },
            endpointType: constants_1.EndpointTypes.DOCUMENTATION
        });
        //==========================================
        // For some reason, a "/editor/undefined" request
        // is sometimes made when starting the editor. This
        // simply swallows it.
        //==========================================
        app_1.addRoute(app, {
            method: route_1.HttpMethods.GET,
            path: configs_1.configs.routing.routes.openAPI.editor + "/undefined",
            handler: function (req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end();
                });
            },
            endpointType: constants_1.EndpointTypes.DOCUMENTATION
        });
        //==========================================
        // The editor itself
        // Must be added *after* the previous routes!
        //==========================================
        let fullPath = utils_1.utils.createPublicFullPath(configs_1.configs.routing.routes.openAPI.editor, constants_1.EndpointTypes.DOCUMENTATION);
        app.use(fullPath, express.static(configs_1.configs.root + "/node_modules/swagger-editor"));
    }
}
exports.configureOpenApi = configureOpenApi;
//# sourceMappingURL=openApiConfigurer.js.map