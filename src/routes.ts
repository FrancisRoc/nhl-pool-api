//==========================================
// Application API routes.
//
// Those routes *must* also be defined in the
// Open API specs file.
//==========================================

import { IHandlerRoute, HttpMethods } from "./models/core/route";
import { EndpointTypes } from "../config/constants";
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
        { method: HttpMethods.GET, path: "/v1/players/stats/goals", handler: playersStatsController.getGoalStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/assists", handler: playersStatsController.getAssistStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/points", handler: playersStatsController.getPointStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/plusMinus", handler: playersStatsController.getPlusMinusStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/penalityMin", handler: playersStatsController.getPenalityMinStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/powerplayGoals", handler: playersStatsController.getPowerplayGoalStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/shorthandedGoals", handler: playersStatsController.getShorthandedGoalStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/powerplayPoints", handler: playersStatsController.getPowerplayPointStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/shorthandedPoints", handler: playersStatsController.getShorthandedPointStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/hits", handler: playersStatsController.getHitStat, endpointType: EndpointTypes.API },
        { method: HttpMethods.GET, path: "/v1/players/stats/player/:id/:year", handler: playersStatsController.getPlayerInfos, endpointType: EndpointTypes.API },
        
    ];
}
