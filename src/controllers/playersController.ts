import { createInternalServerError } from "../models/core/apiError";
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

let logger = createLogger("PlayersController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class PlayersController {
    /**
     * Serve players stats ordered with goal stat
     */
    public async getGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        
        try {
            let poolId: string = req.params.poolId;

            return servePlayersStatsService.getPlayersOrderedByGoalStat(poolId)
                .then(stats => {
                    res.status(200).send(stats);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the application.", error));
        }

    }

    /**
     * Serve players stats ordered with assist stat
     */
    public async getAssistStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        
        try {
            console.log("getAssistStat endpoint call");
            let poolId: string = req.params.poolId;

            return servePlayersStatsService.getPlayersOrderedByAssistStat(poolId)
                .then(stats => {
                    res.status(200).send(stats);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the application.", error));
        }
        
    }

    /**
     * Serve players stats ordered with point stat
     */
    public async getPointStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getPointStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByPointStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with +/- stat
     */
    public async getPlusMinusStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getPlusMinusStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByPlusMinusStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with penality minutes stat
     */
    public async getPenalityMinStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getPenalityMinStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByPenalityMinStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with powerplay goals stat
     */
    public async getPowerplayGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getPowerplayGoalStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByPowerplayGoalStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with shorthanded goals stat
     */
    public async getShorthandedGoalStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getShorthandedGoalStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByShorthandedGoalStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with powerplay points stat
     */
    public async getPowerplayPointStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getPowerplayPointStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByPowerplayPointStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with shorthanded points stat
     */
    public async getShorthandedPointStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getShorthandedPointStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByShorthandedPointStat(poolId);
        res.send(result);
    }

    /**
     * Serve players stats ordered with hits stat
     */
    public async getHitStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        console.log("getHitStat endpoint call");
        let poolId: string = req.params.poolId;
        let result = await servePlayersStatsService.getPlayersOrderedByHitStat(poolId);
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
export let playersController: PlayersController = new PlayersController();
