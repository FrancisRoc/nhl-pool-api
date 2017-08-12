import * as request from "supertest";
import * as Player from "../models/playerInfoModel/playerInfos";
import { configs } from "../../config/configs";
import { Express } from "express";
import { assert, expect, use } from "chai";
import { utils } from "../utils/utils";
import * as fs from "fs-extra";
import { startServer } from "../../tests/resources/server.test";
import { playersService } from '../services/players.service';
import { TestData } from "../../test-data/test-data";
import * as _ from "lodash";
import * as chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

//==========================================
// Variables globales
//==========================================
let testApp: Express;

//==========================================
// Create a default test app
//==========================================
before(async function () {

    try {
        this.timeout(120000);
        testApp = await startServer();
    } catch (error) {
        return error;
    }

});