import { createInternalServerError } from "../models/core/apiError";
import { playersService } from "../services/players.service";
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

            let positions: string = req.query.positions || 'LW,C,RW,D,G';
            let limit: number = parseInt(req.query.limit) || configs.nhlApi.nbPlayersLimit;

            return playersService.getPlayersOrderedBy(requestedStat, poolId, positions, limit)
                .then(stats => {
                    res.status(200).send(stats);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the stats ordered by.", error));
        }

    }

    /**
     * Serve individual player stat
     */
    public async getPlayerInfos(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            let playerId = req.params.id;
            let year = req.params.year;

            return await playersService.getPlayerInfos(playerId, year)
                .then((playerInfo: Player.IPlayerInfo) => {
                    res.status(200).send(playerInfo);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the player info.", error));
        }
    }

}
export let playersController: PlayersController = new PlayersController();
