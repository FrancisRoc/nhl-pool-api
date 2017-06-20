//==========================================
// Open API validator
//==========================================

import { configs } from "../config/configs";
import { utils } from "../src/utils/utils";
import { getAPIRoutes } from "../src/routes";
import { IRoute, HttpMethods } from "../src/models/core/route";
import * as express from "express";
let SwaggerParser = require("swagger-parser");
import * as fs from "fs";
import * as _ from "lodash";

/**
 * Open API validator
 */
export interface IOpenApiValidator {

    /**
     * Validate the application agains its
     * Open API specs file.
     */
    validate(app: express.Express): Promise<void>;
}

/**
 * Open API validator default implementation
 */
class OpenApiValidator implements IOpenApiValidator {

    /**
     * Validation entry point
     */
    validate(app: express.Express): Promise<void> {

        let self = this;
        let parser = new SwaggerParser();
        let specsFilePath = configs.root + "/open-api/open-api.yaml";

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
        }).catch(function (err: any) {
            throw new Error(`The "${specsFilePath}" file is not valid as an Open API specs : ${err}`);
        }).then(function (api: any) {

            //==========================================
            // Validate the routes
            //==========================================
            return self.validateRoutes(api, app);
        });
    }

    /**
     * Validation of the routes.
     */
    protected validateRoutes(api: any, app: express.Express): Promise<void> {

        //==========================================
        // The routes defined in the Open API
        // specs file.
        //==========================================
        let openApiRoutes: IRoute[] = this.getOpenApiRoutes(api);

        //==========================================
        // The routes defined in the application as
        // being "API routes"
        //==========================================
        let appApiRoutes: IRoute[] = this.getAppApiRoutes(app);

        let errors: string[] = [];

        outer: for (let openApiRoute of openApiRoutes) {
            let path = openApiRoute.path;
            let httpMethod = openApiRoute.method;
            for (let appRoute of appApiRoutes) {
                if (path === appRoute.path && httpMethod === appRoute.method) {
                    continue outer;
                }
            }
            errors.push(`The route "[${HttpMethods.toString(httpMethod)}] ${path}" was found in the ` +
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
            errors.push(`The route "[${HttpMethods.toString(httpMethod)}] ${path}" was found in the ` +
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
    protected getOpenApiRoutes(api: any): IRoute[] {

        let routes: IRoute[] = [];

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
                    let httpMethod = HttpMethods.fromString(httpMethodStr);
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
    protected getAppApiRoutes(app: express.Express): IRoute[] {

        let routesInRoutesFile: any = {};
        for (let route of getAPIRoutes()) {
            let method = HttpMethods.toString(route.method);
            routesInRoutesFile[method] = routesInRoutesFile[method] || {};
            routesInRoutesFile[method][route.path] = true;
        }

        let routes: IRoute[] = [];
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

        return getAPIRoutes();
    }

    /**
     * Converts an Open API path to the format of the
     * target web framework.
     */
    protected convertOpenApiPathToFrameworkPath = (path: string): string => {

        if (!path) {
            return "";
        }

        let finalPath: string = "";

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
    }
}

export let openApiValidator: IOpenApiValidator = new OpenApiValidator();
