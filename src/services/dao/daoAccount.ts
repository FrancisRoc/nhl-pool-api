import { dbConnectionService } from "../dbConnectionService";
import { AccountInfosDto } from "../../models/user/accountInfosDto";

import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";
const util = require("util");

let logger = createLogger("daoAccount");

export interface IDaoAccount {
    /**
     * Verify if user has an account with find request in mongo
     * @param userId: user identifiant
     */
    verifyUser(userId: string): Promise<boolean>

    /**
     * Create user account in db
     * @param userInfos: user informations
     */
    createAccount(userInfos: AccountInfosDto): Promise<boolean>
}

class DaoAccount implements IDaoAccount {
    public async verifyUser(userId: string): Promise<boolean> {
        //dbConnectionService.getConnection().collection('Users')
        return false;
    }

    public async createAccount(userInfos: AccountInfosDto): Promise<boolean> {
        //dbConnectionService.getConnection().collection('Users')
        return false;
    }
}
export let daoAccount: IDaoAccount = new DaoAccount();
