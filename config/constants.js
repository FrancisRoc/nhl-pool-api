//==========================================
// Application constants
//==========================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Application constants
 */
class Constants {
    constructor() {
    }
    /**
     * Singleton
     */
    static get instance() {
        if (!this._instance) {
            this._instance = new Constants();
        }
        return this._instance;
    }
    /**
     * Known environment types
     */
    get Environments() {
        return {
            //==========================================
            // "development" seems to be the standard Node label, not "dev".
            // The node-config library uses this :
            // https://github.com/lorenwest/node-config/wiki/Configuration-Files#default-node_env
            //==========================================
            "DEV": "development",
            "ACCEPTATION": "acceptation",
            //==========================================
            // "production" seems to be the standard Node label, not "prod".
            //==========================================
            "PROD": "production"
        };
    }
    /**
     * Environment variables
     */
    get EnvVariables() {
        return {
            /**
             * Environment type. The possible values are defined
             * in "Constants.Environments"
             * Do not change this :
             * https://github.com/lorenwest/node-config/wiki/Configuration-Files#default-node_env
             */
            "ENV_TYPE": "NODE_ENV"
        };
    }
    /**
     * Errors related constants
     */
    get errors() {
        return {
            codes: {
                "GENERIC_ERROR": "serverError",
                "NOT_FOUND": "notFound",
                "INVALID_PARAMETER": "invalidParameter",
                "INVALID_JSON_BODY": "invalidJsonBody"
            }
        };
    }
}
exports.Constants = Constants;
exports.constants = Constants.instance;
/**
 * Endpoint types.
 */
var EndpointTypes;
(function (EndpointTypes) {
    /**
     * An endpoint of type "NONE" won't have a root or a domain path
     * automatically added to its specified path... This allows
     * you to specify the exact path to use to this endpoint.
     */
    EndpointTypes[EndpointTypes["NONE"] = "NONE"] = "NONE";
    EndpointTypes[EndpointTypes["API"] = "API"] = "API";
    EndpointTypes[EndpointTypes["DOCUMENTATION"] = "DOCUMENTATION"] = "DOCUMENTATION";
    EndpointTypes[EndpointTypes["DIAGNOSTICS"] = "DIAGNOSTICS"] = "DIAGNOSTICS";
})(EndpointTypes = exports.EndpointTypes || (exports.EndpointTypes = {}));
//# sourceMappingURL=constants.js.map