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
            const poolId: string = req.params.poolId;
            const requestedStat: string = req.params.stat;

            const positions: string = req.query.positions || 'LW,C,RW,D,G';
            const limit: number = parseInt(req.query.limit) || configs.nhlApi.nbPlayersLimit;

            return playersService.getPlayersOrderedBy(requestedStat, poolId, positions, limit)
                .then(stats => {
                    res.status(HttpStatusCodes.OK).send(stats);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the stats ordered by specified stat.", error));
        }

    }

    /**
     * Serve individual player stat
     */
    public async getPlayerInfos(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const playerId = req.params.id;
            const year = req.params.year;

            return await playersService.getPlayerInfos(playerId, year)
                .then((playerInfo: Player.IPlayerInfo) => {
                    res.status(HttpStatusCodes.OK).send(playerInfo);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the player info.", error));
        }

    }

    /**
     * Draft a player for user with userId in pooling with poolId
     */
    public async draft(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const userId: string = req.params.userId;
            const poolId: string = req.params.poolId;
            const playerId: string = req.params.playerId;

            return await playersService.draftPlayer(userId, poolId, playerId)
                .then(() => {
                    res.status(HttpStatusCodes.OK).send();
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while drafting player", error));
        }

    }

    public async getDrafted(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const userId: string = req.params.userId;
            const poolId: string = req.params.poolId;

            return await playersService.getDraftedPlayers(userId, poolId)
                .then(() => {
                    res.status(HttpStatusCodes.OK).send();
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError(`Error while fetching the drafted players for user specified`, error));
        }

    }
}
export let playersController: PlayersController = new PlayersController();
