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
//  - Request players stats ordered by GOALS
//==========================================
describe(`Scenario #1 - Request players stats ordered by goals.`, function () {

    it(`SOB1973 Get players with all stats ordered by descending goals for all position (default) and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/goals`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by goals
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.goals, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.goals).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.goals);
        }
    });

    it(`SOB1974 Get players with all stats ordered by descending goals for all position (default) and limit of 5)`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 5;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/goals?limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by goals
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.goals, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.goals).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.goals);
        }
    });

    it(`SOB1975 Get players with all stats ordered by descending goals for positions C, RW, LW and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/goals?positions=c,RW,LW`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by goals
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.goals, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['C', 'RW', 'LW']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.goals).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.goals);
        }
    });

    it(`SOB1975 Get players with all stats ordered by descending goals for positions D and limit 58`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 58;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/goals?positions=D&limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by goals
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.goals, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['D']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.goals).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.goals);
        }
    });
});

//===========================================
// Scénario 2:
//  - Request players stats ordered by ASSISTS
//==========================================
describe(`Scenario #2 - Request players stats ordered by assists.`, function () {

    it(`SOB1977 Get players with all stats ordered by descending assists for all position (default) and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/assists`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by assists
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.assists, 'number', "Assists type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.assists).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.assists);
        }
    });

    it(`SOB1978 Get players with all stats ordered by descending assists for all position (default) and limit of 15)`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 15;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/assists?limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by assists
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.assists, 'number', "assists type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.assists).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.assists);
        }
    });

    it(`SOB1979 Get players with all stats ordered by descending assists for positions C, RW, LW and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/assists?positions=c,RW,LW`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by assists
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.assists, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['C', 'RW', 'LW']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.assists).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.assists);
        }
    });

    it(`SOB1980 Get players with all stats ordered by descending assists for positions D and limit 158`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 58;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/assists?positions=D&limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by assists
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.assists, 'number', "assists type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['D']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.assists).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.assists);
        }
    });
});

//===========================================
// Scénario 3:
//  - Request players stats ordered by POINTS
//==========================================
describe(`Scenario #3 - Request players stats ordered by points.`, function () {

    it(`SOB1981 Get players with all stats ordered by descending points for all position (default) and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/points`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by points
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.points, 'number', "points type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.points).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.points);
        }
    });

    it(`SOB1982 Get players with all stats ordered by descending points for all position (default) and limit of 22)`, async function () {
        let poolId: string = TestData.pools[0]._id;
        let limit: number = 22;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/points?limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by points
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.points, 'number', "points type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.points).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.points);
        }
    });

    it(`SOB1983 Get players with all stats ordered by descending points for positions C, RW, LW and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/points?positions=c,RW,LW`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by points
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.points, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['C', 'RW', 'LW']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.points).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.points);
        }
    });

    it(`SOB1984 Get players with all stats ordered by descending points for positions D and limit 101`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 101;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/points?positions=D&limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by points
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.points, 'number', "points type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['D']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.points).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.points);
        }
    });
});

//===========================================
// Scénario 4:
//  - Request players stats ordered by +/-
//==========================================
describe(`Scenario #4 - Request players stats ordered by plusMinus.`, function () {

    it(`SOB1985 Get players with all stats ordered by descending plusMinus for all position (default) and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/plusMinus`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by plusMinus
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.plusMinus, 'number', "plusMinus type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.plusMinus).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.plusMinus);
        }
    });

    it(`SOB1986 Get players with all stats ordered by descending plusMinus for all position (default) and limit of 51)`, async function () {
        let poolId: string = TestData.pools[0]._id;
        let limit: number = 51;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/plusMinus?limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by plusMinus
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.plusMinus, 'number', "plusMinus type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.plusMinus).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.plusMinus);
        }
    });

    it(`SOB1987 Get players with all stats ordered by descending plusMinus for positions C, RW, LW and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/plusMinus?positions=c,RW,LW`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by plusMinus
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.plusMinus, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['C', 'RW', 'LW']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.plusMinus).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.plusMinus);
        }
    });

    it(`SOB1988 Get players with all stats ordered by descending plusMinus for positions D and limit 101`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 101;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/plusMinus?positions=D&limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by plusMinus
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.plusMinus, 'number', "plusMinus type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['D']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.plusMinus).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.plusMinus);
        }
    });
});

