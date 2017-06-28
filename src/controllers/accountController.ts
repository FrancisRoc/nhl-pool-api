//import { draftPlayerService } from "../services/TODO";
import { IAccountInfos } from "../models/user/accountInfosInterface";
import { AccountInfosDto } from "../models/user/accountInfosDto";
import { constants, EndpointTypes } from "../../config/constants";
import { LocalStrategyInfo } from "passport-local";
import { createLogger } from "../utils/logger";
import { configs } from "../../config/configs";
import { LogLevel } from "../utils/logLevel";
import { utils } from "../utils/utils";

let autobind = require("autobind-decorator");
let ps = require("ps");

import * as HttpStatusCodes from "http-status-codes";
import * as passport from "passport";
import * as express from "express";

let logger = createLogger("accountController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class AccountController {
    public async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        res.send();
    }

    public async createAccount(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let jsonBody: JSON = ps.parse(req.body);

        //Encapsulate user account creation in DTO
        //TODO
        let accountInfo: IAccountInfos = {
            "firstName": "test",
            "lastName": "test",
            "email": "test",
            "dateOfBirth": new Date(),
            "userName": "test",
            "password": "test"
        }

        let accountInfosDto: AccountInfosDto = new AccountInfosDto(accountInfo);
        //Call service to create account in mongodb
    }
}
export let accountController: AccountController = new AccountController();