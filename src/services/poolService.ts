import { IAccountInfos } from "../models/user/accountInfosInterface";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";

import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { accountService } from "./authentification/accountService";
import { daoPool } from "./dao/daoPool";
import * as express from "express";

export interface IPoolService {
    /**
     * Create pool
     * @param poolInfos: pool informations (name, members)
     */
    create(poolInfos: IPoolRequest): Promise<IPoolResponse>

    /**
     * Get all username
     */
    //getAll(nameFragment?: string): Promise<AccountInfosDto[]>
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

        return daoPool.create(poolWithMembersInfos);
    }

    /*public async getAll(nameFragment?: string): Promise<AccountInfosDto[]> {
        return daoAccount.getAll(nameFragment);
    }*/
}
export let poolService: PoolService = new PoolService();
