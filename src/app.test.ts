import * as request from "supertest";
import { assert } from "chai";
import * as express from "express";
import { createApp, createDefaultApp, wrapAsyncHandler } from "../src/app";
import { IHandlerRoute, HttpMethods } from "./models/core/route";
import { utils } from "../src/utils/utils";
import { configs } from "../config/configs";
import { constants } from "../config/constants";
let httpMocks = require("node-mocks-http");
import { EndpointTypes } from "../config/constants";
let autobind = require("autobind-decorator");

//==========================================
// Creates a default test app
//==========================================
let testApp: express.Express;
before(async function () {
    testApp = await createDefaultApp();
});

//==========================================
// wrapAsyncHandler()
//==========================================
describe("wrapAsyncHandler()", function () {

    it("Sends a response", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
            res.send("ok");
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isUndefined(error);
    });

    it("Calls 'next()'", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
            next();
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isUndefined(error);
    });

    it("No response sent and 'next()' not called", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
            // nothing!
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isDefined(error);
    });

    it("Using a promise and awaiting it", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

            await Promise.resolve().then(async () => {
                await utils.sleep(50);
                res.send("ok");
            });
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isUndefined(error);
    });

    it("Using a promise and returning it", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

            return Promise.resolve().then(async () => {
                await utils.sleep(50);
                res.send("ok");
            });
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isUndefined(error);
    });

    it("Using a promise but without awaiting or returning it", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

            Promise.resolve().then(async () => {
                await utils.sleep(50);
                res.send("oups!");
            });
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isDefined(error);
    });

    it("Throws a sync error", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
            throw new Error("error message");
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isDefined(error);
        assert.strictEqual(error.message, "error message");
    });

    it("Throws an async error - await", async function () {

        let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

            await Promise.resolve().then(async () => {
                await utils.sleep(50);
                throw new Error("error message");
            });
        };

        let wrappedHandler = wrapAsyncHandler(handler);

        let error: any;
        let next = function (err?: any) {
            error = err;
        };

        let request = httpMocks.createRequest({ method: "GET", url: "/" });
        let response = httpMocks.createResponse();

        await wrappedHandler(request, response, next);
        assert.isDefined(error);
        assert.strictEqual(error.message, "error message");
    });
});

it("Throws an async error - return", async function () {

    let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

        return Promise.resolve().then(async () => {
            await utils.sleep(50);
            throw new Error("error message");
        });
    };

    let wrappedHandler = wrapAsyncHandler(handler);

    let error: any;
    let next = function (err?: any) {
        error = err;
    };

    let request = httpMocks.createRequest({ method: "GET", url: "/" });
    let response = httpMocks.createResponse();

    await wrappedHandler(request, response, next);
    assert.isDefined(error);
    assert.strictEqual(error.message, "error message");
});

it("Throws an async error - without await or return", async function () {

    let handler = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {

        Promise.resolve().then(async () => {
            await utils.sleep(50);
            throw new Error("error message");
        });
    };

    let wrappedHandler = wrapAsyncHandler(handler);

    let error: any;
    let next = function (err?: any) {
        error = err;
    };

    let request = httpMocks.createRequest({ method: "GET", url: "/" });
    let response = httpMocks.createResponse();

    await wrappedHandler(request, response, next);
    assert.isDefined(error);
    assert.notEqual(error.message, "error message"); // not equals!
});

it("The 'this' object is the controller itself inside the handler when @autobind is used", async function () {

    @autobind
    class TestController {
        private testString = "titi";
        async handler(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            next(this ? this.testString : this);
        }
    }

    let controller: TestController = new TestController();

    let wrappedHandler = wrapAsyncHandler(controller.handler);

    let nextResult: any;
    let next = function (result?: any) {
        nextResult = result;
    };

    let request = httpMocks.createRequest({ method: "GET", url: "/" });
    let response = httpMocks.createResponse();

    await wrappedHandler(request, response, next);
    assert.isDefined(nextResult);
    assert.equal(nextResult, "titi");
});

it("The 'this' object is not the controller itself without @autobind", async function () {

    class TestController {
        async handler(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
            next(this);
        }
    }

    let controller: TestController = new TestController();

    let wrappedHandler = wrapAsyncHandler(controller.handler);

    let nextResult: any;
    let next = function (result?: any) {
        nextResult = result;
    };

    let request = httpMocks.createRequest({ method: "GET", url: "/" });
    let response = httpMocks.createResponse();

    await wrappedHandler(request, response, next);
    assert.isUndefined(nextResult);
});


