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
    verifyUser(userId: string): Promise<AccountInfosDto>

    /**
     * Create user account
     * @param userInfos: user informations
     */
    createAccount(userInfos: AccountInfosDto): Promise<AccountInfosDto>

    /**
     * Verify if user has an account
     * @param username: user identifiant
     * @param password: user password
     */
    authenticate(username: string, password: string): Promise<{}>

    /**
     * Create user account
     * @param userInfos: user informations
     */
    create(userInfos: any): Promise<void>
}

class AccountService implements IAccountService {
    public async verifyUser(userId: string): Promise<AccountInfosDto> {
        return daoAccount.verifyUser(userId);
    }

    public async createAccount(userInfos: AccountInfosDto): Promise<AccountInfosDto> {
        return daoAccount.createAccount(userInfos);
    }

    public async authenticate(username: string, password: string): Promise<{}> {
        return daoAccount.authenticate(username, password);
    }

    public async create(userInfos: any): Promise<void> {
        return daoAccount.create(userInfos);
    }
}
export let accountService: AccountService = new AccountService();
