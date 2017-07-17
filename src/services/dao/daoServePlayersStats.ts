import { dbConnectionService } from "../dbConnectionService";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";

var MongoClient = require("mongodb").MongoClient;
let ObjectId = require('mongodb').ObjectId;
const util = require("util");

import * as Player from "../../models/playerInfoModel/playerInfos";
import * as express from "express";

let logger = createLogger("daoServePlayersStats");

export interface IDaoServePlayersStats {
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
     * Request to find player info from id into mongodb
     * @param playerId: Id to request this player infos
     * @param year: Year of the wanted stats
     */
    getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo>
}

class DaoServePlayersStats implements IDaoServePlayersStats {
    //TODO Comments
    //TODO Config for connection string
    public async getPlayersOrderedByGoalStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByGoalsStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByAssistStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByAssistStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByPointStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByPointsStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByPlusMinusStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByPlusMinusStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByPenalityMinStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByPenalityMinStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByPowerplayGoalStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByPowerplayGoalsStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByShorthandedGoalStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByShorthandedGoalsStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByPowerplayPointStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByPowerplayPointsStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByShorthandedPointStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByShorthandedPointsStatQuery(playersId);
        return result;
    }

    public async getPlayersOrderedByHitStat(poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findOrderedByHitsStatQuery(playersId);
        return result;
    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo> {
        let result: Player.PlayerInfo = <Player.PlayerInfo> await this.findPlayerInfosQuery(playerId, year);
        return result;
    }

    private async getPlayersIds(poolId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PlayersPooling').find({ _id: new ObjectId(poolId) }, { _id: 0, playersId: 1 }).toArray(function(err, docs) {
                resolve(docs[0].playersId);
            });
        });
    }

    private async findOrderedByGoalsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.goals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByAssistStatQuery(playersId: number[]): Promise<{}> {
        //console.log(util.inspect(playersId[0], false, null));
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.assists": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPointsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.points": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPlusMinusStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.plusMinus": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPenalityMinStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.penalityMin": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPowerplayGoalsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.powerplayGoals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByShorthandedGoalsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.shorthandedGoals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByPowerplayPointsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.powerplayPoints": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByShorthandedPointsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.shorthandedPoints": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                resolve(docs);
            });
        });
    }

    private async findOrderedByHitsStatQuery(playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.hits": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
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
