import { constants, EndpointTypes } from "../../../config/constants";
import { configs } from "../../../config/configs";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { IDiagnosticsInfo } from "../../models/core/DiagnosticsInfo";
let autobind = require("autobind-decorator");
import * as express from "express";
import * as HttpStatusCodes from "http-status-codes";
import { utils } from "../../utils/utils";
import { servePlayersStatsService } from "../../services/servePlayersStatsService"

let logger = createLogger("playerStatsController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class PlayersStatsController {

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

    /**
     * Serve players stats ordered with goal stat
     */
    public async getGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByGoalStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with assist stat
     */
    public async getAssistStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByAssistStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with point stat
     */
    public async getPointStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByPointStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with +/- stat
     */
    public async getPlusMinusStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByPlusMinusStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with penality minutes stat
     */
    public async getPenalityMinStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByPenalityMinStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with powerplay goals stat
     */
    public async getPowerplayGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByPowerplayGoalStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with shorthanded goals stat
     */
    public async getShorthandedGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByShorthandedGoalStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with powerplay points stat
     */
    public async getPowerplayPointStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByPowerplayPointStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with shorthanded points stat
     */
    public async getShorthandedPointStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByShorthandedPointStat();
        res.send(result);
    }

    /**
     * Serve players stats ordered with hits stat
     */
    public async getHitStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let result = await servePlayersStatsService.getPlayersOrderedByHitStat();
        res.send(result);
    }

    /**
     * Serve individual player stat
     */
    public async getPlayerInfos(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let playerId = req.params.id;
        let year = req.params.year;
        let result = await servePlayersStatsService.getPlayerInfos(playerId, year);
        res.send(result);
    }

}
export let playersStatsController: PlayersStatsController = new PlayersStatsController();
