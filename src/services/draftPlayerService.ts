import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";
import { daoDraftPlayer } from "./dao/daoDraftPlayer";
import * as Player from "../models/playerInfoModel/playerInfos";
import * as express from "express";

export interface IDraftPlayerService {
    /**
     * Draft player by its id.
     * 1) Delete from database
     * 2) Insert in user drafted players
     * @param userId: id of user to add player in drafted list
     * @param poolId: pool in wich user selected player
     * @param playerId: id of the player to draft
     */
    draftPlayer(userId: string, poolId: string, playerId: string): Promise<void>
}

class DraftPlayerService implements IDraftPlayerService {
    public async draftPlayer(userId: string, poolId: string, playerId: string): Promise<void> {
        daoDraftPlayer.draftPlayer(userId, poolId, playerId);
    }
}
export let draftPlayerService: DraftPlayerService = new DraftPlayerService();
