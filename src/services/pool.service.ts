import { IUser } from "../models/user/user";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";
import { IImportantStats } from "../models/pool/importantStats";
import { IPoolStatsSelected } from "../models/pool/poolStatsSelected";

import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { accountService } from "./authentification/accountService";
import { poolDao } from "./dao/poolDao";
import * as express from "express";

let util = require('util');

export interface IPoolService {
    /**
     * Create pool
     * @param poolInfos: pool informations (name, members)
     */
    create(poolInfos: IPoolRequest): Promise<IPoolResponse>;

    /**
     * Delete pool
     * @param poolId: pool to remove from database
     */
    _delete(poolId: string): Promise<IPoolResponse>;

    /**
     * Get all pools
     * @param: memberId: member to get all pools
     */
    getAll(memberId: string): Promise<IPoolResponse[]>;

    /**
     * Update pool members associated with pool id
     * @param: poolId: id of pool to update members
     * @param: members to add to pool
     */
    updateMembers(poolId: string, members: IUser[]): Promise<void>;

    /**
     * Save pool important stats
     * @param: poolId: id of pool to save important stats
     * @param: important stats for the pool
     */
    saveImportantStats(poolId: string, importantStats: IPoolStatsSelected): Promise<void>;

    /**
     * Get pool important stats
     * @param: poolId: id of pool to save important stats
     */
    getImportantStats(poolId: string): Promise<IImportantStats[]>;

    /**
     * Update important stat toggled in pool stats section
     * @param: poolId: id of pool to update important stats
     * @param: importantStat: Important stat attributes
     */
    updateImportantStats(poolId: string, importantStat: IImportantStats[]): Promise<void>;

    /**
     * Update important stat toggled in pool stats section
     * @param: poolId: id of pool to update important stats
     * @param: currentStat: Current stat to display when we will revisit pool
     */
    updateCurrentStat(poolId: string, currentStat: string): Promise<void>;
}

class PoolService implements IPoolService {
    public async create(poolInfos: IPoolRequest): Promise<IPoolResponse> {
// TODO make verify if pool exist function to avoid sending all users infos for nothing
        let membersInfos: IUser[] = [];
        let poolWithMembersInfos: IPoolResponse;
        try {
            for (let i = 0; i < poolInfos.members.length; i++) {
                let singleMemberInfo: IUser = await accountService.getUser(poolInfos.members[i]);
                membersInfos.push(singleMemberInfo);
            }

            poolWithMembersInfos = {
                name: poolInfos.name,
                members: membersInfos
            };

        } catch (error) {
            return Promise.reject(error);
        }

        let poolExist: boolean;
        try {
           poolExist  = <boolean> await poolDao.verifyExistingPool(poolInfos.name);
        } catch (error) {
            return Promise.reject(error);
        }

        let pool: IPoolResponse;
        try {
            if (!poolExist) {
                pool = <IPoolResponse> await poolDao.createPool(poolWithMembersInfos);
            } else {
                // Handle pool exist
                return Promise.reject(null);
            }
        } catch (error) {
            return Promise.reject(error);
        }

        try {   // Add pool id to all members
            for (let i = 0; i < pool.members.length; i++) {
                await poolDao.addUserToPool(pool._id, pool.members[i]._id);
            }
        } catch (error) {
            return Promise.reject(error);
        }

        // Create mongo collection with players id for drafting purpose
        let playersIds: string[];
        try { 
            // Get all players id
            playersIds = <string[]> await poolDao.getPlayersIds();
        } catch (error) {
            return Promise.reject(error);
        }

        try { 
            // Get all players id
            await poolDao.createPlayersPool(pool._id, playersIds);
        } catch (error) {
            return Promise.reject(error);
        }

        return Promise.resolve(pool);
    }

    public async _delete(poolId: string): Promise<IPoolResponse> {
        return null;
    }

    public async getAll(memberId: string): Promise<IPoolResponse[]> {
        let poolsId: any[];
        try {
            poolsId = <any[]> await poolDao.getAllPools(memberId);
        } catch (error) {
            return Promise.reject(error);
        }

        let pools: IPoolResponse[] = [];
        try {
            for (let i = 0; i < poolsId.length; i++) {
                let pool: IPoolResponse = <IPoolResponse> await poolDao.getPoolInformations(poolsId[i].poolId);
                pools.push(pool);
            }
        } catch (error) {
           return Promise.reject(error); 
        }

        return pools;
    }

    public async updateMembers(poolId: string, members: IUser[]): Promise<void> {
        let membersInfos: IUser[] = [];
        try {
            for (let i = 0; i < members.length; i++) {
                let singleMemberInfo: IUser = await accountService.getUser(members[i].username);
                membersInfos.push(singleMemberInfo);
            }
        } catch (error) {
            return Promise.reject(error);
        }
        
        try {
            for (let i = 0; i < membersInfos.length; i++) {
                await poolDao.addUserToPool(poolId, membersInfos[i]._id);
            }
        } catch (error) {
            return Promise.reject(error);
        }

        try {
            for (let i = 0; i < membersInfos.length; i++) {
                await poolDao.addPoolMember(poolId, membersInfos[i]);
            }
        } catch (error) {
            return Promise.reject(error);
        }
        
    }

    public async saveImportantStats(poolId: string, importantStats: IPoolStatsSelected): Promise<void> {
        try {
            await poolDao.saveImportantStats(poolId, importantStats);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async getImportantStats(poolId: string): Promise<IImportantStats[]> {
        try {
             return await poolDao.getImportantStats(poolId);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async updateImportantStats(poolId: string, importantStat: IImportantStats[]): Promise<void> {
        try {
             await poolDao.updateImportantStats(poolId, importantStat);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async updateCurrentStat(poolId: string, currentStat: string): Promise<void> {
        try {
             await poolDao.updateCurrentStat(poolId, currentStat);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
export let poolService: PoolService = new PoolService();
