import { dbConnectionService } from "../dbConnectionService";
import { AccountInfosDto } from "../../models/user/accountInfosDto";
import { IAccountInfos } from "../../models/user/accountInfosInterface";

import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";

let _ = require('lodash');
let util = require("util");
let bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken');
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

    /**
     * Verify if user has an account with find request in mongo
     * @param username: user identifiant
     * @param password: user password
     */
    authentificate(username: string, password: string): Promise<{}>

    /**
     * Create user account in db
     * @param userInfos: user informations
     */
    create(userInfos: any): Promise<void>
}

class DaoAccount implements IDaoAccount {
    public async verifyUser(userId: string): Promise<AccountInfosDto> {
        let accountInfos: IAccountInfos = <IAccountInfos>await this.verifyUserQuery(userId);
        let userInfos: AccountInfosDto = new AccountInfosDto(accountInfos);
        logger.debug("User found: " + util.inspect(userInfos, false, null));
        return userInfos;
    }

    private async verifyUserQuery(userId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').find({ _id: userId }).limit(1).toArray(function (err, docs) {
                resolve(docs[0]);
            });
        });
    }

    public async authentificate(username: string, password: string): Promise<{}> {
        let userInfos = await this.authetificateQuery(username, password);
        logger.debug("User found: " + util.inspect(userInfos, false, null));
        return userInfos;
    }

    private async authetificateQuery(username: string, password: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').find({ username: username }).limit(1).toArray(function (err, docs) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }

                let user: any = docs[0];
                if (user && bcrypt.compareSync(password, user.hash)) {
                    // authentication successful
                    return resolve({
                        _id: user._id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: jwt.sign({ sub: user._id }, configs.dataSources.mongodb.secret)
                    });
                } else {
                    // authentication failed
                    return resolve();
                }
            });
        });
    }

    public async create(userInfos: any): Promise<void> {
        logger.debug("Dao create account called");
        let userExist: boolean = <boolean>await this.verifyExistingUserQuery(userInfos);

        if (!userExist) {
            await this.createUser(userInfos);
        }
    }

    private async verifyExistingUserQuery(userInfos: any): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').findOne({ username: userInfos.username }, function (err, user) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }

                logger.debug("User found in database: " + util.inspect(user, false, null));
                if (user) {
                    logger.debug("Username " + userInfos.username + " is already taken");
                    return reject();
                }
                return resolve(false);
            });
        });
    }

    private async createUser(userInfos: any): Promise<{}> {
        return new Promise(function (resolve, reject) {
            logger.debug("User not found in data. Create new user: " + util.inspect(userInfos, false, null));

            // set user object to userParam without the cleartext password
            var user = _.omit(userInfos, 'password');
            // add hashed password to user object
            user.hash = bcrypt.hashSync(userInfos.password, 10);

            dbConnectionService.getConnection().collection('Users').insert(user, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve();
            });
        });
    }

    public async createAccount(userInfos: AccountInfosDto): Promise<AccountInfosDto> {
        logger.debug("Dao create account called");
        let accountInfos: AccountInfosDto = new AccountInfosDto(<IAccountInfos>await this.createAccountQuery(userInfos));
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
