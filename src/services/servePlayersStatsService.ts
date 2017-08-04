import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoServePlayersStats } from "./dao/daoServePlayersStats"
import * as Player from "../models/playerInfoModel/playerInfos";
import * as express from "express";

export interface IServePlayersStatsService {
    /**
     * Request to find players stats ordered with goal stat to mongodb
     */
    getPlayersOrderedBy(stat: string, poolId: string): Promise<{}>;

    /**
     * Request to find players hit stat to mongodb
     * @param playerId: Id to request this player infos
     * @param year: Year of the wanted stats
     */
    getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo>
}

class ServePlayersStatsService implements IServePlayersStatsService {
    /**
     * Call API to get goal stat of all nhl players
     */
    public async getPlayersOrderedBy(stat: string, poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await daoServePlayersStats.getPlayersIds(poolId);
        let result = await daoServePlayersStats.findStatsOrderedBy(stat, playersId);
        return result;
    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo> {
        let result: Player.PlayerInfo = <Player.PlayerInfo> await daoServePlayersStats.findPlayerInfosQuery(playerId, year);
        return result;
    }
}
export let servePlayersStatsService: ServePlayersStatsService = new ServePlayersStatsService();
