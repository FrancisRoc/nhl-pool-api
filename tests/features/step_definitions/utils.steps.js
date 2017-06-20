"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../src/utils/utils");
const Promise = require("bluebird");
function default_1() {
    const self = this;
    let stringToConvert;
    let result;
    self.Given(/^Le paramètre "str" est renseigné avec "([^"]*)"$/, function (valParam) {
        const promise = new Promise((resolve, reject) => {
            if (!valParam) {
                self.stringToConvert = null;
            }
            else {
                self.stringToConvert = valParam;
            }
            return resolve();
        });
        return promise;
    });
    self.When(/^L'utilitaire de conversion est appelé$/, function () {
        const promise = new Promise((resolve, reject) => {
            self.result = utils_1.utils.stringToBoolean(self.stringToConvert);
            self.expect(self.result).to.not.equal(null);
            return resolve();
        });
        return promise;
    });
    self.Then(/^Le résultat devrait être (true|false)$/, function (param) {
        const promise = new Promise((resolve, reject) => {
            let expectedResult;
            if (param === "true") {
                expectedResult = true;
            }
            else if (param === "false") {
                expectedResult = false;
            }
            else if (param === "1") {
                expectedResult = true;
            }
            else {
                expectedResult = false;
            }
            self.expect(self.result).to.equal(expectedResult);
            return resolve();
        });
        return promise;
    });
}
exports.default = default_1;
//# sourceMappingURL=utils.steps.js.map