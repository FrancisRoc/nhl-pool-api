import { poolService } from "../services/poolService";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";
import { IAccountInfos } from "../models/user/accountInfosInterface";
import { IImportantStats } from "../models/pool/importantStats";
import { PoolStatsSelected } from "../models/pool/poolStatsSelected";

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

    public async updateMembers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let poolId: string = req.params["id"];
        let members: IAccountInfos[] = req.body;

        logger.debug("addMembers endpoint called with pool id " + poolId + " and members: " + util.inspect(members, false, null));

        await poolService.updateMembers(poolId, members);

        res.send();
    }

    public async importantStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let poolId: string = req.params["poolId"];
        logger.debug("importantStats endpoint called");

        let result: IImportantStats[] = await poolService.getImportantStats(poolId);
        //TODO handle errors
        res.send(result);
    }

    public async saveImportantStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let poolId: string = req.params["poolId"];
        let importantStats: PoolStatsSelected = req.body;
        logger.debug("saveImportantStats endpoint called with: " + util.inspect(importantStats, false, null));

        await poolService.saveImportantStats(poolId, importantStats);

        res.send();
    }

    public async updateImportantStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let poolId: string = req.params["poolId"];
        let stats: IImportantStats[] = req.body;

        logger.debug("updateImportantStats endpoint called with pool id " + poolId + " and important stat: " + util.inspect(stats, false, null));

        await poolService.updateImportantStats(poolId, stats);

        res.send();
    }

    public async updateCurrentStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let poolId: string = req.params["poolId"];
        console.log(util.inspect(req.body.currentStat, false, null));
        let currentStat: string = req.body.currentStat;

        logger.debug("updateCurrentStat endpoint called with pool id ");

        await poolService.updateCurrentStat(poolId, currentStat);

        res.send();
    }
}
export let poolController: PoolController = new PoolController();
