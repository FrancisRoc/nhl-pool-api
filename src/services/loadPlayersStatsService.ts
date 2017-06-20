import { daoPlayersStats } from "./dao/daoLoadPlayersStats"
import { apiPaths } from "../../config/apiPaths";
import { configs } from "../../config/configs";
import { createLogger } from "../utils/logger";
import { LogLevel } from "../utils/logLevel";

export interface ILoadPlayersStatsService {
    /**
     * Call API to get all stats of all nhl players
     * We load one time the players stats and save it in two different
     * collection of mondodb
     * 1. AllStatsPooling for the players who will be picked so we can remove from database
     * 2. AllStats[YEAR] for all players stats for a specific year
     */
    loadAllPlayersStats();
}

class LoadPlayersStatsService implements ILoadPlayersStatsService {
    loadAllPlayersStats() {
        let startingYear: number = apiPaths.Paths.startingYear;
        for (let i = 0; i < apiPaths.Paths.lenght; i++) {
            daoPlayersStats.loadPlayersStats(startingYear);
            startingYear++;
        }
    }
}
export let loadPlayersStatsService: LoadPlayersStatsService = new LoadPlayersStatsService();