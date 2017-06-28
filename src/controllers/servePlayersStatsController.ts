import { servePlayersStatsService } from "../services/servePlayersStatsService";
import { constants, EndpointTypes } from "../../config/constants";
import { createLogger } from "../utils/logger";
import { configs } from "../../config/configs";
import { LogLevel } from "../utils/logLevel";
import { utils } from "../utils/utils";

let autobind = require("autobind-decorator");
import * as Player from "../models/playerInfoModel/playerInfos";
import * as HttpStatusCodes from "http-status-codes";
import * as express from "express";

let logger = createLogger("servePlayersStatsController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class ServePlayersStatsController {
    /**
     * Serve players stats ordered with goal stat
     */
    public async getGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("GOALS STATS endpoint call");
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
        let result: Player.PlayerInfo = await servePlayersStatsService.getPlayerInfos(playerId, year);
        res.send(result);
    }

}
export let servePlayersStatsController: ServePlayersStatsController = new ServePlayersStatsController();
