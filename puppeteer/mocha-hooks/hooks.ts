import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    beforeAll() {
      global.expect = chai.expect;
      chai.use(chaiAsPromised);
      chai.use(require("chai-subset"));
      chai.use(require("chai-json-schema"));
    },
  };
};
