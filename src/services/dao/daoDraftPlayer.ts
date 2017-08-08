import { dbConnectionService } from "../dbConnectionService";
import { IDrafted } from "../../models/draft/drafted";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";
const util = require("util");

let logger = createLogger("daoDraftPlayer");
let ObjectId = require('mongodb').ObjectId;

export interface IDaoDraftPlayer {
    /**
     * Draft player by its id.
     * 1) Delete from database
     * 2) Insert in user drafted players
     * @param userId: id of user to add player in drafted list
     * @param poolId: pool in wich user selected player
     * @param playerId: id of the player to draft
     */
    draftPlayer(userId: string, poolId: string, playerId: string): Promise<void>;
}

class DaoDraftPlayer implements IDaoDraftPlayer {
    public async draftPlayer(userId: string, poolId: string, playerId: string): Promise<void> {
        await this.deletePlayerQuery(poolId, playerId);
        await this.addPlayerToUserDraftedList(userId, poolId, playerId);
    }

    private async deletePlayerQuery(poolId: string, playerId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('PlayersPooling').update( { _id: new ObjectId(poolId) }, { $pull: { "playersId": playerId } }, function (error, response) {
                resolve(response);
            });
        });
    }

    private async addPlayerToUserDraftedList(userId: string, poolId: string, playerId: string): Promise<{}> {
        return new Promise(function (resolve, reject) {
            let drafted: IDrafted = {
                userId: userId,
                poolId: poolId,
                playerId: playerId
            };

            dbConnectionService.getConnection().collection('Drafed').insert(drafted, function (err, doc) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}
export let daoDraftPlayer: IDaoDraftPlayer = new DaoDraftPlayer();
