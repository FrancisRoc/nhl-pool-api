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
import { IUser } from '../models/user/user';
import { accountService } from '../services/authentification/accountService';
import { IPoolRequest } from '../models/pool/poolRequest';
import { IPoolResponse } from '../models/pool/poolResponse';

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
//  - Create pool
//==========================================
describe(`Scenario #1 - Create pool.`, function () {
    let members: IUser[];
    let poolId: string;
    before(async function () {
        members = await accountService.getAll();

        // If too much members, keed first 5
        if (members.length > 5) {
            members = members.slice(0, 5);
        }
    });

    it(`P1974 Create new pool with max 5 members`, async function () {
        let postUrl = `/api${configs.api.domainPath}/v1/pools/create`;

        let membersUserName: string[] = [];
        for (let i = 0; i < members.length; i++) {
            membersUserName.push(members[i].username);
        }

        let poolRequest: IPoolRequest = {
            name: "Test case pool",
            members: membersUserName
        };

        let response = await request(testApp).post(postUrl).send(poolRequest);
        assert.strictEqual(response.status, 200);
        assert.isNotNull(response.body);
        
        let pool: IPoolResponse = <IPoolResponse> response.body;
        assert.propertyVal(pool, 'name', poolRequest.name);
        for (let i = 0; i < poolRequest.members.length; i++) {
            assert.propertyVal(pool.members[i], 'username', poolRequest.members[i]);
        }
        
        poolId = pool._id;
    });

    after(async function () {
        await deletePool(poolId);
    });
});

async function deletePool(poolId: string): Promise<void> {
    let response = await request(testApp).delete(`/api${configs.api.domainPath}/v1/pools/${poolId}`).send();
    return Promise.resolve();
}