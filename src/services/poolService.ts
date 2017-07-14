import { IAccountInfos } from "../models/user/accountInfosInterface";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";

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
    create(poolInfos: IPoolRequest): Promise<IPoolResponse>

    /**
     * Get all pools
     * @param: memberId: member to get all pools
     */
    getAll(memberId: string): Promise<IPoolResponse[]>

    /**
     * Update pool members associated with pool id
     * @param: poolId: id of pool to update members
     * @param: members to add to pool
     */
    updateMembers(poolId: string, members: IAccountInfos[]): Promise<void>
}

class PoolService implements IPoolService {
    public async create(poolInfos: IPoolRequest): Promise<IPoolResponse> {
        let membersInfos: IAccountInfos[] = [];
        for (let i = 0; i < poolInfos.members.length; i++) {
            let singleMemberInfo: IAccountInfos = await accountService.getUser(poolInfos.members[i]);
            membersInfos.push(singleMemberInfo);
        }

        let poolWithMembersInfos: IPoolResponse = {
            name: poolInfos.name,
            members: membersInfos
        }

        let pool: IPoolResponse = <IPoolResponse> await daoPool.create(poolWithMembersInfos);

        // Add pool id to all members
        await daoPool.addUsersToPool(pool._id, pool.members);
        return pool;
    }

    public async getAll(memberId: string): Promise<IPoolResponse[]> {
        return await daoPool.getAll(memberId);
    }

    public async updateMembers(poolId: string, members: IAccountInfos[]): Promise<void> {
        let membersInfos: IAccountInfos[] = [];
        for (let i = 0; i < members.length; i++) {
            console.log("TODO REMOVE. MEMBERS: " + util.inspect(members[i], false, null));
            let singleMemberInfo: IAccountInfos = await accountService.getUser(members[i].username);
            membersInfos.push(singleMemberInfo);
        }

        await daoPool.addUsersToPool(poolId, membersInfos);
        await daoPool.updatePoolMembers(poolId, membersInfos);
    }
}
export let poolService: PoolService = new PoolService();
