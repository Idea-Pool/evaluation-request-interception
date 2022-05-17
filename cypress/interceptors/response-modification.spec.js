const { assertSchema } = require('@cypress/schema-tools');
const {
  selectors,
  modifiedResponseCode,
} = require('../fixtures/test-data.json');
const {
  modifiedUsersBody,
  modifiedPartialUsersBody,
} = require('../fixtures/response-bodies.json');
const { schemas } = require('../fixtures/response-schema.js');

describe('Response Modification', () => {
  let usersResponse;

  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/users?page=2', (req) => {
      req.continue((res) => {
        //modify response values
        res.statusCode = modifiedResponseCode;
        res.body = modifiedUsersBody;
      });
    }).as('usersRequest');
    cy.get(selectors.users).click();
    cy.wait('@usersRequest').then(({ response }) => {
      usersResponse = response;
    });
  });

  describe('Modified response verification', () => {
    it('the status code should not be 200', () => {
      expect(usersResponse.statusCode).to.be.equal(modifiedResponseCode);
    });

    describe('The modified response body', () => {
      it('should match exactly', () => {
        expect(usersResponse.body).to.deep.equal(modifiedUsersBody);
      });

      it('should match partially', () => {
        expect(usersResponse.body).to.deep.contain(modifiedPartialUsersBody);
      });

      it('should match the schema', () => {
        expect(() =>
          assertSchema(schemas)('Response Body', '1.0.0')(usersResponse.body)
        ).to.not.throw();
      });
    });
  });
});
