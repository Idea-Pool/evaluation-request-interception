const { expect } = require("chai");

global.expect = expect;

module.exports = {
  timeout: 30000,
  require: "./puppeteer/mocha-hooks/hooks.ts",
};
