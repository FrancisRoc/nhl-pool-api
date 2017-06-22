//==========================================
// Application API routes.
//
// Those routes *must* also be defined in the
// Open API specs file.
//==========================================

import { IHandlerRoute, HttpMethods } from "./models/core/route";
import { playersStatsController } from "./controllers/core/playersStatsController"

import { createLogger } from "./utils/logger";

let logger = createLogger("routes");

/**
 * The main routes of the application.
 *
 * The paths of those routes will automatically be prefixed
 * with the "/api" root and the domainPath specific to this
 * API, as defined in the configurations.
 *
 * Important! Make sure your handlers are properly bound so
 * the "this" keyword will have the correct value when the
 * handler is actually run. An easy way of doing this is to
 * decorate your controllers with the "@autobind" decorator
 * provided by the "autobind-decorator" library.
 */
export function getAPIRoutes(): IHandlerRoute[] {

    
    return [

        
        //==========================================
        // Even if the project was generated without any
        // example endpoints, at least one *path* must exist
        // in the "open-api.yaml" file for it to be valid. And
        // since the application won't start if the specs
        // file is not in sync with the current "routes.ts" file, we
        // have to add this dummy route... Simply remove it!
        //==========================================
        { method: HttpMethods.GET, path: "/v1/players/stats/goals", handler: playersStatsController.getGoalStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/assists", handler: playersStatsController.getAssistStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/points", handler: playersStatsController.getPointStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/plusMinus", handler: playersStatsController.getPlusMinusStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/penalityMin", handler: playersStatsController.getPenalityMinStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/powerplayGoals", handler: playersStatsController.getPowerplayGoalStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/shorthandedGoals", handler: playersStatsController.getShorthandedGoalStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/powerplayPoints", handler: playersStatsController.getPowerplayPointStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/shorthandedPoints", handler: playersStatsController.getShorthandedPointStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/hits", handler: playersStatsController.getHitStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/player/:id/:year", handler: playersStatsController.getPlayerInfos },
        
    ];
}
