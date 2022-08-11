import { assertSchema } from '@cypress/schema-tools';
import { selectors, baseUrl, expectedResponseCode, expectedStatusMessage } from '../fixtures/test-data.json';
import { expectedUsersBody, partialUsersBody } from '../fixtures/response-bodies.json';
import { schemas } from '../fixtures/response-schema';
import { CyHttpMessages } from 'cypress/types/net-stubbing';

describe('Response Validation', () => {
  let usersResponse: CyHttpMessages.IncomingResponse;
  const MAX_RESPONSE_TIME = 1000;

  before(() => {
    cy.visit('/');
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
        expect(usersResponse.body).to.deep.equal(expectedUsersBody);
      });

      it('should match partially', () => {
        expect(usersResponse.body).to.deep.contain(partialUsersBody);
      });

      it('should match the schema', () => {
        expect(() => assertSchema(schemas)('Response Body', '1.0.0')(usersResponse.body)).to.not.throw();
      });

      it('should appear on the UI', () => {
        cy.get(selectors.uiUsersResponse)
          .invoke('text')
          .then((textContent) => {
            const parsedTextContent = JSON.parse(textContent);
            expect(parsedTextContent).to.deep.equal(expectedUsersBody);
          });
      });
    });
  });

  it('The number of responses should be 1', () => {
    // CYPRESS only waits for the first matching request.
    cy.get('@usersRequest.all').should('have.length', 1);
  });

  it('The response duration should not be longer than 1s', () => {
    // CYPRESS has no built in method for checking response duration.

    cy.intercept('GET', '/api/users?page=2').as('usersRequest');
    const clickTimestamp = Date.now();
    cy.get(selectors.users).click();
    cy.wait('@usersRequest').should(() => {
      const responseTimestamp = Date.now();
      expect(responseTimestamp - clickTimestamp).to.be.lessThan(MAX_RESPONSE_TIME);
    });
  });
});
