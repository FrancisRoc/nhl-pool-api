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
    getPlayersOrderedBy(stat: string, poolId: string): Promise<{}>;

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
    public async getPlayersOrderedBy(stat: string, poolId: string): Promise<{}> {
        let playersId: number[] = <number[]> await this.getPlayersIds(poolId);
        let result = await this.findStatsOrderedBy(stat, playersId);
        return result;
    }

    public async getPlayerInfos(playerId: string, year: number): Promise<Player.PlayerInfo> {
        let result: Player.PlayerInfo = <Player.PlayerInfo> await this.findPlayerInfosQuery(playerId, year);
        return result;
    }

    public async getPlayersIds(poolId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PlayersPooling').find({ _id: new ObjectId(poolId) }, { _id: 0, playersId: 1 }).toArray(function(err, docs) {
                resolve(docs[0].playersId);
            });
        });
    }

    public async findStatsOrderedBy(requestedStat, playersId: number[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            switch (requestedStat) {
                case "goals":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.goals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "assists":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.assists": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "points":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.points": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "plusMinus":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.plusMinus": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "penalityMin":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.penalityMin": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "powerplayGoals":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.powerplayGoals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "shorthandedGoals":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.shorthandedGoals": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "powerplayPoints":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.powerplayPoints": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "shorthandedPoints":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.shorthandedPoints": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                case "hits":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId } }).sort({ "stats.stats.hits": -1 }).limit(configs.nhlApi.nbPlayersLimit).toArray(function(err, docs) {
                        resolve(docs);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public async findPlayerInfosQuery(playerId: string, year: number): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats' + year).find({ "player.ID": playerId }).toArray(function(err, docs) {

                resolve(docs);
            });
        });
    }
}
export let daoServePlayersStats: DaoServePlayersStats = new DaoServePlayersStats();
