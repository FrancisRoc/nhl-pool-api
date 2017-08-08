//==========================================
// Export a function to start the server for the
// application in a test environnement.
//==========================================

import * as express from "express";
import { startServer as startServerReal } from '../../src/server';

let appSrv: express.Express;
export async function startServer(): Promise<express.Express> {

    if (appSrv) {
        return appSrv;
    } else {
        appSrv = await startServerReal();
    }

    return Promise.resolve(appSrv);
}
