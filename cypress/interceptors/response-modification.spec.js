const { assertSchema } = require('@cypress/schema-tools');
const testData = require('../fixtures/data.json');
const { schemas } = require('../fixtures/response-schema.js');

describe('Response Modification', () => {
  let usersResponse;

  beforeEach(() => {
    cy.visit(testData.baseUrl);
    cy.intercept('GET', '/api/users?page=2', (req) => {
      req.continue((res) => {
        res.statusCode = testData.modifiedResponseCode;
        res.body = testData.modifiedUsersBody;
      });
    }).as('usersRequest');
    cy.get(testData.selectors.users).click();
    cy.wait('@usersRequest').then(({ response }) => {
      usersResponse = response;
    });
  });

  describe('Modified response verification', () => {
    it('the status code should not be 200', () => {
      expect(usersResponse.statusCode).to.be.equal(
        testData.modifiedResponseCode
      );
    });

    describe('The modified response body', () => {
      it('should match exactly', () => {
        expect(usersResponse.body).to.deep.equal(testData.modifiedUsersBody);
      });

      it('should match partially', () => {
        expect(usersResponse.body).to.deep.contain(
          testData.modifiedPartialUsersBody
        );
      });

      it('should match the schema', () => {
        expect(() =>
          assertSchema(schemas)('Response Body', '1.0.0')(usersResponse.body)
        ).to.not.throw();
      });
    });
  });
});
