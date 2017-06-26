import { dbConnectionService } from "../dbConnectionService";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";
const util = require("util");

let logger = createLogger("daoDraftPlayer");

export interface IDaoDraftPlayer {
    /**
     * Draft player by its id.
     * 1) Delete from database
     * 2) Insert in user drafted players
     * @param playerId: id of the player to draft
     * @param userId: id of user to add player in drafted list
     */
    draftPlayer(playerId: number, userId: number): Promise<void>
}

class DaoDraftPlayer implements IDaoDraftPlayer {
    public async draftPlayer(playerId: number, userId: number): Promise<void> {
        let playerRemoved = await this.deletePlayerQuery(playerId);
        await this.addPlayerToUserDraftedList(userId, playerRemoved);
    }

    private async deletePlayerQuery(playerId: number): Promise<{}> {
        return new Promise(function (resolve, reject) {
            dbConnectionService.getConnection().collection('AllStatsPooling').findOneAndDelete({ "player.ID": playerId }, function (error, response) {
                logger.debug("Player removed: " + util.inspect(response, false, null));
                resolve(response);
            });
        });
    }

    private async addPlayerToUserDraftedList(userId: number, player: any): Promise<{}> {
        return new Promise(function (resolve, reject) {
            //TODO
        });
    }
}
export let daoDraftPlayer: IDaoDraftPlayer = new DaoDraftPlayer();