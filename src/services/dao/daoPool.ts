import { dbConnectionService } from "../dbConnectionService";
import { IAccountInfos } from "../../models/user/accountInfosInterface";
import { IPoolRequest } from "../../models/pool/poolRequest";
import { IPoolResponse } from "../../models/pool/poolResponse";

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
    create(poolInfos: IPoolResponse): Promise<IPoolResponse>

    /**
     * Get all pools stored in database
     * @param: memberId: member to get all pools
     */
    getAll(memberId: string): Promise<IPoolResponse[]>

    /**
     * Associate all members of a pool to its id
     * @param: poolId: pool id
     * @param: members: members to associate with pool id
     */
    addUsersToPool(poolId: string, members: IAccountInfos[]): Promise<void>

    /**
     * Add members to pool id
     * @param: poolId: pool id
     * @param: members: members to add to pool
     */
    updatePoolMembers(poolId: string, members: IAccountInfos[]): Promise<void>
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

    public async getAll(memberId: string): Promise<IPoolResponse[]> {
        logger.debug("Dao get all pools called with member id: " + memberId);
        let poolsId: any[] = <any[]> await this.getAllQuery(memberId);

        let pools: IPoolResponse[] = []
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

    public async addUsersToPool(poolId: string, members: IAccountInfos[]): Promise<void> {
        for (let i = 0; i < members.length; i++) {
            await this.addUsersToPoolQuery(poolId, members[i]._id);
        }
    }

    private async addUsersToPoolQuery(poolId: string, memberId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            logger.debug("associate member id " + memberId + " with pool id " + poolId);
            let association = {
                memberId: memberId,
                poolId: poolId
            }

            dbConnectionService.getConnection().collection('MemberPools').insert(association, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
        });
    }

    public async updatePoolMembers(poolId: string, members: IAccountInfos[]): Promise<void> {
        logger.debug("Add users to pool dao called with pool id " + poolId + " and members: " + util.inspect(members, false, null));
        for (let i = 0; i < members.length; i++) {
            await this.updatePoolMembersQuery(poolId, members[i]);
        }
    }

    private async updatePoolMembersQuery(poolId: string, member: IAccountInfos): Promise<{}> {
        logger.debug("Update member " + util.inspect(member, false, null) + " in pool " + poolId);
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Pools').update({ _id: new ObjectId(poolId) }, { $addToSet: { members: member._id } }, function(err, doc) {
                if(err) {
                    return reject(err.name + ': ' + err.message);
                }
                logger.debug("update members successful");
                return resolve()
            });
         });
    }
}
export let daoPool: IDaoPool = new DaoPool();
