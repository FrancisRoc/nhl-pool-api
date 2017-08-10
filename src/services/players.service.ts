import { createInternalServerError, createError } from "../models/core/apiError";
import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { playersDao } from "./dao/playersDao";
import * as Player from "../models/playerInfoModel/playerInfos";
import * as HttpStatusCodes from "http-status-codes";
import * as express from "express";

export interface IPlayersService {
    /**
     * Request to find players stats ordered with goal stat to mongodb
     * @param stat: Statistic by wich we want to order by
     * @param poolId: Pool of players we want to order by stat and return
     * @param positions: Positions we want want to fetch stats
     * @param limit: Number of players we want to fetch
     */
    getPlayersOrderedBy(stat: string, poolId: string, positions: string, limit: number): Promise<any>;

    /**
     * Request to find players hit stat to mongodb
     * @param playerId: Id to request this player infos
     * @param year: Year of the wanted stats
     */
    getPlayerInfos(playerId: string, year: number): Promise<Player.IPlayerInfo>;

    /**
     * Draft player by its id.
     * 1) Delete from database
     * 2) Insert in user drafted players
     * @param userId: id of user to add player in drafted list
     * @param poolId: pool in wich user selected player
     * @param playerId: id of the player to draft
     */
    draftPlayer(userId: string, poolId: string, playerId: string): Promise<void>;

    /**
     * Get players drafted by user
     * @param userId: id of user to add player in drafted list
     * @param poolId: pool in wich user selected player
     */
    getDraftedPlayers(userId: string, poolId: string): Promise<void>;
}

class PlayersService implements IPlayersService {

    public async getPlayersOrderedBy(stat: string, poolId: string, positions: string, limit: number): Promise<any> {

        let poolPlayersIds: number[];
        try {
            poolPlayersIds = <number[]> await playersDao.getPoolPlayersIds(poolId);
        } catch (error) {
            Promise.reject(error);
        }

        // Parse positions string to make array
        let positionsToFetch: string[];
        positionsToFetch = positions.split(',');

        return playersDao.findStatsOrderedBy(stat, poolPlayersIds, positionsToFetch, limit)
            .then( (orderedStats: Player.IPlayerInfo) => {
                return orderedStats;
            })
            .catch(error => {
                return Promise.reject(createInternalServerError("Error while fetching the stats ordered by.", error));
            });

    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.IPlayerInfo> {
        return playersDao.findPlayerInfos(playerId, year)
            .then( (playerInfo: Player.IPlayerInfo) => {
                return playerInfo;
            })
            .catch(error => {
                return Promise.reject(createInternalServerError("Error while fetching the player info for specific year.", error));
            });
        
    }

    public async draftPlayer(userId: string, poolId: string, playerId: string): Promise<void> {
        
        try {
            await playersDao.deletePlayerInPool(poolId, playerId);
        } catch (error) {
            Promise.reject(error);
        }

        try {
            await playersDao.addPlayerToUserDraftedList(userId, poolId, playerId);
        } catch (error) {
            Promise.reject(error);
        }
    }

    public async getDraftedPlayers(userId: string, poolId: string): Promise<void> {
        throw createError("NOT IMPLEMNTED YET!", "This function getApplicationPrice has not been implemented yet.")
            .httpStatus(HttpStatusCodes.NOT_IMPLEMENTED)
            .publicMessage("This function getApplicationPrice has not been implemented yet.")
            .logLevel(LogLevel.INFO)
            .build();
    }
}
export let playersService: PlayersService = new PlayersService();
