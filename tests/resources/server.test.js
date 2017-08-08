//==========================================
// Export a function to start the server for the
// application in a test environnement.
//==========================================
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../../src/server");
let appSrv;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        if (appSrv) {
            return appSrv;
        }
        else {
            appSrv = yield server_1.startServer();
        }
        return Promise.resolve(appSrv);
    });
}
exports.startServer = startServer;
//# sourceMappingURL=server.test.js.map