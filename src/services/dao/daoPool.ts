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
let logger = createLogger("daoPool");
let ObjectId = require('mongodb').ObjectId;

export interface IDaoPool {
    /**
     * Create pool in mongodb
     * @param poolInfos: pool informations (name, members)
     */
    create(poolInfos: IPoolResponse): Promise<IPoolResponse>;

    /**
     * Create pool of players id in mongo to be able to make
     * drafting in each pool created
     * @param poolId: pool id to identify collection
     */
    createPlayerPool(poolId: string): Promise<void>;

    /**
     * Get all pools stored in database
     * @param: memberId: member to get all pools
     */
    getAll(memberId: string): Promise<IPoolResponse[]>;

    /**
     * Associate all members of a pool to its id
     * @param: poolId: pool id
     * @param: members: members to associate with pool id
     */
    addUsersToPool(poolId: string, members: IUser[]): Promise<void>;

    /**
     * Add members to pool id
     * @param: poolId: pool id
     * @param: members: members to add to pool
     */
    updatePoolMembers(poolId: string, members: IUser[]): Promise<void>;

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
    updateImportantStats(poolId: string, importantStat: IImportantStats[]): Promise<{}>;

    /**
     * Update important stat toggled in pool stats section database
     * @param: poolId: id of pool to update important stats
     * @param: currentStat: Current stat to display when we will revisit pool
     */
    updateCurrentStat(poolId: string, currentStat: string): Promise<{}>;
}

class DaoPool implements IDaoPool {
    public async create(poolInfos: IPoolResponse): Promise<IPoolResponse> {
        logger.debug("Dao create pool called");
        let poolExist: boolean = <boolean>await this.verifyExistingPoolQuery(poolInfos.name);

        if (!poolExist) {
            return <IPoolResponse>await this.createPoolQuery(poolInfos);
        }
    }

    private async verifyExistingPoolQuery(poolName: string): Promise<{}> {
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

    private async createPoolQuery(poolInfos: IPoolResponse): Promise<{}> {
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

    public async createPlayerPool(poolId: string): Promise<void> {
        logger.debug("Dao create players pool called");

        // Get all players id
        let playersIds: string[] = <string[]> await this.getPlayersIds();
        await this.createPlayersPoolQuery(poolId, playersIds);
    }

    private async getPlayersIds(): Promise<{}> {
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

    private async createPlayersPoolQuery(poolId: string, playersIds: string[]): Promise<{}> {
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

    public async getAll(memberId: string): Promise<IPoolResponse[]> {
        logger.debug("Dao get all pools called with member id: " + memberId);
        let poolsId: any[] = <any[]> await this.getAllQuery(memberId);

        let pools: IPoolResponse[] = [];
        for (let i = 0; i < poolsId.length; i++) {
            let pool: IPoolResponse = <IPoolResponse> await this.getPoolQuery(poolsId[i].poolId);
            pools.push(pool);
        }
        return pools;
    }

    private async getAllQuery(memberId: string): Promise<{}> {
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

    private async getPoolQuery(poolId: any): Promise<{}> {
        return new Promise(function (resolve, reject) {
            logger.debug("Get pool by id called with id: " + poolId);
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

    public async addUsersToPool(poolId: string, members: IUser[]): Promise<void> {
        for (let i = 0; i < members.length; i++) {
            logger.debug("Add member: " + util.inspect(members[i], false, null));
            await this.addUsersToPoolQuery(poolId, members[i]._id);
        }
    }

    private async addUsersToPoolQuery(poolId: string, memberId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            logger.debug("associate member id " + memberId + " with pool id " + poolId);
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

    public async updatePoolMembers(poolId: string, members: IUser[]): Promise<void> {
        logger.debug("Add users to pool dao called with pool id " + poolId + " and members: " + util.inspect(members, false, null));
        for (let i = 0; i < members.length; i++) {
            await this.updatePoolMembersQuery(poolId, members[i]);
        }
    }

    private async updatePoolMembersQuery(poolId: string, member: IUser): Promise<{}> {
        logger.debug("Update member " + util.inspect(member, false, null) + " in pool " + poolId);
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Pools').update({ _id: new ObjectId(poolId) }, { $addToSet: { members: member } }, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                logger.debug("update members successful");
                return resolve();
            });
         });
    }

    public async saveImportantStats(poolId: string, importantStats: IPoolStatsSelected): Promise<void> {
        logger.debug("Save pool important stats " + util.inspect(importantStats, false, null) + " in pool " + poolId);
        this.saveImportantStatsQuery(poolId, importantStats);
    }

    private async saveImportantStatsQuery(poolId: string, importantStats: IPoolStatsSelected): Promise<{}> {
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
                logger.debug("save important stats successful");
                return resolve();
            });
         });
    }

    public async getImportantStats(poolId: string): Promise<IImportantStats[]> {
        logger.debug("Get pool important stats for pool " + poolId);
        return <IImportantStats[]> await this.getImportantStatsQuery(poolId);
    }

    private async getImportantStatsQuery(poolId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PoolsImportantStats').findOne({ _id: new ObjectId(poolId) }, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                logger.debug("get important stats successful: " + util.inspect(doc, false, null));
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
                //logger.debug("update important stats successful: " + util.inspect(doc, false, null));
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
                //logger.debug("important stat update current stat successful: " + util.inspect(doc, false, null));
                return resolve();
            });
         });
    }
}
export let daoPool: IDaoPool = new DaoPool();
