import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Mocha from 'mocha';

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    beforeAll() {
      chai.use(chaiAsPromised);
      chai.use(require('chai-subset'));
      chai.use(require('chai-json-schema'));
    },
  };
};
