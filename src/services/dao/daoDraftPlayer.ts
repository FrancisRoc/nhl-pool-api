import { dbConnectionService } from "../dbConnectionService";
import { createLogger } from "../../utils/logger";
import { LogLevel } from "../../utils/logLevel";
import { configs } from "../../../config/configs";
const util = require("util");

let logger = createLogger("daoDraftPlayer");

export interface IDaoDraftPlayer {
}

class DaoDraftPlayer implements IDaoDraftPlayer {
}
export let daoDraftPlayer: IDaoDraftPlayer = new DaoDraftPlayer();