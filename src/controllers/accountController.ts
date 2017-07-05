//import { draftPlayerService } from "../services/TODO";
import { accountService } from "../services/authentification/accountService";

import { IAccountInfos } from "../models/user/accountInfosInterface";
import { AccountInfosDto } from "../models/user/accountInfosDto";
import { constants, EndpointTypes } from "../../config/constants";
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
let jwtDecode = require('jwt-decode');
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class AccountController {
    public async authentification(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let authHeader = req.header('Authorization');

        let parts: string[] = authHeader.trim().split(' ');
        let token = parts[1];   // Get id-token without Bearer

        let decodedBody = jwtDecode(token);
        logger.debug(decodedBody);

        //Send data to mongo if not exist. Else retrive data from mongo
        logger.debug("Verify user called");
        let userId: string = decodedBody.sub.split('|')[1];
        let accountInfo: AccountInfosDto = await accountService.verifyUser(userId);

        if (!accountInfo.getUserId()) {
            //Create an account
            logger.debug("User doesn't exist. Signup, creating user in database...");
            let dto = new AccountInfosDto(this.extractUserAccountInfos(decodedBody));
            accountInfo = await accountService.createAccount(dto);
        }

        if (accountInfo == null) {
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR);
            res.send();
            return;
        }

        //Send user to application
        res.status(HttpStatusCodes.ACCEPTED);
        res.send(accountInfo);
    }

    private extractUserAccountInfos(decodedBody: any): IAccountInfos {
        // Differentiate connection types
        let accountInfo: IAccountInfos;
        if (decodedBody.sub.indexOf('google-oauth2') > -1) {
            //Google auth
            accountInfo = {
                "name": decodedBody.name,
                "nickname": decodedBody.nickname,
                "email": decodedBody.nickname + "@gmail.com",
                "_id": decodedBody.sub.split('|')[1]         //Substring unique id in sub
            }
        } else if (decodedBody.sub.indexOf('facebook') > -1) {
            //Facebook auth
            accountInfo = {
                "name": decodedBody.name,
                "nickname": decodedBody.nickname,
                "email": "",
                "_id": decodedBody.sub.split('|')[1]         //Substring unique id in sub
            }
        } else if (decodedBody.sub.indexOf('auth0') > -1) {
            //OAuth auth
            accountInfo = {
                "name": decodedBody.nickname,
                "nickname": decodedBody.nickname,
                "email": decodedBody.name,
                "_id": decodedBody.sub.split('|')[1]         //Substring unique id in sub
            }
        }
        return accountInfo
    }

    public async createAccount(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let jsonBody: JSON = ps.parse(req.body);

        //Encapsulate user account creation in DTO
        //TODO
        /*let accountInfo: IAccountInfos = {
            "firstName": "test",
            "lastName": "test",
            "email": "test",
            "dateOfBirth": new Date(),
            "userName": "test",
            "password": "test"
        }*/

        //let accountInfosDto: AccountInfosDto = new AccountInfosDto(accountInfo);
        //Call service to create account in mongodb
    }
}
export let accountController: AccountController = new AccountController();
