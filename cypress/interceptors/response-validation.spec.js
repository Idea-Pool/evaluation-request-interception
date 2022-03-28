const { assertSchema } = require('@cypress/schema-tools');
const testData = require('../fixtures/data.json');
const { schemas } = require('../fixtures/response-schema.js');

describe('Response Validation', () => {
  let usersResponse;

  beforeEach(() => {
    cy.visit(testData.baseUrl);
    cy.intercept('GET', '/api/users?page=2').as('usersRequest');
    cy.get(testData.selectors.users).click();
    cy.wait('@usersRequest').then(({ response }) => {
      usersResponse = response;
    });
  });

  describe('Response verification', () => {
    it('PLUS: The reqres homepage should be opened', () => {
      cy.url().should('equal', testData.baseUrl);
    });

    it('the status code should be 200', () => {
      expect(usersResponse.statusCode).to.equal(testData.expectedResponseCode);
    });

    it('PLUS: The status message should be "OK"', () => {
      expect(usersResponse.statusMessage).to.equal(
        testData.expectedStatusMessage
      );
    });
    describe('The response body', () => {
      it('should match exactly', () => {
        expect(usersResponse.body).to.deep.equal(testData.expectedUsersBody);
      });

      it('should match partially', () => {
        expect(usersResponse.body).to.deep.contain(testData.partialUsersBody);
      });

      it('should match the schema', () => {
        expect(() =>
          assertSchema(schemas)('Response Body', '1.0.0')(usersResponse.body)
        ).to.not.throw();
      });
    });
  });

  it('The number of responses should be 1', () => {
    // CYPRESS only waits for the first matching request.
    cy.get(testData.selectors.users).click();
    cy.get(testData.selectors.users).click();
    cy.wait('@usersRequest').wait('@usersRequest');

    cy.get('@usersRequest.all').should('have.length', 3);
  });

  it('The response duration should not be longer than 1s', () => {
    // CYPRESS has no built in method for checking response duration.
    const clickTimestamp = Date.now();
    cy.get(testData.selectors.users).click();
    cy.wait('@usersRequest').should(() => {
      const responseTimestamp = Date.now();
      expect(responseTimestamp - clickTimestamp).to.be.lessThan(1000);
    });
  });
});
