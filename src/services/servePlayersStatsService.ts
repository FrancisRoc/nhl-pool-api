import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoServePlayersStats } from "./dao/daoServePlayersStats"
import * as Player from "../models/playerInfoModel/playerInfos";
import * as express from "express";

export interface IServePlayersStatsService {
    /**
     * Request to find players stats ordered with goal stat to mongodb
     */
    getPlayersOrderedByGoalStat(poolId: string): Promise<{}>;

    /**
     * Request to find players stats ordered with assist stat to mongodb
     */
    getPlayersOrderedByAssistStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with point stat to mongodb
     */
    getPlayersOrderedByPointStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with +/- stat to mongodb
     */
    getPlayersOrderedByPlusMinusStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with penality min stat to mongodb
     */
    getPlayersOrderedByPenalityMinStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with powerplay goal stat to mongodb
     */
    getPlayersOrderedByPowerplayGoalStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with shorthanded goal stat to mongodb
     */
    getPlayersOrderedByShorthandedGoalStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with powerplay point to mongodb
     */
    getPlayersOrderedByPowerplayPointStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with shorthanded point stat to mongodb
     */
    getPlayersOrderedByShorthandedPointStat(poolId: string): Promise<{}>

    /**
     * Request to find players stats ordered with hit stat to mongodb
     */
    getPlayersOrderedByHitStat(poolId: string): Promise<{}>

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
    public async getPlayersOrderedByGoalStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByGoalStat(poolId);
    }

    public async getPlayersOrderedByAssistStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByAssistStat(poolId);
    }

    public async getPlayersOrderedByPointStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPointStat(poolId);
    }

    public async getPlayersOrderedByPlusMinusStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPlusMinusStat(poolId);
    }

    public async getPlayersOrderedByPenalityMinStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPenalityMinStat(poolId);
    }

    public async getPlayersOrderedByPowerplayGoalStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPowerplayGoalStat(poolId);
    }

    public async getPlayersOrderedByShorthandedGoalStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByShorthandedGoalStat(poolId);
    }

    public async getPlayersOrderedByPowerplayPointStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPowerplayPointStat(poolId);
    }

    public async getPlayersOrderedByShorthandedPointStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByShorthandedPointStat(poolId);
    }

    public async getPlayersOrderedByHitStat(poolId: string): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByHitStat(poolId);
    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo> {
        return await daoServePlayersStats.getPlayerInfos(playerId, year);
    }
}
export let servePlayersStatsService: ServePlayersStatsService = new ServePlayersStatsService();
