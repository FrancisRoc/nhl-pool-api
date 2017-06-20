//==========================================
// Open API validator
//==========================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configs_1 = require("../config/configs");
const routes_1 = require("../src/routes");
const route_1 = require("../src/models/core/route");
let SwaggerParser = require("swagger-parser");
/**
 * Open API validator default implementation
 */
class OpenApiValidator {
    constructor() {
        /**
         * Converts an Open API path to the format of the
         * target web framework.
         */
        this.convertOpenApiPathToFrameworkPath = (path) => {
            if (!path) {
                return "";
            }
            let finalPath = "";
            let tokens = path.split("/");
            for (let token of tokens) {
                if (token) {
                    if (token.startsWith("{") && token.endsWith("}")) {
                        token = ":" + token.substring(1, token.length - 1);
                    }
                    finalPath += "/" + token;
                }
            }
            return finalPath;
        };
    }
    /**
     * Validation entry point
     */
    validate(app) {
        let self = this;
        let parser = new SwaggerParser();
        let specsFilePath = configs_1.configs.root + "/open-api/open-api.yaml";
        //==========================================
        // Parses and validates the schema of the Open API
        // specs file.
        //==========================================
        return parser.dereference(specsFilePath, {
            allow: {
                json: false,
                empty: false
            },
            validate: {
                schema: true,
                spec: true
            }
        }).catch(function (err) {
            throw new Error(`The "${specsFilePath}" file is not valid as an Open API specs : ${err}`);
        }).then(function (api) {
            //==========================================
            // Validate the routes
            //==========================================
            return self.validateRoutes(api, app);
        });
    }
    /**
     * Validation of the routes.
     */
    validateRoutes(api, app) {
        //==========================================
        // The routes defined in the Open API
        // specs file.
        //==========================================
        let openApiRoutes = this.getOpenApiRoutes(api);
        //==========================================
        // The routes defined in the application as
        // being "API routes"
        //==========================================
        let appApiRoutes = this.getAppApiRoutes(app);
        let errors = [];
        outer: for (let openApiRoute of openApiRoutes) {
            let path = openApiRoute.path;
            let httpMethod = openApiRoute.method;
            for (let appRoute of appApiRoutes) {
                if (path === appRoute.path && httpMethod === appRoute.method) {
                    continue outer;
                }
            }
            errors.push(`The route "[${route_1.HttpMethods.toString(httpMethod)}] ${path}" was found in the ` +
                ` Open API specs file but not in the "routes.ts" file.`);
        }
        outer: for (let appRoute of appApiRoutes) {
            let path = appRoute.path;
            let httpMethod = appRoute.method;
            for (let openApiRoute of openApiRoutes) {
                if (path === openApiRoute.path && httpMethod === openApiRoute.method) {
                    continue outer;
                }
            }
            errors.push(`The route "[${route_1.HttpMethods.toString(httpMethod)}] ${path}" was found in the ` +
                `"routes.ts" file, but not in the Open API specs file.`);
        }
        //==========================================
        // Some errors...
        //==========================================
        if (errors.length > 0) {
            return Promise.reject("- " + errors.join("\n- "));
        }
        //==========================================
        // Ok, routes are valid!
        //==========================================
        return Promise.resolve();
    }
    /**
     * Returns the routes defined in the Open API
     * specs file.
     */
    getOpenApiRoutes(api) {
        let routes = [];
        if (api.paths) {
            for (let path in api.paths) {
                let pathObj = api.paths[path];
                //==========================================
                // Open API uses "{someParam}" as the syntax for
                // dynamic parameters...
                // We have to convert those to the format of the
                // target web framework.
                //==========================================
                path = this.convertOpenApiPathToFrameworkPath(path);
                for (let httpMethodStr in pathObj) {
                    let httpMethod = route_1.HttpMethods.fromString(httpMethodStr);
                    routes.push({
                        path: path,
                        method: httpMethod
                    });
                }
            }
        }
        return routes;
    }
    /**
     * Returns public API routes of the application, as defined in
     * the "routes.ts" file.
     *
     * We also make sure that all of the routes defined in the
     * "routes.ts" file are present in the "app" object
     * itself.
     */
    getAppApiRoutes(app) {
        let routesInRoutesFile = {};
        for (let route of routes_1.getAPIRoutes()) {
            let method = route_1.HttpMethods.toString(route.method);
            routesInRoutesFile[method] = routesInRoutesFile[method] || {};
            routesInRoutesFile[method][route.path] = true;
        }
        let routes = [];
        let routeWrappers = app._router.stack;
        if (routeWrappers) {
            for (let routeWrapper of routeWrappers) {
                if (routeWrapper.route) {
                    let routeObj = routeWrapper.route;
                    for (let httpMethod in routeObj.methods) {
                        if (routesInRoutesFile[httpMethod] && routesInRoutesFile[httpMethod][routeObj.path]) {
                            delete routesInRoutesFile[httpMethod][routeObj.path];
                        }
                    }
                }
            }
        }
        for (let httpMethod in routesInRoutesFile) {
            if (routesInRoutesFile[httpMethod].size && routesInRoutesFile[httpMethod].size() > 0) {
                throw new Error(`An API route is defined in the "routes.ts" file but was not found in the ` +
                    `application : [${httpMethod}] ${routesInRoutesFile[httpMethod][0]}`);
            }
        }
        return routes_1.getAPIRoutes();
    }
}
exports.openApiValidator = new OpenApiValidator();
//# sourceMappingURL=openApiValidator.js.map