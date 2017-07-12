import { dbConnectionService } from "../dbConnectionService";
import { IAccountInfos } from "../../models/user/accountInfosInterface";
import { IPool } from "../../models/pool/pool";

import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";

let util = require("util");
let logger = createLogger("daoPool");

export interface IDaoPool {
    /**
     * Create pool in mongodb
     * @param poolInfos: pool informations (name, members)
     */
    create(poolInfos: IPool): Promise<IPool>

    /**
     * Get all pools stored in database
     */
    //getAll(nameFragment?: string): Promise<AccountInfosDto[]>
}

class DaoPool implements IDaoPool {
    public async create(poolInfos: IPool): Promise<IPool> {
        logger.debug("Dao create pool called");
        return <IPool> await this.createPoolQuery(poolInfos);
    }

    private async createPoolQuery(poolInfos: IPool): Promise<{}> {
        return new Promise(function (resolve, reject) {
            logger.debug("Create new pool: " + util.inspect(poolInfos, false, null));

            dbConnectionService.getConnection().collection('Pools').insert(poolInfos, function (err, doc) {
                if (err) {
                    return reject(err.name + ': ' + err.message);
                }
                return resolve(doc);
            });
        });
    }

    /*public async getAll(nameFragment?: string): Promise<AccountInfosDto[]> {
        logger.debug("Dao get all users called");

        let users: IAccountInfos[] = [];
        if (nameFragment) {
            users = <IAccountInfos[]> await this.getAllFilteredQuery(nameFragment);
        } else {
            //TODO get ordered by pool name
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
            dbConnectionService.getConnection().collection('Users').find({}).toArray(function(error, docs) {
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
*/
}
export let daoPool: IDaoPool = new DaoPool();
