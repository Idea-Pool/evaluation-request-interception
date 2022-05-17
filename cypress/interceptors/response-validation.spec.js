const { assertSchema } = require('@cypress/schema-tools');
const { baseUrl } = require('../fixtures/config.json');
const {
  selectors,
  expectedResponseCode,
  expectedStatusMessage,
} = require('../fixtures/test-data.json');
const responseBody = require('../fixtures/response-bodies.json');
const { schemas } = require('../fixtures/response-schema.js');

describe('Response Validation', () => {
  let usersResponse;

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.intercept('GET', '/api/users?page=2').as('usersRequest');
    cy.get(selectors.users).click();
    cy.wait('@usersRequest').then(({ response }) => {
      usersResponse = response;
    });
  });

  describe('Response verification', () => {
    it('PLUS: The reqres homepage should be opened', () => {
      cy.url().should('equal', baseUrl);
    });

    it('the status code should be 200', () => {
      expect(usersResponse.statusCode).to.equal(expectedResponseCode);
    });

    it('PLUS: The status message should be "OK"', () => {
      expect(usersResponse.statusMessage).to.equal(expectedStatusMessage);
    });

    describe('The response body', () => {
      it('should match exactly', () => {
        expect(usersResponse.body).to.deep.equal(
          responseBody.expectedUsersBody
        );
      });

      it('should match partially', () => {
        expect(usersResponse.body).to.deep.contain(
          responseBody.partialUsersBody
        );
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
    cy.get(selectors.users).click();
    cy.get(selectors.users).click();
    cy.wait('@usersRequest').wait('@usersRequest');

    cy.get('@usersRequest.all').should('have.length', 3);
  });

  it('The response duration should not be longer than 1s', () => {
    // CYPRESS has no built in method for checking response duration.
    const clickTimestamp = Date.now();
    cy.get(selectors.users).click();
    cy.wait('@usersRequest').should(() => {
      const responseTimestamp = Date.now();
      expect(responseTimestamp - clickTimestamp).to.be.lessThan(1000);
    });
  });
});
