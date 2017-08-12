import { createInternalServerError } from "../models/core/apiError";
import { poolService } from "../services/pool.service";
import { IPoolRequest } from "../models/pool/poolRequest";
import { IPoolResponse } from "../models/pool/poolResponse";
import { IUser } from "../models/user/user";
import { IImportantStats } from "../models/pool/importantStats";
import { IPoolStatsSelected } from "../models/pool/poolStatsSelected";

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

        try {
            const pool: IPoolRequest = req.body;

            return poolService.create(pool)
                .then((createdPool: IPoolResponse) => {
                    res.status(HttpStatusCodes.OK).send(createdPool);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while creating new pool.", error));
        }

    }

    // TODO implement endpoint to delete pool

    public async getAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const memberId: string = req.params.memberId;

            return poolService.getAll(memberId)
                .then((membersPools: IPoolResponse[]) => {
                    res.status(HttpStatusCodes.OK).send(membersPools);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while getting all pools for a user.", error));
        }

    }

    public async updateMembers(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const poolId: string = req.params.id;
            const members: IUser[] = req.body;

            return poolService.updateMembers(poolId, members)
                .then((/*TODO*//*members*/) => {
                    res.status(HttpStatusCodes.OK).send(/*members*/);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while updating pool members.", error));
        }

    }

    // TODO implement endpoint to remove member

    public async importantStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const poolId: string = req.params.poolId;

            return poolService.getImportantStats(poolId)
                .then((importantStats: IImportantStats[]) => {
                    res.status(HttpStatusCodes.OK).send(importantStats);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while fetching the pool important stats.", error));
        }

    }

    public async saveImportantStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const poolId: string = req.params.poolId;
            const importantStats: IPoolStatsSelected = req.body;

            return poolService.saveImportantStats(poolId, importantStats)
                .then(() => {
                    res.status(HttpStatusCodes.OK).send();
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while saving the pool important stats.", error));
        }

    }

    // TODO return value when update

    public async updateImportantStats(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const poolId: string = req.params.poolId;
            const stats: IImportantStats[] = req.body;

            return poolService.updateImportantStats(poolId, stats)
                .then((/*TODO*//*importantStats*/) => {
                    res.status(HttpStatusCodes.OK).send(/*importantStats*/);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while updating the pool important stats.", error));
        }

    }

    public async updateCurrentStat(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {

        try {
            const poolId: string = req.params.poolId;
            const currentStat: string = req.body.currentStat;

            return poolService.updateCurrentStat(poolId, currentStat)
                .then((/*TODO*//*currentStat: string*/) => {
                    res.status(HttpStatusCodes.OK).send(/*currentStat*/);
                })
                .catch(error => {
                    next(error);
                });
        } catch (error) {
            next(createInternalServerError("Error while updating the pool current stat to sort players by.", error));
        }

    }
}
export let poolController: PoolController = new PoolController();
