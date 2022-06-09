import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import chaiSubset from 'chai-subset';
import chaiJsonSchema from 'chai-json-schema';
import Mocha from 'mocha';

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    beforeAll() {
      chai.use(chaiAsPromised);
      chai.use(chaiSubset);
      chai.use(chaiJsonSchema);
    },
  };
};
