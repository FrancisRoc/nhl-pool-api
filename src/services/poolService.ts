import { IAccountInfos } from "../models/user/accountInfosInterface";
import { IPool } from "../models/pool/pool";

import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoPool } from "./dao/daoPool";
import * as express from "express";

export interface IPoolService {
    /**
     * Create pool
     * @param poolInfos: pool informations (name, members)
     */
    create(poolInfos: IPool): Promise<IPool>

    /**
     * Get all username 
     */
    //getAll(nameFragment?: string): Promise<AccountInfosDto[]>
}

class PoolService implements IPoolService {
    public async create(poolInfos: IPool): Promise<IPool> {
        return daoPool.create(poolInfos);
    }

    /*public async getAll(nameFragment?: string): Promise<AccountInfosDto[]> {
        return daoAccount.getAll(nameFragment);
    }*/
}
export let poolService: PoolService = new PoolService();
