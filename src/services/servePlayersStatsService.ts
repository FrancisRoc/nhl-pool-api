import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoServePlayersStats } from "./dao/daoServePlayersStats"
import * as Player from "../models/playerInfoModel/playerInfos";
import * as express from "express";

export interface IServePlayersStatsService {
    /**
     * Request to find players stats ordered with goal stat to mongodb
     */
    getPlayersOrderedByGoalStat(): Promise<{}>;

    /**
     * Request to find players stats ordered with assist stat to mongodb
     */
    getPlayersOrderedByAssistStat(): Promise<{}>

    /**
     * Request to find players stats ordered with point stat to mongodb
     */
    getPlayersOrderedByPointStat(): Promise<{}>

    /**
     * Request to find players stats ordered with +/- stat to mongodb
     */
    getPlayersOrderedByPlusMinusStat(): Promise<{}>

    /**
     * Request to find players stats ordered with penality min stat to mongodb
     */
    getPlayersOrderedByPenalityMinStat(): Promise<{}>

    /**
     * Request to find players stats ordered with powerplay goal stat to mongodb
     */
    getPlayersOrderedByPowerplayGoalStat(): Promise<{}>

    /**
     * Request to find players stats ordered with shorthanded goal stat to mongodb
     */
    getPlayersOrderedByShorthandedGoalStat(): Promise<{}>

    /**
     * Request to find players stats ordered with powerplay point to mongodb
     */
    getPlayersOrderedByPowerplayPointStat(): Promise<{}>

    /**
     * Request to find players stats ordered with shorthanded point stat to mongodb
     */
    getPlayersOrderedByShorthandedPointStat(): Promise<{}>

    /**
     * Request to find players stats ordered with hit stat to mongodb
     */
    getPlayersOrderedByHitStat(): Promise<{}>

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
    public async getPlayersOrderedByGoalStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByGoalStat();
    }

    public async getPlayersOrderedByAssistStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByAssistStat();
    }

    public async getPlayersOrderedByPointStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPointStat();
    }

    public async getPlayersOrderedByPlusMinusStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPlusMinusStat();
    }

    public async getPlayersOrderedByPenalityMinStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPenalityMinStat();
    }

    public async getPlayersOrderedByPowerplayGoalStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPowerplayGoalStat();
    }

    public async getPlayersOrderedByShorthandedGoalStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByShorthandedGoalStat();
    }

    public async getPlayersOrderedByPowerplayPointStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByPowerplayPointStat();
    }

    public async getPlayersOrderedByShorthandedPointStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByShorthandedPointStat();
    }

    public async getPlayersOrderedByHitStat(): Promise<{}> {
        return await daoServePlayersStats.getPlayersOrderedByHitStat();
    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo> {
        return await daoServePlayersStats.getPlayerInfos(playerId, year);
    }
}
export let servePlayersStatsService: ServePlayersStatsService = new ServePlayersStatsService();
