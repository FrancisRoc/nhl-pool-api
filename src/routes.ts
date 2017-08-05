//==========================================
// Application API routes.
//
// Those routes *must* also be defined in the
// Open API specs file.
//==========================================

import { IHandlerRoute, HttpMethods } from "./models/core/route";
import { playersController } from "./controllers/playersController";
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
        { method: HttpMethods.DELETE, path: "/v1/players/draft/:userId/:poolId/:playerId", handler: draftPlayerController.draft },
        { method: HttpMethods.GET, path: "/v1/players/draft/:userId/:poolId", handler: draftPlayerController.getDrafted },

        { method: HttpMethods.GET, path: "/v1/players/pool/:poolId/stats/orderedBy/:stat", handler: playersController.getStats },
        { method: HttpMethods.GET, path: "/v1/players/stats/player/:id/:year", handler: playersController.getPlayerInfos },


        { method: HttpMethods.POST, path: "/v1/users/authenticate", handler: accountController.authenticate },
        { method: HttpMethods.POST, path: "/v1/users/register", handler: accountController.register },
        { method: HttpMethods.GET, path: "/v1/users", handler: accountController.getAll },
        { method: HttpMethods.GET, path: "/v1/users/current", handler: accountController.getCurrent },
        { method: HttpMethods.DELETE, path: "/v1/users/:id", handler: accountController._delete },

        { method: HttpMethods.POST, path: "/v1/pools/create", handler: poolController.create },
        { method: HttpMethods.GET, path: "/v1/pools/:poolId/stats", handler: poolController.importantStats },
        { method: HttpMethods.POST, path: "/v1/pools/:poolId/stats", handler: poolController.saveImportantStats },
        { method: HttpMethods.PUT, path: "/v1/pools/:poolId/stats", handler: poolController.updateImportantStats },
        { method: HttpMethods.PUT, path: "/v1/pools/:poolId/currentStat", handler: poolController.updateCurrentStat },        
        { method: HttpMethods.GET, path: "/v1/pools/getAll/:memberId", handler: poolController.getAll },
        { method: HttpMethods.POST, path: "/v1/pools/:id/members", handler: poolController.updateMembers },
    ];
}
