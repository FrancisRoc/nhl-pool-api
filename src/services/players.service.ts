import { createInternalServerError } from "../models/core/apiError";
import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoServePlayersStats } from "./dao/daoServePlayersStats"
import * as Player from "../models/playerInfoModel/playerInfos";
import * as express from "express";

export interface IPlayersService {
    /**
     * Request to find players stats ordered with goal stat to mongodb
     * @param stat: Statistic by wich we want to order by
     * @param poolId: Pool of players we want to order by stat and return
     */
    getPlayersOrderedBy(stat: string, poolId: string): Promise<any>;

    /**
     * Request to find players hit stat to mongodb
     * @param playerId: Id to request this player infos
     * @param year: Year of the wanted stats
     */
    getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo>
}

class PlayersService implements IPlayersService {

    public async getPlayersOrderedBy(stat: string, poolId: string): Promise<any> {

        let poolPlayersIds: number[];
        try {
            poolPlayersIds = <number[]> await daoServePlayersStats.getPoolPlayersIds(poolId);
        } catch (error) {
            Promise.reject(error);
        }

        return daoServePlayersStats.findStatsOrderedBy(stat, poolPlayersIds)
            .then(orderedStats => {
                return orderedStats;
            })
            .catch(error => {
                return Promise.reject(createInternalServerError("Error while fetching the stats ordered by.", error));
            });

    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo> {
        return daoServePlayersStats.findPlayerInfos(playerId, year)
            .then( (playerInfo: Player.PlayerInfo) => {
                return playerInfo;
            })
            .catch(error => {
                return Promise.reject(createInternalServerError("Error while fetching the player info for specific year.", error));
            });
        
    }
}
export let playersService: PlayersService = new PlayersService();
