import { IDiagnosticsInfo } from "../../models/core/DiagnosticsInfo";
import { constants, EndpointTypes } from "../../../config/constants";
import { createLogger } from "../../utils/logger";
import { configs } from "../../../config/configs";
import { LogLevel } from "../../utils/logLevel";
import { utils } from "../../utils/utils";

let autobind = require("autobind-decorator");
import * as HttpStatusCodes from "http-status-codes";
import * as express from "express";

let logger = createLogger("devController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class DevController {

    /**
     * Adds common variables for all info pages.
     */
    protected addCommonVars(vars: any) {

        vars.publicRoot = utils.createPublicFullPath("/public", EndpointTypes.NONE);

        let packageJson = require(`${configs.root}/package.json`);
        vars.projectName = packageJson.name;
        vars.projectDescription = packageJson.description;
        vars.projectVersion = packageJson.version;

        vars.configs = configs;
        vars.infoJsonUrl = utils.createPublicUrl(configs.routing.routes.diagnostics.info, EndpointTypes.DIAGNOSTICS);
    }

    /**
     * Index page / General info
     */
    public async index(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let vars = { isGeneralInfoPage: true, };
        this.addCommonVars(vars);
        res.render("generalInfo", vars);
    }

    /**
     * Open API info page
     */
    public async openAPI(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let openApiSpecsUrl = utils.createPublicUrl(configs.routing.routes.openAPI.specsFile, EndpointTypes.DOCUMENTATION);
        let swaggerUiUrl = utils.createPublicUrl(configs.routing.routes.openAPI.ui, EndpointTypes.DOCUMENTATION);
        let swaggerEditorsUrl = utils.createPublicUrl(configs.routing.routes.openAPI.editor, EndpointTypes.DOCUMENTATION);
        let vars = {
            isOpenAPIPage: true,
            openApiSpecsUrl: openApiSpecsUrl,
            swaggerUiUrl: swaggerUiUrl,
            swaggerEditorsUrl: swaggerEditorsUrl
        };
        this.addCommonVars(vars);
        res.render("openAPI", vars);
    }

    /**
     * Health info page
     */
    public async health(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        let vars = {
            isHealthPage: true,
            pingUrl: utils.createPublicUrl(configs.routing.routes.diagnostics.ping, EndpointTypes.DIAGNOSTICS),
            infoUrl: utils.createPublicUrl(configs.routing.routes.diagnostics.info, EndpointTypes.DIAGNOSTICS)
        };
        this.addCommonVars(vars);
        res.render("health", vars);
    }

    /**
     * Metrics info page
     */
    public async metrics(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let vars = { isMetricsPage: true };
        this.addCommonVars(vars);
        res.render("metrics", vars);
    }

    /**
     * Readme info page
     */
    public async readme(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let vars = {
            isReadmePage: true,
            readmeContent: utils.getReadmeHtml()
        };
        this.addCommonVars(vars);
        res.render("readme", vars);
    }
}
export let devController: DevController = new DevController();
