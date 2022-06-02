import { assertSchema } from '@cypress/schema-tools';
import { selectors, modifiedResponseCode } from '../fixtures/test-data.json';
import { modifiedUsersBody, modifiedPartialUsersBody } from '../fixtures/response-bodies.json';
import { schemas } from '../fixtures/response-schema';
import { CyHttpMessages } from 'cypress/types/net-stubbing';

describe('Response Modification', () => {
  let usersResponse: CyHttpMessages.IncomingResponse;

  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/users?page=2', (req) => {
      req.continue((res) => {
        // modify response values
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
        expect(() => assertSchema(schemas)('Response Body', '1.0.0')(usersResponse.body)).to.not.throw();
      });
    });
  });
});
