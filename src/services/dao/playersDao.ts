import { dbConnectionService } from "../dbConnectionService";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";

let MongoClient = require("mongodb").MongoClient;
let ObjectId = require('mongodb').ObjectId;
const util = require("util");

import * as Player from "../../models/playerInfoModel/playerInfos";
import * as express from "express";

let logger = createLogger("playersDao");

export interface IPlayersDao {
    /**
     * Request to find players stats ordered with wanted
     * stat to mongodb
     * @param requestedStat: Stat we want to order stats by
     * @param playersId: Players undrafted in pool specified
     * @param positions: Positions we want want to fetch stats
     * @param limit: Number of players we want to fetch
     */
    findStatsOrderedBy(requestedStat: string, playersId: number[], positions: string[], limit: number): Promise<any>;

    /**
     * Get all players ids of requested pool
     * @param poolId: Requested pool to get players
     */
    getPoolPlayersIds(poolId: string): Promise<any>;

    /**
     * Get player detailed informations
     * @param playerId: Player from who we want stats
     * @param year: Year of requested stats
     */
    findPlayerInfos(playerId: string, year: number): Promise<any>;
}

class PlayersDao implements IPlayersDao {

    public async getPoolPlayersIds(poolId: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PlayersPooling').find({ _id: new ObjectId(poolId) }, { _id: 0, playersId: 1 }).toArray(function (err, docs) {
                if (err) {
                    return reject(err);
                }
                resolve(docs[0].playersId);
            });
        });
    }

    public async findStatsOrderedBy(requestedStat: string, playersId: number[], positions: string[], limit: number): Promise<any> {
        return new Promise(function (resolve, reject) {
            switch (requestedStat) {
                case "goals":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.goals": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "assists":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.assists": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "points":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.points": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "plusMinus":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.plusMinus": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "penalityMin":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.penalityMin": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "powerplayGoals":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.powerplayGoals": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "shorthandedGoals":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.shorthandedGoals": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "powerplayPoints":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.powerplayPoints": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "shorthandedPoints":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.shorthandedPoints": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                case "hits":
                    dbConnectionService.getConnection().collection('AllStats2017').find({ "player.ID": { $in: playersId }, "player.Position": { $in: positions } }).sort({ "stats.stats.hits": -1 }).limit(limit).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        }
                        resolve(docs);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    public async findPlayerInfos(playerId: string, year: number): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats' + year).find({ "player.ID": playerId }).toArray(function (err, docs) {
                if (err) {
                    reject(err);
                }
                resolve(docs);
            });
        });
    }
}
export let playersDao: PlayersDao = new PlayersDao();
