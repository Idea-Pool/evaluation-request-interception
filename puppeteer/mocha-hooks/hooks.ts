import * as chai from 'chai';
import * as chaiAsPromised from'chai-as-promised';
import * as chaiDeepMatch from 'chai-deep-match';

export const mochaHooks = {
  beforeAll(done) {
    global.expect = chai.expect;
    chai.use(chaiAsPromised);
    chai.use(chaiDeepMatch);
    chai.use(require("chai-json-schema"));

    done();
  },
};
