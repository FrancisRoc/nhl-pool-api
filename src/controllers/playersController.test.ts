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

//===========================================
// Scénario 1:
//  - Request players stats ordered by goals
//==========================================
describe(`Scenario #1 - Request players stats ordered by goals.`, function () {

    it(`SOB1973 Get players with all stats ordered by descending goals`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/goals`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo>response.body;

        /**
         * TODO FIND A WAY TO VERIFY IF PLAYERS ARE ORDERED
         */
        /*assert.propertyVal(orderedPlayersStatsResp, 'applicationType', "new", "Le type d'application est nouvelle demande");
        assert.propertyVal(orderedPlayersStatsResp, 'status', ApplicationStatus.TO_COMPLETE, "Le statut est toComplete");

        // Entités
        assert.property(applicationResp, 'entities', "Entité présente avec la demande");
        assert.strictEqual(applicationResp.entities.length, 1, "Une seule entité présente");
        assert.typeOf(applicationResp.entities[0], 'string', "Le type de l'entité est string"); // Confirmation fetch-children = false (default)

        assert.property(applicationResp, '_id', "La propriété _id est présente");*/
    });
});