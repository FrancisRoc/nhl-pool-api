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
    public async getStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        
        try {
            let poolId: string = req.params.poolId;
            let requestedStat: string = req.params.stat;

            return servePlayersStatsService.getPlayersOrderedBy(requestedStat, poolId)
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
