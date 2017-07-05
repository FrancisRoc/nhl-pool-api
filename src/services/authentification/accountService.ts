import { AccountInfosDto } from "../../models/user/accountInfosDto";

import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { daoAccount } from "../dao/daoAccount";
import * as express from "express";

export interface IAccountService {
    /**
     * Verify if user has an account
     * @param userId: user identifiant
     */
    verifyUser(userId: string): Promise<boolean>

    /**
     * Create user account
     * @param userInfos: user informations
     */
    createAccount(userInfos: AccountInfosDto): Promise<boolean>
}

class AccountService implements IAccountService {
    public async verifyUser(userId: string): Promise<boolean> {
        return daoAccount.verifyUser(userId);
    }

    public async createAccount(userInfos: AccountInfosDto): Promise<boolean> {
        return daoAccount.createAccount(userInfos);
    }
}
export let accountService: AccountService = new AccountService();
