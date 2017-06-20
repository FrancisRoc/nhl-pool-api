import { dbConnectionService } from "../dbConnectionService";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";
var MongoClient = require("mongodb").MongoClient;
const util = require("util");
import * as express from "express";

let logger = createLogger("daoServePlayersStats");

export interface IDaoServePlayersStats {
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
     * Request to find player info from id into mongodb
     * @param playerId: Id to request this player infos
     * @param year: Year of the wanted stats
     */
    getPlayerInfos(playerId: string, year: number): Promise<{}>
}

class DaoServePlayersStats implements IDaoServePlayersStats {
    //TODO Comments
    //TODO Config for connection string
    public async getPlayersOrderedByGoalStat(): Promise<{}> {
        let result = await this.findOrderedByGoalsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByAssistStat(): Promise<{}> {
        let result = await this.findOrderedByAssistStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByPointStat(): Promise<{}> {
        let result = await this.findOrderedByPointsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByPlusMinusStat(): Promise<{}> {
        let result = await this.findOrderedByPlusMinusStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByPenalityMinStat(): Promise<{}> {
        let result = await this.findOrderedByPenalityMinStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByPowerplayGoalStat(): Promise<{}> {
        let result = await this.findOrderedByPowerplayGoalsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByShorthandedGoalStat(): Promise<{}> {
        let result = await this.findOrderedByShorthandedGoalsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByPowerplayPointStat(): Promise<{}> {
        let result = await this.findOrderedByPowerplayPointsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByShorthandedPointStat(): Promise<{}> {
        let result = await this.findOrderedByShorthandedPointsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayersOrderedByHitStat(): Promise<{}> {
        let result = await this.findOrderedByHitsStatQuery();
        return JSON.stringify(result);
    }

    public async getPlayerInfos(playerId: string, year: number): Promise<{}> {
        let result = await this.findPlayerInfosQuery(playerId, year);
        return JSON.stringify(result);
    }

    private async findOrderedByGoalsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.goals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByAssistStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.assists": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPointsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.points": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPlusMinusStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.plusMinus": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPenalityMinStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.penalityMin": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPowerplayGoalsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.powerplayGoals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByShorthandedGoalsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.shorthandedGoals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPowerplayPointsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.powerplayPoints": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByShorthandedPointsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.shorthandedPoints": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByHitsStatQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').find({}).sort({ "stats.stats.hits": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findPlayerInfosQuery(playerId: string, year: number): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats' + year).find({ "player.ID": playerId }).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }
}
export let daoServePlayersStats: DaoServePlayersStats = new DaoServePlayersStats();
