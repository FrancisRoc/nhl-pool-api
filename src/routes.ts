//==========================================
// Application API routes.
//
// Those routes *must* also be defined in the
// Open API specs file.
//==========================================

import { IHandlerRoute, HttpMethods } from "./models/core/route";
import { servePlayersStatsController } from "./controllers/servePlayersStatsController";
import { draftPlayerController } from "./controllers/draftPlayerController";
import { accountController } from "./controllers/accountController";
import { poolController } from "./controllers/poolController";
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

        { method: HttpMethods.GET, path: "/v1/players/stats/goals", handler: servePlayersStatsController.getGoalStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/assists", handler: servePlayersStatsController.getAssistStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/points", handler: servePlayersStatsController.getPointStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/plusMinus", handler: servePlayersStatsController.getPlusMinusStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/penalityMin", handler: servePlayersStatsController.getPenalityMinStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/powerplayGoals", handler: servePlayersStatsController.getPowerplayGoalStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/shorthandedGoals", handler: servePlayersStatsController.getShorthandedGoalStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/powerplayPoints", handler: servePlayersStatsController.getPowerplayPointStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/shorthandedPoints", handler: servePlayersStatsController.getShorthandedPointStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/hits", handler: servePlayersStatsController.getHitStat },
        { method: HttpMethods.GET, path: "/v1/players/stats/player/:id/:year", handler: servePlayersStatsController.getPlayerInfos },

        { method: HttpMethods.DELETE, path: "/v1/players/draft/:id", handler: draftPlayerController.draft },

        { method: HttpMethods.POST, path: "/v1/users/authenticate", handler: accountController.authenticate },
        { method: HttpMethods.POST, path: "/v1/users/register", handler: accountController.register },
        { method: HttpMethods.GET, path: "/v1/users", handler: accountController.getAll },
        { method: HttpMethods.GET, path: "/v1/users/current", handler: accountController.getCurrent },
        { method: HttpMethods.DELETE, path: "/v1/users/:id", handler: accountController._delete },

        { method: HttpMethods.POST, path: "/v1/pools/create", handler: poolController.create },
        { method: HttpMethods.GET, path: "/v1/pools/getAll/:memberId", handler: poolController.getAll },
    ];
}
