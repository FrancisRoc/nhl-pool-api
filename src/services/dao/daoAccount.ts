import { dbConnectionService } from "../dbConnectionService";
import { AccountInfosDto } from "../../models/user/accountInfosDto";
import { IAccountInfos } from "../../models/user/accountInfosInterface";

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
    verifyUser(userId: string): Promise<AccountInfosDto>

    /**
     * Create user account in db
     * @param userInfos: user informations
     */
    createAccount(userInfos: AccountInfosDto): Promise<AccountInfosDto>
}

class DaoAccount implements IDaoAccount {
    public async verifyUser(userId: string): Promise<AccountInfosDto> {
        let accountInfos: IAccountInfos = <IAccountInfos> await this.verifyUserQuery(userId);
        let userInfos: AccountInfosDto = new AccountInfosDto(accountInfos);
        logger.debug("User found: " + util.inspect(userInfos, false, null));
        return userInfos;
    }

    private async verifyUserQuery(userId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').find({_id: userId}).limit(1).toArray(function(err, docs) {
                resolve(docs[0]);
            });
        });
    }

    public async createAccount(userInfos: AccountInfosDto): Promise<AccountInfosDto> {
        logger.debug("Dao create account called");
        let accountInfos: AccountInfosDto = new AccountInfosDto(<IAccountInfos> await this.createAccountQuery(userInfos));
        return accountInfos
    }

    private async createAccountQuery(userInfos: AccountInfosDto): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').insert(userInfos, null, function (error, result) {
                if (error) {
                    return reject(error);
                }

                if (result) {
                    logger.debug("User created: " + util.inspect(result.ops[0], false, null));
                    return resolve(userInfos);
                }
            });
        });
    }
}
export let daoAccount: IDaoAccount = new DaoAccount();
