import { utils } from "../../../src/utils/utils";
import * as Promise from "bluebird";

export default function () {
    const self = this;
    let stringToConvert: string;
    let result: boolean;

    self.Given(/^Le paramètre "str" est renseigné avec "([^"]*)"$/, function (valParam: string) {
        const promise = new Promise((resolve, reject) => {
            if (!valParam) {
                self.stringToConvert = null;
            } else {
                self.stringToConvert = valParam;
            }
            return resolve();
        });
        return promise;

    });

    self.When(/^L'utilitaire de conversion est appelé$/, function () {
        const promise = new Promise((resolve, reject) => {
            self.result = utils.stringToBoolean(self.stringToConvert);
            self.expect(self.result).to.not.equal(null);
            return resolve();
        });
        return promise;

    });

    self.Then(/^Le résultat devrait être (true|false)$/, function (param: string) {
        const promise = new Promise((resolve, reject) => {
            let expectedResult: boolean;

            if (param === "true") {
                expectedResult = true;
            } else if (param === "false") {
                expectedResult = false;
            } else if (param === "1") {
                expectedResult = true;
            } else {
                expectedResult = false;
            }

            self.expect(self.result).to.equal(expectedResult);

            return resolve();
        });
        return promise;
    });
}
