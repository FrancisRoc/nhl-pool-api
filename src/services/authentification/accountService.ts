import { AccountInfosDto } from "../../models/user/accountInfosDto";
import { IAccountInfos } from "../../models/user/accountInfosInterface";

import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { daoAccount } from "../dao/daoAccount";
import * as express from "express";

export interface IAccountService {
    /**
     * Verify if user has an account
     * @param username: user identifiant
     */
    getUser(username: string): Promise<IAccountInfos>

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

    /**
     * Get all username
     */
    getAll(nameFragment?: string): Promise<AccountInfosDto[]>
}

class AccountService implements IAccountService {
    public async getUser(username: string): Promise<IAccountInfos> {
        return daoAccount.getUser(username);
    }

    public async authenticate(username: string, password: string): Promise<{}> {
        return daoAccount.authenticate(username, password);
    }

    public async create(userInfos: any): Promise<void> {
        return daoAccount.create(userInfos);
    }

    public async getAll(nameFragment?: string): Promise<AccountInfosDto[]> {
        return daoAccount.getAll(nameFragment);
    }
}
export let accountService: AccountService = new AccountService();
