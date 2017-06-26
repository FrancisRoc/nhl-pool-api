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
     * @param playerId: id of the player to draft
     * @param userId: id of user to add player in drafted list
     */
    draftPlayer(playerId: number, userId: number): Promise<void>
}

class DraftPlayerService implements IDraftPlayerService {
    public async draftPlayer(playerId: number, userId: number): Promise<void> {
        daoDraftPlayer.draftPlayer(playerId, userId);
    }
}
export let draftPlayerService: DraftPlayerService = new DraftPlayerService();