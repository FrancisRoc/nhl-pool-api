//==========================================
// Utils functions unit tests
//==========================================

import { assert } from "chai";
import { configs } from "../../config/configs";
import { utils, Utils } from "../../src/utils/utils";
import * as express from "express";
let httpMocks = require("node-mocks-http");
import * as fs from "fs-extra";


describe("App's utilities functions", function () {

    //==========================================
    // stringToBoolean()
    //==========================================
    describe("stringToBoolean()", function () {

        it("valid TRUE values", function () {

            let result: boolean = utils.stringToBoolean("true");
            assert.isTrue(result);

            result = utils.stringToBoolean("TRUE");
            assert.isTrue(result);

            result = utils.stringToBoolean("True");
            assert.isTrue(result);

            result = utils.stringToBoolean("1");
            assert.isTrue(result);

            result = utils.stringToBoolean(<any>1);
            assert.isTrue(result);
        });

        it("Everything else is FALSE", function () {

            let result: boolean = utils.stringToBoolean("true   ");
            assert.isFalse(result);

            result = utils.stringToBoolean("    1   ");
            assert.isFalse(result);

            result = utils.stringToBoolean("vrai");
            assert.isFalse(result);

            result = utils.stringToBoolean("on");
            assert.isFalse(result);

            result = utils.stringToBoolean("false");
            assert.isFalse(result);

            result = utils.stringToBoolean("FALSE");
            assert.isFalse(result);

            result = utils.stringToBoolean("Stromgol");
            assert.isFalse(result);

            result = utils.stringToBoolean("");
            assert.isFalse(result);

            result = utils.stringToBoolean(null);
            assert.isFalse(result);

            result = utils.stringToBoolean("12.345");
            assert.isFalse(result);

            result = utils.stringToBoolean(<any>2);
            assert.isFalse(result);

            result = utils.stringToBoolean(<any>0);
            assert.isFalse(result);

            result = utils.stringToBoolean(<any>-1);
            assert.isFalse(result);

            result = utils.stringToBoolean(<any>{});
            assert.isFalse(result);

            result = utils.stringToBoolean(<any>[]);
            assert.isFalse(result);
        });

    });

    //==========================================
    // isBlank()
    //==========================================
    describe("isBlank()", function () {

        it("blank values", function () {

            let result: boolean = utils.isBlank("");
            assert.isTrue(result);

            result = utils.isBlank("      ");
            assert.isTrue(result);

            result = utils.isBlank(null);
            assert.isTrue(result);

            result = utils.isBlank(undefined);
            assert.isTrue(result);
        });

        it("Not blank values", function () {

            let result: boolean = utils.isBlank(".");
            assert.isFalse(result);

            result = utils.isBlank("   .   ");
            assert.isFalse(result);

            result = utils.isBlank("abc");
            assert.isFalse(result);

            result = utils.isBlank(<any>0);
            assert.isFalse(result);

            result = utils.isBlank(<any>1);
            assert.isFalse(result);

            result = utils.isBlank(<any>{});
            assert.isFalse(result);

            result = utils.isBlank(<any>[]);
            assert.isFalse(result);
        });
    });

    //==========================================
    // isIntegerValue()
    //==========================================
    describe("isIntegerValue()", function () {

        it("Integer values", function () {

            let result: boolean = utils.isIntegerValue(0);
            assert.isTrue(result);

            result = utils.isIntegerValue(1);
            assert.isTrue(result);

            result = utils.isIntegerValue(10.0);
            assert.isTrue(result);

            result = utils.isIntegerValue(10);
            assert.isTrue(result);

            result = utils.isIntegerValue("10");
            assert.isTrue(result);

            result = utils.isIntegerValue(" 10");
            assert.isTrue(result);

            result = utils.isIntegerValue("10 ");
            assert.isTrue(result);

            result = utils.isIntegerValue("10.0");
            assert.isTrue(result);

            result = utils.isIntegerValue("0");
            assert.isTrue(result);

            result = utils.isIntegerValue("1");
            assert.isTrue(result);

            result = utils.isIntegerValue(-1);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10.0);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10");
            assert.isTrue(result);

            result = utils.isIntegerValue(" -10");
            assert.isTrue(result);

            result = utils.isIntegerValue("-10 ");
            assert.isTrue(result);

            // MAX_SAFE_INTEGER
            result = utils.isIntegerValue(9007199254740991);
            assert.isTrue(result);

            result = utils.isIntegerValue(9007199254740991.000);
            assert.isTrue(result);

            result = utils.isIntegerValue("9007199254740991");
            assert.isTrue(result);

            result = utils.isIntegerValue("9007199254740991.000");
            assert.isTrue(result);

            // MIN_SAFE_INTEGER
            result = utils.isIntegerValue(-9007199254740991);
            assert.isTrue(result);

            result = utils.isIntegerValue(-9007199254740991.000);
            assert.isTrue(result);

            result = utils.isIntegerValue("-9007199254740991");
            assert.isTrue(result);

            result = utils.isIntegerValue("-9007199254740991.000");
            assert.isTrue(result);

        });

        it("Not integer values", function () {

            let result: boolean = utils.isIntegerValue(".");
            assert.isFalse(result);

            result = utils.isIntegerValue("");
            assert.isFalse(result);

            result = utils.isIntegerValue("   .   ");
            assert.isFalse(result);

            result = utils.isIntegerValue("10.1");
            assert.isFalse(result);

            result = utils.isIntegerValue("0.1");
            assert.isFalse(result);

            result = utils.isIntegerValue(undefined);
            assert.isFalse(result);

            result = utils.isIntegerValue(null);
            assert.isFalse(result);

            result = utils.isIntegerValue(true);
            assert.isFalse(result);

            result = utils.isIntegerValue(false);
            assert.isFalse(result);

            result = utils.isIntegerValue("0.1");
            assert.isFalse(result);

            result = utils.isIntegerValue(["a", "b", "c"]);
            assert.isFalse(result);

            result = utils.isIntegerValue([1, 2, 3]);
            assert.isFalse(result);

            result = utils.isIntegerValue(["string", 2, false]);
            assert.isFalse(result);

            result = utils.isIntegerValue({ firstStringValue: "a", secondStringValue: "b", thirdStringValue: "c" });
            assert.isFalse(result);

            result = utils.isIntegerValue({ firstNumberValue: 1, secondNumberValue: 2, thirdNumberValue: 3 });
            assert.isFalse(result);

            result = utils.isIntegerValue({ stringValue: "string", numberValue: 2, booleanValue: false });
            assert.isFalse(result);

            result = utils.isIntegerValue("10abc");
            assert.isFalse(result);

            result = utils.isIntegerValue("10 abc");
            assert.isFalse(result);

            result = utils.isIntegerValue("abc10");
            assert.isFalse(result);

            // Busts MAX_SAFE_INTEGER
            result = utils.isIntegerValue(9007199254740992);
            assert.isFalse(result);

            result = utils.isIntegerValue("9007199254740992");
            assert.isFalse(result);

            // Busts MIN_SAFE_INTEGER
            result = utils.isIntegerValue(-9007199254740992);
            assert.isFalse(result);

            result = utils.isIntegerValue("-9007199254740992");
            assert.isFalse(result);

        });

        it("Negative values are accepted", function () {

            let result: boolean = utils.isIntegerValue(0, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(1, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(10.0, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(10, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("10", false);
            assert.isTrue(result);

            result = utils.isIntegerValue(" 10", false);
            assert.isTrue(result);

            result = utils.isIntegerValue("10 ", false);
            assert.isTrue(result);

            result = utils.isIntegerValue("10.0", false);
            assert.isTrue(result);

            result = utils.isIntegerValue("0", false);
            assert.isTrue(result);

            result = utils.isIntegerValue("1", false);
            assert.isTrue(result);

            result = utils.isIntegerValue(-1, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10.0, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10", false);
            assert.isTrue(result);

            result = utils.isIntegerValue(" -10", false);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10 ", false);
            assert.isTrue(result);

        });

        it("Negative values are refused", function () {

            let result: boolean = utils.isIntegerValue(0, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(1, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(10.0, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(10, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("10", true);
            assert.isTrue(result);

            result = utils.isIntegerValue(" 10", true);
            assert.isTrue(result);

            result = utils.isIntegerValue("10 ", true);
            assert.isTrue(result);

            result = utils.isIntegerValue("10.0", true);
            assert.isTrue(result);

            result = utils.isIntegerValue("0", true);
            assert.isTrue(result);

            result = utils.isIntegerValue("1", true);
            assert.isTrue(result);

            result = utils.isIntegerValue(-1, true);
            assert.isFalse(result);

            result = utils.isIntegerValue(-10.0, true);
            assert.isFalse(result);

            result = utils.isIntegerValue(-10, true);
            assert.isFalse(result);

            result = utils.isIntegerValue("-10", true);
            assert.isFalse(result);

            result = utils.isIntegerValue(" -10", true);
            assert.isFalse(result);

            result = utils.isIntegerValue("-10 ", true);
            assert.isFalse(result);

        });

        it("Zero is included", function () {

            let result: boolean = utils.isIntegerValue(0, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(1, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(10.0, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(10, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("10", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(" 10", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("10 ", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("10.0", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("0", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("1", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(-1, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10.0, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10, undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue(" -10", undefined, true);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10 ", undefined, true);
            assert.isTrue(result);
        });

        it("Zero is excluded", function () {

            let result: boolean = utils.isIntegerValue(0, undefined, false);
            assert.isFalse(result);

            result = utils.isIntegerValue(1, undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(10.0, undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(10, undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("10", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(" 10", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("10 ", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("10.0", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("0", undefined, false);
            assert.isFalse(result);

            result = utils.isIntegerValue("1", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(-1, undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10.0, undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(-10, undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue(" -10", undefined, false);
            assert.isTrue(result);

            result = utils.isIntegerValue("-10 ", undefined, false);
            assert.isTrue(result);
        });
    });

    //==========================================
    // isNaNSafe()
    //==========================================
    describe("isNaNSafe()", function () {

        it("Valid numbers", function () {

            let result: boolean = utils.isNaNSafe(0);
            assert.isFalse(result);

            result = utils.isNaNSafe(-0);
            assert.isFalse(result);

            result = utils.isNaNSafe(-1);
            assert.isFalse(result);

            result = utils.isNaNSafe(-1.123);
            assert.isFalse(result);

            result = utils.isNaNSafe(1);
            assert.isFalse(result);

            result = utils.isNaNSafe(1.123);
            assert.isFalse(result);
        });

        it("Invalid numbers", function () {

            let result: boolean = utils.isNaNSafe(null);
            assert.isTrue(result);

            result = utils.isNaNSafe(undefined);
            assert.isTrue(result);

            result = utils.isNaNSafe("");
            assert.isTrue(result);

            result = utils.isNaNSafe("abc");
            assert.isTrue(result);

            result = utils.isNaNSafe("123abc");
            assert.isTrue(result);

            result = utils.isNaNSafe("12.3abc");
            assert.isTrue(result);

            result = utils.isNaNSafe(true);
            assert.isTrue(result);

            result = utils.isNaNSafe(false);
            assert.isTrue(result);

            result = utils.isNaNSafe({});
            assert.isTrue(result);

            result = utils.isNaNSafe([]);
            assert.isTrue(result);
        });
    });

    //==========================================
    // getReadmeHtml()
    //==========================================
    describe("getReadmeHtml()", function () {

        it("Returns the readme.md file as HTML", function () {
            let result: string = utils.getReadmeHtml();
            assert.isNotNull(result);
            assert.isTrue(result.indexOf("<code>") > -1);
        });
    });

    //==========================================
    // tsc()
    //==========================================
    describe("tsc()", function () {

        it("Compiles a TypeScript file using the 'tsc()' utility", async function () {

            // May take some time to compile...
            this.timeout(7000);

            let tmpRepPath = configs.testDataDir + "/test_tsc";
            if (fs.existsSync(tmpRepPath)) {
                fs.removeSync(tmpRepPath);
            }
            fs.mkdirSync(tmpRepPath);

            let filesPathPrefix = tmpRepPath + "/test";
            let tsFilePath = filesPathPrefix + ".ts";
            fs.writeFileSync(tsFilePath, "let t = 123;");

            await utils.tsc([tsFilePath]);

            assert.isTrue(fs.existsSync(filesPathPrefix + ".js"));
            assert.isTrue(fs.existsSync(filesPathPrefix + ".js.map"));
        });
    });

    //==========================================
    // sleep()
    //==========================================
    describe("sleep()", function () {

        it("The 'sleep()' function await correctly", async function () {
            let start = new Date().getTime();
            await utils.sleep(500);
            let end = new Date().getTime();
            assert.isTrue((end - start) > 450);
        });
    });

    //==========================================
    // isSafeToDelete()
    //==========================================
    describe("isSafeToDelete()", function () {

        let utilsObj: Utils = new Utils();

        it("Safe paths", async function () {
            assert.isTrue(utilsObj.isSafeToDelete("/toto/titi"));
            assert.isTrue(utilsObj.isSafeToDelete("/toto/titi.txt"));
            assert.isTrue(utilsObj.isSafeToDelete("/toto/.titi"));
            assert.isTrue(utilsObj.isSafeToDelete("/toto/titi/tutu"));
            assert.isTrue(utilsObj.isSafeToDelete("/toto/titi/tutu.txt"));
            assert.isTrue(utilsObj.isSafeToDelete("C:\\toto\\titi"));
            assert.isTrue(utilsObj.isSafeToDelete("C:\\toto\\titi.txt"));
            assert.isTrue(utilsObj.isSafeToDelete("C:\\toto\\titi\\tutu"));
            assert.isTrue(utilsObj.isSafeToDelete("C:\\toto\\titi\\tutu.txt"));
            assert.isTrue(utilsObj.isSafeToDelete("C:/toto/titi"));
            assert.isTrue(utilsObj.isSafeToDelete("C:/toto/titi.txt"));
            assert.isTrue(utilsObj.isSafeToDelete("C:/toto/.titi"));
            assert.isTrue(utilsObj.isSafeToDelete("C:/toto/titi/tutu"));
            assert.isTrue(utilsObj.isSafeToDelete("C:/toto/titi/tutu.txt"));
        });

        it("Unsafe paths", async function () {
            assert.isFalse(utilsObj.isSafeToDelete(undefined));
            assert.isFalse(utilsObj.isSafeToDelete(null));
            assert.isFalse(utilsObj.isSafeToDelete(""));
            assert.isFalse(utilsObj.isSafeToDelete(" "));
            assert.isFalse(utilsObj.isSafeToDelete("/"));
            assert.isFalse(utilsObj.isSafeToDelete("/ "));
            assert.isFalse(utilsObj.isSafeToDelete(" / "));
            assert.isFalse(utilsObj.isSafeToDelete(" // "));
            assert.isFalse(utilsObj.isSafeToDelete(" / / "));
            assert.isFalse(utilsObj.isSafeToDelete("//"));
            assert.isFalse(utilsObj.isSafeToDelete("///"));
            assert.isFalse(utilsObj.isSafeToDelete("//////"));
            assert.isFalse(utilsObj.isSafeToDelete("//\n"));
            assert.isFalse(utilsObj.isSafeToDelete("//\r"));
            assert.isFalse(utilsObj.isSafeToDelete("//\t"));
            assert.isFalse(utilsObj.isSafeToDelete("/titi"));
            assert.isFalse(utilsObj.isSafeToDelete("//titi"));
            assert.isFalse(utilsObj.isSafeToDelete("/////titi"));
            assert.isFalse(utilsObj.isSafeToDelete("/////titi///////"));
            assert.isFalse(utilsObj.isSafeToDelete("/titi.txt"));
            assert.isFalse(utilsObj.isSafeToDelete("\\"));
            assert.isFalse(utilsObj.isSafeToDelete("\\\\"));
            assert.isFalse(utilsObj.isSafeToDelete("\\\\ "));
            assert.isFalse(utilsObj.isSafeToDelete("C"));
            assert.isFalse(utilsObj.isSafeToDelete("C:"));
            assert.isFalse(utilsObj.isSafeToDelete("C:\\"));
            assert.isFalse(utilsObj.isSafeToDelete("C:\\ "));
            assert.isFalse(utilsObj.isSafeToDelete("C:\\titi"));
            assert.isFalse(utilsObj.isSafeToDelete("C:\\titi.txt"));
            assert.isFalse(utilsObj.isSafeToDelete("C://"));
            assert.isFalse(utilsObj.isSafeToDelete("C://titi"));
            assert.isFalse(utilsObj.isSafeToDelete("C://titi.txt"));
            assert.isFalse(utilsObj.isSafeToDelete("C:////titi"));
            assert.isFalse(utilsObj.isSafeToDelete("\r"));
            assert.isFalse(utilsObj.isSafeToDelete("\n"));
            assert.isFalse(utilsObj.isSafeToDelete("\t"));
        });
    });

    //==========================================
    // deleteFile()
    //==========================================
    describe("deleteFile()", async function () {

        it("Safe file", async function () {
            let tempFilePath = configs.testDataDir + "/tmp" + (new Date()).getTime();
            assert.isFalse(fs.existsSync(tempFilePath));
            fs.createFileSync(tempFilePath);

            assert.isTrue(fs.existsSync(tempFilePath));

            await utils.deleteFile(tempFilePath);

            assert.isFalse(fs.existsSync(tempFilePath));
        });

        it("Unsafe file", async function () {
            // root file
            let tempFilePath = "/tmp" + (new Date()).getTime();
            assert.isFalse(fs.existsSync(tempFilePath));

            let error = false;
            try {
                await utils.deleteFile(tempFilePath);
            } catch (err) {
                error = true;
            }
            assert.isTrue(error);
        });
    });

    //==========================================
    // deleteDir()
    //==========================================
    describe("deleteDir()", async function () {

        it("Safe dir", async function () {
            let tempFilePath = configs.testDataDir + "/tmp" + (new Date()).getTime();
            assert.isFalse(fs.existsSync(tempFilePath));

            fs.mkdirSync(tempFilePath);
            fs.createFileSync(tempFilePath + "/someFile");
            fs.mkdirSync(tempFilePath + "/subDir");
            fs.createFileSync(tempFilePath + "/subDir/.anotherFile");

            assert.isTrue(fs.existsSync(tempFilePath));

            await utils.deleteDir(tempFilePath);

            assert.isFalse(fs.existsSync(tempFilePath));
        });

        it("Unsafe dir", async function () {
            let tempFilePath = "/tmp" + (new Date()).getTime();
            assert.isFalse(fs.existsSync(tempFilePath));

            let error = false;
            try {
                await utils.deleteDir(tempFilePath);
            } catch (err) {
                error = true;
            }
            assert.isTrue(error);
        });
    });

    //==========================================
    // clearDir()
    //==========================================
    describe("clearDir()", async function () {

        it("Safe dir", async function () {
            let tempFilePath = configs.testDataDir + "/tmp" + (new Date()).getTime();
            assert.isFalse(fs.existsSync(tempFilePath));

            fs.mkdirSync(tempFilePath);

            try {
                fs.createFileSync(tempFilePath + "/someFile");
                fs.createFileSync(tempFilePath + "/.someFile2");
                fs.mkdirSync(tempFilePath + "/subDir");
                fs.createFileSync(tempFilePath + "/subDir/.anotherFile");

                assert.isTrue(fs.existsSync(tempFilePath));
                assert.isTrue(fs.existsSync(tempFilePath + "/someFile"));
                assert.isTrue(fs.existsSync(tempFilePath + "/.someFile2"));
                assert.isTrue(fs.existsSync(tempFilePath + "/subDir"));

                await utils.clearDir(tempFilePath);

                assert.isTrue(fs.existsSync(tempFilePath));
                assert.isFalse(fs.existsSync(tempFilePath + "/someFile"));
                assert.isFalse(fs.existsSync(tempFilePath + "/.someFile2"));
                assert.isFalse(fs.existsSync(tempFilePath + "/subDir"));
            } finally {
                await utils.deleteDir(tempFilePath);
            }

        });

        it("Unsafe dir", async function () {
            let tempFilePath = "/tmp" + (new Date()).getTime();
            assert.isFalse(fs.existsSync(tempFilePath));

            let error = false;
            try {
                await utils.clearDir(tempFilePath);
            } catch (err) {
                error = true;
            }
            assert.isTrue(error);
        });
    });

    //==========================================
    // getDefinedOrNull()
    //==========================================
    describe("getDefinedOrNull()", async function () {

        it("Defined stays untouches", async function () {

            let res = utils.getDefinedOrNull("abc");
            assert.strictEqual(res, "abc");

            res = utils.getDefinedOrNull("");
            assert.strictEqual(res, "");

            res = utils.getDefinedOrNull(123);
            assert.strictEqual(res, 123);

            res = utils.getDefinedOrNull({});
            assert.deepEqual(res, {});

            res = utils.getDefinedOrNull([]);
            assert.deepEqual(res, []);
        });

        it("Null stays Null", async function () {
            let res = utils.getDefinedOrNull(null);
            assert.strictEqual(res, null);
        });

        it("Undefined becomes Null", async function () {
            let res = utils.getDefinedOrNull(undefined);
            assert.strictEqual(res, null);
        });
    });
});

