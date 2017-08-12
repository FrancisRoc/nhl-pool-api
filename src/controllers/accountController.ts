import { createInternalServerError, createError } from "../models/core/apiError";
import { accountService } from "../services/authentification/accountService";

import { IUser } from "../models/user/user";
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
        public async authenticate(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let user = await accountService.authenticate(req.body.username, req.body.password);

        if (user) {
            res.status(HttpStatusCodes.OK);
            res.send(user);
        } else {
            res.status(HttpStatusCodes.BAD_REQUEST);
            res.send("Username or password is incorrect");
        }
    }

    public async register(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        await accountService.create(req.body);
        res.status(HttpStatusCodes.OK);
        res.send();
    }

    public async getAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let nameFragment = req.query["name"];
        let users: AccountInfosDto[];
        if (nameFragment) {
            users = await accountService.getAll(nameFragment);
        } else {
            users = await accountService.getAll();
        }
        res.status(HttpStatusCodes.OK);
        res.send(users);
    }

    public async getCurrent(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        throw createError("NOT IMPLEMNTED YET!", "This function getApplicationPrice has not been implemented yet.")
            .httpStatus(HttpStatusCodes.NOT_IMPLEMENTED)
            .publicMessage("This function getApplicationPrice has not been implemented yet.")
            .logLevel(LogLevel.INFO)
            .build();
    }

    public async _delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        throw createError("NOT IMPLEMNTED YET!", "This function getApplicationPrice has not been implemented yet.")
            .httpStatus(HttpStatusCodes.NOT_IMPLEMENTED)
            .publicMessage("This function getApplicationPrice has not been implemented yet.")
            .logLevel(LogLevel.INFO)
            .build();
    }
}
export let accountController: AccountController = new AccountController();
