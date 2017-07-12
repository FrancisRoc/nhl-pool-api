import { poolService } from "../services/poolService";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";

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
        // Create pool informations interface
        logger.debug("Create pool endpoint called");
        let poolInfos: IPoolRequest = req.body;

        logger.debug("Pool informations: " + util.inspect(poolInfos, false, null));
        let poolCreated: IPoolResponse = await poolService.create(poolInfos);
        res.status(HttpStatusCodes.OK);
        res.send(poolCreated);
    }

    public async getAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let memberId: string = req.params["memberId"];
        logger.debug("Get all pools for member: " + memberId);
        let pools: IPoolResponse[] = await poolService.getAll(memberId);
        res.status(HttpStatusCodes.OK);
        res.send(pools);
    }
}
export let poolController: PoolController = new PoolController();