//===========================================
// Scénario 5:
//  - Request players stats ordered by PIM
//==========================================
describe(`Scenario #5 - Request players stats ordered by penalityMin.`, function () {

    it(`SOB1989 Get players with all stats ordered by descending penalityMin for all position (default) and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/penalityMin`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by penalityMin
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.penalityMin, 'number', "penalityMin type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.penalityMin).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.penalityMin);
        }
    });

    it(`SOB1990 Get players with all stats ordered by descending penalityMin for all position (default) and limit of 17)`, async function () {
        let poolId: string = TestData.pools[0]._id;
        let limit: number = 17;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/penalityMin?limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by penalityMin
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.penalityMin, 'number', "penalityMin type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.penalityMin).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.penalityMin);
        }
    });

    it(`SOB1991 Get players with all stats ordered by descending penalityMin for positions C, RW, LW and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/penalityMin?positions=c,RW,LW`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by penalityMin
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.penalityMin, 'number', "Goal type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['C', 'RW', 'LW']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.penalityMin).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.penalityMin);
        }
    });

    it(`SOB1992 Get players with all stats ordered by descending penalityMin for positions D and limit 84`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 101;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/penalityMin?positions=D&limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by penalityMin
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.penalityMin, 'number', "penalityMin type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['D']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.penalityMin).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.penalityMin);
        }
    });
});

//===========================================
// Scénario 6:
//  - Request players stats ordered by HITS
//==========================================
describe(`Scenario #6 - Request players stats ordered by hits.`, function () {

    it(`SOB1993 Get players with all stats ordered by descending hits for all position (default) and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/hits`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by hits
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.hits, 'number', "hits type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.hits).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.hits);
        }
    });

    it(`SOB1994 Get players with all stats ordered by descending hits for all position (default) and limit of 17)`, async function () {
        let poolId: string = TestData.pools[0]._id;
        let limit: number = 17;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/hits?limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by hits
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.hits, 'number', "hits type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['LW', 'C', 'RW', 'D', 'G']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.hits).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.hits);
        }
    });

    it(`SOB1995 Get players with all stats ordered by descending hits for positions C, RW, LW and default limit (${configs.nhlApi.nbPlayersLimit})`, async function () {

        let poolId: string = TestData.pools[0]._id;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/hits?positions=c,RW,LW`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(configs.nhlApi.nbPlayersLimit, "Limit returned players");

        // Verify if players are sorted by hits
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.hits, 'number', "hits type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['C', 'RW', 'LW']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.hits).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.hits);
        }
    });

    it(`SOB1996 Get players with all stats ordered by descending hits for positions D and limit 84`, async function () {

        let poolId: string = TestData.pools[0]._id;
        let limit: number = 101;

        let getUrl = `/api${configs.api.domainPath}/v1/players/pool/${poolId}/stats/orderedBy/hits?positions=D&limit=${limit}`;

        let response = await request(testApp).get(getUrl).send();

        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);

        let orderedPlayersStatsResp = <Player.IPlayerInfo[]>response.body;

        expect(orderedPlayersStatsResp.length).to.be.lte(limit, "Limit returned players");

        // Verify if players are sorted by hits
        assert.typeOf(orderedPlayersStatsResp[0].stats.stats.hits, 'number', "hits type should be number");
        for (let i = 0; i < orderedPlayersStatsResp.length - 1; i ++) { // Don't compare last player
            expect(['D']).to.contains(orderedPlayersStatsResp[i].player.Position);
            expect(orderedPlayersStatsResp[i].stats.stats.hits).to.be.gte(orderedPlayersStatsResp[i + 1].stats.stats.hits);
        }
    });
});

// TODO test draft player endpoint

// TODO test get drafted players endpoint