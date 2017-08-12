import { dbConnectionService } from "../dbConnectionService";
import { IUser } from "../../models/user/user";
import { IPoolRequest } from "../../models/pool/poolRequest";
import { IPoolResponse } from "../../models/pool/poolResponse";
import { IImportantStats } from "../../models/pool/importantStats";
import { IPoolStatsSelected } from "../../models/pool/poolStatsSelected";

import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";

let util = require("util");
let logger = createLogger("poolDao");
let ObjectId = require('mongodb').ObjectId;

export interface IPoolDao {
    /**
     * Verify if pool already exist to avoid duplicata
     * @param poolName: pool unique name 
     */
    verifyExistingPool(poolName: string): Promise<any>;

    /**
     * Create pool in mongodb
     * @param poolInfos: pool informations (name, members)
     */
    createPool(poolInfos: IPoolResponse): Promise<IPoolResponse>;

    /**
     * Create pool of players id in mongo to be able to make
     * drafting in each pool created
     * @param poolId: pool id to identify collection
     * @param playersIds: players to insert in pooling for drafting
     */
    createPlayersPool(poolId: string, playersIds: string[]): Promise<void>;

    /**
     * Get list of all players id
     */
    getPlayersIds(): Promise<any>;

    /**
     * Get all pools stored in database
     * @param: memberId: member to get all pools
     */
    getAllPools(memberId: string): Promise<IPoolResponse[]>;

    /**
     * Get pool informations associated to poolId
     * @param poolId: pool to get infos (name, members)
     */
    getPoolInformations(poolId: any): Promise<any>;

    /**
     * Associate all members of a pool to its id
     * @param: poolId: pool id
     * @param: memberId: member to add to pool
     */
    addUserToPool(poolId: string, memberId: string): Promise<void>;

    /**
     * Add members to pool id
     * @param: poolId: pool id
     * @param: member: user to add to pool
     */
    addPoolMember(poolId: string, member: IUser): Promise<any>;

    /**
     * Save pool important stats in database
     * @param: poolId: id of pool to save important stats
     * @param: important stats for the pool
     */
    saveImportantStats(poolId: string, importantStats: IPoolStatsSelected): Promise<void>;

    /**
     * Get pool important stats in database for pool id
     * @param: poolId: id of pool to save important stats
     */
    getImportantStats(poolId: string): Promise<IImportantStats[]>;

    /**
     * Update important stat toggled in pool stats section in database
     * @param: poolId: id of pool to update important stats
     * @param: importantStat: Important stat attributes
     */
    updateImportantStats(poolId: string, importantStat: IImportantStats[]): Promise<any>;

    /**
     * Update important stat toggled in pool stats section database
     * @param: poolId: id of pool to update important stats
     * @param: currentStat: Current stat to display when we will revisit pool
     */
    updateCurrentStat(poolId: string, currentStat: string): Promise<any>;
}

class PoolDao implements IPoolDao {

    public async verifyExistingPool(poolName: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Pools').findOne({ name: poolName }, function (err, pool) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }

                logger.debug("Pool found in database: " + util.inspect(pool, false, null));
                if (pool) {
                    logger.debug("Username " + pool.name + " is already taken");
                    return reject(new Error("Pool already exists"));
                }
                return resolve(false);
            });
        });
    }

    public async createPool(poolInfos: IPoolResponse): Promise<any> {
        return new Promise(function (resolve, reject) {
            logger.debug("Create new pool: " + util.inspect(poolInfos, false, null));

            dbConnectionService.getConnection().collection('Pools').insert(poolInfos, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve(doc.ops[0]);
            });
        });
    }

    public async getPlayersIds(): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStats2017').find({}, { "player.ID": 1 }).map(player => player.player.ID).toArray(function (error, docs) {
                if (error) {
                    return reject(error);
                }

                if (docs) {
                    return resolve(docs);
                }
            });
        });
    }

    public async createPlayersPool(poolId: string, playersIds: string[]): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PlayersPooling').insert({ _id: new ObjectId(poolId), playersId: playersIds }, function (error, doc) {
                if (error) {
                    return reject(error);
                }

                if (doc) {
                    return resolve();
                }
            });
        });
    }

    public async getAllPools(memberId: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('MemberPools').find({ memberId: new ObjectId(memberId) }, { _id: 0, poolId: 1 }).toArray(function (error, docs) {
                if (error) {
                    return reject(error);
                }

                if (docs) {
                    logger.debug("Pools id returned: " + util.inspect(docs, false, null));
                    return resolve(docs);
                }
            });
        });
    }

    public async getPoolInformations(poolId: any): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Pools').findOne({ _id: new ObjectId(poolId) }, function (error, pool) {
                if (error) {
                    return reject(error);
                }

                if (pool) {
                    logger.debug("Pools returned: " + util.inspect(pool, false, null));
                    return resolve(pool);
                }
            });
        });
    }

    public async addUserToPool(poolId: string, memberId: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            let association = {
                memberId: memberId,
                poolId: new ObjectId(poolId)
            };

            dbConnectionService.getConnection().collection('MemberPools').insert(association, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
        });
    }

    public async addPoolMember(poolId: string, member: IUser): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Pools').update({ _id: new ObjectId(poolId) }, { $addToSet: { members: member } }, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
         });
    }

    public async saveImportantStats(poolId: string, importantStats: IPoolStatsSelected): Promise<any> {
        let poolStatsSelected: IPoolStatsSelected = {
            _id: new ObjectId(poolId),
            currentStat: importantStats.currentStat,
            importantStats: importantStats.importantStats
        };
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PoolsImportantStats').insert(poolStatsSelected, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
         });
    }

    public async getImportantStats(poolId: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PoolsImportantStats').findOne({ _id: new ObjectId(poolId) }, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve(doc);
            });
         });
    }

    public async updateImportantStats(poolId: string, importantStat: IImportantStats[]): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PoolsImportantStats').update({ _id: new ObjectId(poolId) }, { $set: { importantStats: importantStat  }}, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
         });
    }

    public async updateCurrentStat(poolId: string, curStat: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PoolsImportantStats').update({ _id: new ObjectId(poolId) }, { $set: { currentStat: curStat }}, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
         });
    }
}
export let poolDao: IPoolDao = new PoolDao();
