import { draftPlayerService } from "../services/draftPlayerService";
import { constants, EndpointTypes } from "../../config/constants";
import { createLogger } from "../utils/logger";
import { configs } from "../../config/configs";
import { LogLevel } from "../utils/logLevel";
import { utils } from "../utils/utils";

let autobind = require("autobind-decorator");
import * as HttpStatusCodes from "http-status-codes";
import * as express from "express";

let logger = createLogger("draftPlayerController");
let util = require('util');

/**
 * Players Stats Controller
 */
@autobind
class DraftPlayerController {
    public async draft(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let userId: string = req.params.userId;
        let poolId: string = req.params.poolId;
        let playerId: string = req.params.playerId;

        await draftPlayerService.draftPlayer(userId, poolId, playerId);

        res.status(HttpStatusCodes.OK);
        res.send();
    }

    public async getDrafted(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        let userId: string = req.params.userId;
        let poolId: string = req.params.poolId;

        let result = await draftPlayerService.getDraftedPlayers(userId, poolId);

        res.status(HttpStatusCodes.OK);
        res.send(result);
    }
}
export let draftPlayerController: DraftPlayerController = new DraftPlayerController();
