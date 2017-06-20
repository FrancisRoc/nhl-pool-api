//==========================================
// Entry point!
//
// Automatically starts the application...
//==========================================

import { startServer } from "./server";

(async function run() {
    try {
        await startServer();
    } catch (err) {
        console.error(err);
    }
})();

