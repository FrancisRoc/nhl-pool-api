//==========================================
// Configurations for the application.
//==========================================
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const logLevel_1 = require("../src/utils/logLevel");
const config = require("config");
const fs = require("fs");
const path = require("path");
const _ = require("lodash");
/**
 * Configurations for the application.
 */
class Configs {
    constructor() {
        //==========================================
        // Project root
        //==========================================
        this._root = path.normalize(__dirname + "/..");
        //==========================================
        // Directory for test data
        //==========================================
        this._testDataDir = this._root + "/test-data";
        //==========================================
        // The environment name is found by node-config. It will
        // use the "NODE_ENV" environment variable or fallback to
        // "developement" if not found.
        // @see https://github.com/lorenwest/node-config/wiki/Configuration-Files#default-node_env
        //==========================================
        this._environment = config.util.getEnv('NODE_ENV');
        this._projectRepoUrl = config.get("project.repositoryUrl");
        this._projectDiscussionUrl = config.get("project.discussionUrl");
        this._projectMaintainers = config.get("project.maintainers");
        //==========================================
        // If the log directory starts with a ".", we
        // considere it to be relative to the root of the
        // project.
        //==========================================
        this._logDir = config.get("logging.dir");
        if (this._logDir.startsWith(".")) {
            this._logDir = path.normalize(this._root + "/" + this._logDir);
        }
        this._logLevel = logLevel_1.LogLevel.fromString(config.get("logging.level"));
        this._logHumanReadableinConsole = config.get("logging.humanReadableInConsole");
        this._addStackTraceToErrorMessagesInDev = config.get("logging.addStackTraceToErrorMessagesInDev");
        this._logSource = config.get("logging.logSource");
        this._logRotateFilesNbr = config.get("logging.logRotateFilesNbr");
        this._logRotateThresholdMB = config.get("logging.logRotateThresholdMB");
        this._logRotateMaxTotalSizeMB = config.get("logging.logRotateMaxTotalSizeMB");
        this._serverPort = config.get("server.port");
        this._swaggerEditorAlonePort = config.get("server.swaggerEditorAlonePort");
        this._debugHost = config.get("debug.host");
        this._debugPort = config.get("debug.port");
        this._apiScheme = config.get("api.scheme");
        this._apiHost = config.get("api.host");
        this._apiDomainPath = "/" + _.trim(config.get("api.domainPath"), "/");
        if (this._apiDomainPath === "/") {
            this._apiDomainPath = "";
        }
        this._apiEndpointTypeRootsApi = "/" + _.trim(config.get("api.endpointTypeRoots.api"), "/");
        this._apiEndpointTypeRootsDocumentation = "/" + _.trim(config.get("api.endpointTypeRoots.documentation"), "/");
        this._apiEndpointTypeRootsDiagnostics = "/" + _.trim(config.get("api.endpointTypeRoots.diagnostics"), "/");
        this._apiPort = config.get("api.port");
        this._exposeSwaggerEditor = config.get("openApi.exposeSwaggerEditor") &&
            fs.existsSync(this._root + "/node_modules/swagger-editor") &&
            this._environment !== constants_1.constants.Environments.PROD;
        this._routingCaseSensitive = config.get("routing.caseSensitive");
        this._maxRequestSizeMb = config.get("routing.maxRequestSizeMb");
        if (!this._maxRequestSizeMb || isNaN(this._maxRequestSizeMb)) {
            this._maxRequestSizeMb = 50;
        }
        this._diagnosticsRoutesPing = config.get("routing.routes.diagnostics.ping");
        this._diagnosticsRoutesInfo = config.get("routing.routes.diagnostics.info");
        this._openApiRoutesSpecFile = _.trim(config.get("routing.routes.openAPI.specsFile"), "/");
        this._openApiRoutesSwaggerUi = _.trim(config.get("routing.routes.openAPI.ui"), "/");
        this._openApiRoutesSwaggerEditor = _.trim(config.get("routing.routes.openAPI.editor"), "/");
        this._templatingEngineEnableCache = config.get("templatingEngine.enableCache");
        this._dataSourcesMongodbConnectString = config.get("dataSources.mongodb.connectString");
        this._nhlApiNbPlayersLimit = config.get("nhlApi.nbPlayersLimit");
        this._nhlApiResponseEncoding = config.get("nhlApi.responseEncoding");
        this._nhlApiHttpOptionsHost = config.get("nhlApi.httpOptions.host");
        this._nhlApiHttpOptionsPort = config.get("nhlApi.httpOptions.port");
        this._nhlApiHttpOptionsMethod = config.get("nhlApi.httpOptions.method");
    }
    /**
     * Singleton
     */
    static get instance() {
        if (!this._instance) {
            this._instance = new Configs();
        }
        return this._instance;
    }
    /**
     * Absolute path to the root of the project.
     */
    get root() {
        return this._root;
    }
    /**
     * Absolute path to a directory to use for tests.
     */
    get testDataDir() {
        return this._testDataDir;
    }
    /**
     * Current environment info.
     */
    get environment() {
        return {
            "type": this._environment,
            "isDev": (this._environment === constants_1.constants.Environments.DEV),
            "isAcc": (this._environment === constants_1.constants.Environments.ACCEPTATION),
            "isProd": (this._environment === constants_1.constants.Environments.PROD)
        };
    }
    /**
     * Various informations about the project itself.
     */
    get project() {
        return {
            /**
             * The repository of the project's sources.
             */
            "repositoryUrl": this._projectRepoUrl,
            /**
             * A place to discuss this project (forum/chat/etc.)
             */
            "discussionUrl": this._projectDiscussionUrl,
            /**
             * Maintainers
             */
            "maintainers": this._projectMaintainers
        };
    }
    /**
     * Logging related configurations.
     */
    get logging() {
        return {
            /**
             * Directoty to log to. Can be an absolute or relative
             * path.
             *
             * Use NULL or an empty string to disable.
             */
            "dir": this._logDir,
            /**
             * Logging level. By default, the level is "info".
             */
            "level": this._logLevel,
            /**
             * Should an human readable format be used when logging
             * to the console?
             *
             * This is costy and is generally disabled in production.
             */
            "humanReadableInConsole": this._logHumanReadableinConsole,
            /**
             * On a DEV environment, should the stack trace of an error be added
             * to its public message? This is true by default.
             *
             * This configuration only has an impact on a DEV environment.
             * On other environments, the stack trace is *never* added to the
             * error public message.
             */
            "addStackTraceToErrorMessagesInDev": this._addStackTraceToErrorMessagesInDev,
            /**
             * Should the file and line number where the log occures
             * be logged?
             *
             * This is costy and is generally disabled in production.
             */
            "logSource": this._logSource,
            /**
             * Log rotate : how many log files should exist? The rotation will be
             * done on those X number of files only.
             */
            "logRotateFilesNbr": this._logRotateFilesNbr,
            /**
             * Log rotate : a file is going to be rotated when its size reaches
             * this number of megabytes.
             */
            "logRotateThresholdMB": this._logRotateThresholdMB,
            /**
             * Log rotate : the maximum total number of megabytes for all the log files
             * combined.
             */
            "logRotateMaxTotalSizeMB": this._logRotateMaxTotalSizeMB
        };
    }
    /**
     * The HTTP server
     */
    get server() {
        return {
            /**
             * The port to start the server on.
             */
            "port": this._serverPort,
            /**
             * The port to start the server on when
             * only the Swagger editor is served.
             *
             * This port is different than the standard port
             * so both can run together.
             */
            "swaggerEditorAlonePort": this._swaggerEditorAlonePort,
        };
    }
    /**
     * API informations
     */
    get api() {
        return {
            /**
             * The public scheme the API will be accessible from.
             * This is going to be used, for example, by Swagger UI.
             */
            "scheme": this._apiScheme,
            /**
             * The public host the API will be accessible from.
             * This is going to be used, for example, by Swagger UI.
             */
            "host": this._apiHost,
            /**
             * The public port the API will be accessible from.
             * This is going to be used, for example, by Swagger UI.
             */
            "port": this._apiPort,
            /**
             * The root path under which the *API* endpoints
             * are served.
             *
             * Always starts with a "/".
             */
            "endpointTypeRootsApi": this._apiEndpointTypeRootsApi,
            /**
             * The root path under which the *Documentation* endpoints
             * are served.
             *
             * Always starts with a "/".
             */
            "endpointTypeRootsDocumentation": this._apiEndpointTypeRootsDocumentation,
            /**
             * The root path under which the *Diagnostics* endpoints
             * are served.
             *
             * Always starts with a "/".
             */
            "endpointTypeRootsDiagnostics": this._apiEndpointTypeRootsDiagnostics,
            /**
             * The common path under which all routes of this API
             * are served. Represents the business domain for which the API
             * is created.
             *
             * The full path to an endpoint consists in a variable endpoint type root,
             * followed by this common domain path, followed by the relative path
             * specific to the endpoint.
             *
             * Always starts with a "/".
             */
            "domainPath": this._apiDomainPath
        };
    }
    /**
     * Debug info
     */
    get debug() {
        return {
            /**
             * The port to listen to in debug mode.
             */
            "port": this._debugPort,
            /**
             * The host to listen to in debug mode.
             */
            "host": this._debugHost,
        };
    }
    /**
     * Routing info
     */
    get routing() {
        return {
            /**
             * Should the routing be case-sensitive?
             */
            "caseSensitive": this._routingCaseSensitive,
            /**
             * The maximum number of Mb a request
             * can have. Over that limit, an error is automatically
             * returned to the client.
             */
            "maxRequestSizeMb": this._maxRequestSizeMb,
            /**
             * Various endpoint specific *relative* paths. Those needs to be
             * prefixed with the endpoint type root and the domain path to
             * get a "full" path.
             */
            "routes": {
                "openAPI": {
                    "specsFile": this._openApiRoutesSpecFile,
                    "ui": this._openApiRoutesSwaggerUi,
                    "editor": this._openApiRoutesSwaggerEditor
                },
                "diagnostics": {
                    "ping": this._diagnosticsRoutesPing,
                    "info": this._diagnosticsRoutesInfo,
                }
            }
        };
    }
    /**
     * Open API info
     */
    get openApi() {
        return {
            "exposeSwaggerEditor": this._exposeSwaggerEditor,
        };
    }
    /**
     *Templating Engine
     */
    get templatingEngine() {
        return {
            /**
             * Should cache be used for the generated templates?
             * It is convenient to disable this in development, so
             * templates files can be modified and tested without
             * restarting the application.
             */
            "enableCache": this._templatingEngineEnableCache,
        };
    }
    /**
     * Data sources info
     */
    get dataSources() {
        return {
            "mongodb": {
                "connectString": this._dataSourcesMongodbConnectString,
            }
        };
    }
    /**
     * Nhl sportsfeed Api get player stats info
     */
    get nhlApi() {
        return {
            "nbPlayersLimit": this._nhlApiNbPlayersLimit,
            "responseEncoding": this._nhlApiResponseEncoding,
            "httpOptions": {
                "host": this._nhlApiHttpOptionsHost,
                "port": this._nhlApiHttpOptionsPort,
                "method": this._nhlApiHttpOptionsMethod,
            }
        };
    }
}
exports.Configs = Configs;
exports.configs = Configs.instance;
//# sourceMappingURL=configs.js.map