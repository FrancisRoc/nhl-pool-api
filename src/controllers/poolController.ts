import { poolService } from "../services/poolService";

import { constants, EndpointTypes } from "../../config/constants";
import { createLogger } from "../utils/logger";
import { configs } from "../../config/configs";
import { LogLevel } from "../utils/logLevel";
import { utils } from "../utils/utils";

let autobind = require("autobind-decorator");
let ps = require("ps");

import * as HttpStatusCodes from "http-status-codes";
import * as express from "express";

let logger = createLogger("poolController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class PoolController {
    public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        await poolService.create(req.body);
        res.status(HttpStatusCodes.OK);
        res.send();
    }

    /*public async getAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let nameFragment = req.query["name"];
        let users: AccountInfosDto[]
        if (nameFragment) {
            users = await accountService.getAll(nameFragment);
        } else {
            users = await accountService.getAll();
        }
        res.status(HttpStatusCodes.OK);        
        res.send(users);
    }*/
}
export let poolController: PoolController = new PoolController();