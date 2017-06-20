"use strict";
/**
 * @function
 *
 * world is a constructor function
 * with utility properties,
 * destined to be used in step definitions
 */
let cwd = process.cwd();
let path = require("path");
module.exports = function () {
    this.expect = require("chai").expect;
};
//# sourceMappingURL=world.js.map