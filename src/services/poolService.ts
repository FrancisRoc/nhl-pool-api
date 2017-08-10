import { IUser } from "../models/user/user";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";
import { IImportantStats } from "../models/pool/importantStats";
import { IPoolStatsSelected } from "../models/pool/poolStatsSelected";

import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { accountService } from "./authentification/accountService";
import { daoPool } from "./dao/daoPool";
import * as express from "express";

let util = require('util');

export interface IPoolService {
    /**
     * Create pool
     * @param poolInfos: pool informations (name, members)
     */
    create(poolInfos: IPoolRequest): Promise<IPoolResponse>;

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
        let membersInfos: IUser[] = [];
        for (let i = 0; i < poolInfos.members.length; i++) {
            let singleMemberInfo: IUser = await accountService.getUser(poolInfos.members[i]);
            membersInfos.push(singleMemberInfo);
        }

        let poolWithMembersInfos: IPoolResponse = {
            name: poolInfos.name,
            members: membersInfos
        };

        let pool: IPoolResponse = <IPoolResponse> await daoPool.create(poolWithMembersInfos);

        // Add pool id to all members
        await daoPool.addUsersToPool(pool._id, pool.members);

        // Create mongo collection with players id for drafting purpose
        await daoPool.createPlayerPool(pool._id);

        return pool;
    }

    public async getAll(memberId: string): Promise<IPoolResponse[]> {
        return await daoPool.getAll(memberId);
    }

    public async updateMembers(poolId: string, members: IUser[]): Promise<void> {
        let membersInfos: IUser[] = [];
        for (let i = 0; i < members.length; i++) {
            console.log("TODO REMOVE. MEMBERS: " + util.inspect(members[i], false, null));
            let singleMemberInfo: IUser = await accountService.getUser(members[i].username);
            membersInfos.push(singleMemberInfo);
        }

        await daoPool.addUsersToPool(poolId, membersInfos);
        await daoPool.updatePoolMembers(poolId, membersInfos);
    }

    public async saveImportantStats(poolId: string, importantStats: IPoolStatsSelected): Promise<void> {
        await daoPool.saveImportantStats(poolId, importantStats);
    }

    public async getImportantStats(poolId: string): Promise<IImportantStats[]> {
        return await daoPool.getImportantStats(poolId);
    }

    public async updateImportantStats(poolId: string, importantStat: IImportantStats[]): Promise<void> {
        await daoPool.updateImportantStats(poolId, importantStat);
    }

    public async updateCurrentStat(poolId: string, currentStat: string): Promise<void> {
        await daoPool.updateCurrentStat(poolId, currentStat);
    }
}
export let poolService: PoolService = new PoolService();
