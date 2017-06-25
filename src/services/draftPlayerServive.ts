import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoDraftPlayer } from "./dao/daoDraftPlayer";
import * as Player from "../models/playerInfoModel/playerInfos";
import * as express from "express";

export interface IDraftPlayerService {
    
}

class DraftPlayerService implements IDraftPlayerService {
    
}
export let draftPlayerService: DraftPlayerService = new DraftPlayerService();