//==========================================
// Defaults routes
//==========================================
describe("Default routes", function () {

    it("GET /favicon.ico", async function () {
        let fullPath = utils.createPublicFullPath("/favicon.ico", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "image/png");
        assert.strictEqual(response.status, 200);
    });

    it("GET /apple-touch-icon.png", async function () {
        let fullPath = utils.createPublicFullPath("/apple-touch-icon.png", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "image/png");
        assert.strictEqual(response.status, 200);
    });

    it("GET /tile.png", async function () {
        let fullPath = utils.createPublicFullPath("/tile.png", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "image/png");
        assert.strictEqual(response.status, 200);
    });

    it("GET /tile-wide.png", async function () {
        let fullPath = utils.createPublicFullPath("/tile-wide.png", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "image/png");
        assert.strictEqual(response.status, 200);
    });

    it("GET /robots.txt", async function () {
        let fullPath = utils.createPublicFullPath("/robots.txt", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/plain");
        assert.strictEqual(response.status, 200);
    });

    it("GET /humans.txt", async function () {
        let fullPath = utils.createPublicFullPath("/humans.txt", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/plain");
        assert.strictEqual(response.status, 200);
    });

    it("GET /browserconfig.xml", async function () {
        let fullPath = utils.createPublicFullPath("/browserconfig.xml", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/plain");
        assert.strictEqual(response.status, 200);
    });
});

//==========================================
// Index
//==========================================
describe("/", async function () {

    it("GET - Root index responds with 200 and some HTML", async function () {
        let fullPath = utils.createPublicFullPath("/", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/html");
        assert.strictEqual(response.status, 200);
    });

    it("GET - Readme page responds with 200 and some HTML", async function () {
        let fullPath = utils.createPublicFullPath("/readme", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/html");
        assert.strictEqual(response.status, 200);
    });

    it("GET - Open API page responds with 200 and some HTML", async function () {
        let fullPath = utils.createPublicFullPath("/open-api", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/html");
        assert.strictEqual(response.status, 200);
    });

    it("GET - Health page responds with 200 and some HTML", async function () {
        let fullPath = utils.createPublicFullPath("/health", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/html");
        assert.strictEqual(response.status, 200);
    });

    it("GET - Metrics page responds with 200 and some HTML", async function () {
        let fullPath = utils.createPublicFullPath("/metrics", EndpointTypes.NONE);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "text/html");
        assert.strictEqual(response.status, 200);
    });

    it("POST - Index responds with 404 and a text message", async function () {
        let fullPath = utils.createPublicFullPath("/", EndpointTypes.NONE);
        let response = await request(testApp).post(fullPath).send();
        assert.strictEqual(response.type, "application/json");
        assert.strictEqual(response.status, 404);

        let body = response.body;
        assert.isOk(body);
        assert.isOk(body.error);
        assert.isOk(body.error.code);
        assert.strictEqual(body.error.code, constants.errors.codes.NOT_FOUND);
    });

    it("GET - API index responds with 404 and a text message", async function () {
        let fullPath = utils.createPublicFullPath("/", EndpointTypes.API);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "application/json");
        assert.strictEqual(response.status, 404);

        let body = response.body;
        assert.isOk(body);
        assert.isOk(body.error);
        assert.isOk(body.error.code);
        assert.strictEqual(body.error.code, constants.errors.codes.NOT_FOUND);
    });

    it("GET - Documentation index responds with 404 and a text message", async function () {
        let fullPath = utils.createPublicFullPath("/", EndpointTypes.DOCUMENTATION);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "application/json");
        assert.strictEqual(response.status, 404);

        let body = response.body;
        assert.isOk(body);
        assert.isOk(body.error);
        assert.isOk(body.error.code);
        assert.strictEqual(body.error.code, constants.errors.codes.NOT_FOUND);
    });

    it("GET - Diagnostics index responds with 404 and a text message", async function () {
        let fullPath = utils.createPublicFullPath("/", EndpointTypes.DIAGNOSTICS);
        let response = await request(testApp).get(fullPath).send();
        assert.strictEqual(response.type, "application/json");
        assert.strictEqual(response.status, 404);

        let body = response.body;
        assert.isOk(body);
        assert.isOk(body.error);
        assert.isOk(body.error.code);
        assert.strictEqual(body.error.code, constants.errors.codes.NOT_FOUND);
    });

});

//==========================================
// Route specific middlewares
//==========================================
describe("Route specific middlewares", async function () {

    it("Both middlewares are called", async function () {

        let middlewaresCalled: number[] = [];

        let app: express.Express = await createApp([{
            method: HttpMethods.GET,
            path: "/test",
            middlewares: [
                function (req: express.Request, res: express.Response, next: express.NextFunction) {
                    middlewaresCalled.push(1);
                    next();
                },
                function (req: express.Request, res: express.Response, next: express.NextFunction) {
                    middlewaresCalled.push(2);
                    next();
                }
            ],
            handler: async function (req: express.Request, res: express.Response, next: express.NextFunction) {
                res.send({
                    status: "ok"
                });
            },
            endpointType: EndpointTypes.NONE
        }
        ]);

        let fullPath = utils.createPublicFullPath("/test", EndpointTypes.NONE);
        let response = await request(app).get(fullPath).send();
        assert.strictEqual(response.type, "application/json");
        assert.strictEqual(response.status, 200);
        assert.deepEqual(response.body, {
            status: "ok"
        });

        assert.strictEqual(middlewaresCalled.length, 2);
        assert.strictEqual(middlewaresCalled[0], 1);
        assert.strictEqual(middlewaresCalled[1], 2);
    });

});


//==========================================
// Catch error in BodyParser
//==========================================
describe("Catch error in BodyParser", async function () {

    it("Malformed JSON should return [400] Bad request", async function () {

        let app: express.Express = await createApp([{
            method: HttpMethods.POST,
            path: "/test",
            handler: async function (req: express.Request, res: express.Response, next: express.NextFunction) {
                res.send({
                    status: "ok"
                });
            },
            endpointType: EndpointTypes.NONE
        }
        ]);

        let fullPath = utils.createPublicFullPath("/test", EndpointTypes.NONE);
        let response = await request(app)
            .post(fullPath)
            .send('{"invalid"}')
            .type('json');

        assert.strictEqual(response.type, "application/json");
        assert.strictEqual(response.status, 400);
        assert.strictEqual(response.body.error.code, constants.errors.codes.INVALID_JSON_BODY);
        assert.strictEqual(response.body.error.target, 'body');
    });

});
