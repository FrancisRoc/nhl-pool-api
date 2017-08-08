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
     * @param username: user identifiant
     */
    getUser(username: string): Promise<IAccountInfos>;

    /**
     * Create user account in db
     * @param userInfos: user informations
     */
    createAccount(userInfos: AccountInfosDto): Promise<AccountInfosDto>;

    /**
     * Verify if user has an account with find request in mongo
     * @param username: user identifiant
     * @param password: user password
     */
    authenticate(username: string, password: string): Promise<{}>;

    /**
     * Create user account in db
     * @param userInfos: user informations
     */
    create(userInfos: any): Promise<void>;

    /**
     * Get all username stored in database
     */
    getAll(nameFragment?: string): Promise<AccountInfosDto[]>;
}

class DaoAccount implements IDaoAccount {
    public async getUser(username: string): Promise<IAccountInfos> {
        let user: IAccountInfos = <IAccountInfos>await this.verifyUserQuery(username);
        logger.debug("User found: " + util.inspect(user, false, null));
        return user;
    }

    private async verifyUserQuery(username: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').find({ username: username }, { _id: 1, name: 1, username: 1 }).limit(1).toArray(function (err, docs) {
                resolve(docs[0]);
            });
        });
    }

    public async authenticate(username: string, password: string): Promise<{}> {
        let userInfos = await this.authenticateQuery(username, password);
        logger.debug("User found: " + util.inspect(userInfos, false, null));
        return userInfos;
    }

    private async authenticateQuery(username: string, password: string): Promise<{}> {
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
                        name: user.name,
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
            let user = _.omit(userInfos, 'password');
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
        return accountInfos;
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

    public async getAll(nameFragment?: string): Promise<AccountInfosDto[]> {
        logger.debug("Dao get all users called");

        let users: IAccountInfos[] = [];
        if (nameFragment) {
            users = <IAccountInfos[]> await this.getAllFilteredQuery(nameFragment);
        } else {
            users = <IAccountInfos[]> await this.getAllQuery();
        }

        let usersDto: AccountInfosDto[] = [];
        for (let i = 0; i < users.length; i++) {
            usersDto.push(new AccountInfosDto(users[i]));
        }

        return usersDto;
    }

    private async getAllQuery(): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').find({}).toArray(function (error, docs) {
                if (error) {
                    return reject(error);
                }

                if (docs) {
                    logger.debug("Users returned: " + util.inspect(docs, false, null));
                    return resolve(docs);
                }
            });
        });
    }

    private async getAllFilteredQuery(nameFragment: string): Promise<{}> {
        logger.debug("getAllFilteredQuery called");
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('Users').find({ name: { $regex: new RegExp(nameFragment), $options: 'i' } }).toArray(function (error, docs) {
                if (error) {
                    return reject(error);
                }

                if (docs) {
                    logger.debug("Users returned: " + util.inspect(docs, false, null));
                    return resolve(docs);
                }
            });
        });
    }
}
export let daoAccount: IDaoAccount = new DaoAccount();
