import * as request from "supertest";
import { createApp, createDefaultApp } from "../../../src/app";
import { Express } from "express";
import { assert } from "chai";
import * as express from "express";
import { utils } from "../../utils/utils";
import { configs } from "../../../config/configs";
import { IRoute, HttpMethods } from "../../models/core/route";
import { EndpointTypes } from "../../../config/constants";

//==========================================
// Create a default test app
//==========================================
let testApp: Express;
before(async function () {
    testApp = await createDefaultApp();
});

//==========================================
// Global errors
//==========================================
describe("Global errors", function () {

    it("Non existing resource", async function () {
        let response = await request(testApp).get("/nope").send();
        assert.strictEqual(response.status, 404);
    });

    it("Server error - must return a Json structured error", async function () {

        let testApp = await createApp([

            // Server error simulation route
            {
                method: HttpMethods.GET,
                path: "/error",
                handler: (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
                    let nope: any = undefined;
                    nope.booooom; // NPE!
                    return;
                }
            }
        ]);

        let response = await request(testApp).get(`/api${configs.api.domainPath}/error`).send();
        assert.strictEqual(response.status, 500);
        assert.strictEqual(response.type, "application/json");
        assert.isOk(response.body);
        assert.isOk(response.body.error);
        assert.isOk(response.body.error.code);
        assert.strictEqual(response.body.error.code, "serverError");
        assert.isOk(response.body.error.message);
        assert.isTrue(!utils.isBlank(response.body.error.message));

    });

});






