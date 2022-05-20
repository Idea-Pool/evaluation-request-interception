import {
  selectors,
  modifiedUrl,
  modifiedRequestHeaderProperty,
  modifiedRequestHeaderPropertyValue,
} from '../fixtures/test-data.json';

describe('Request Modification', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/users?page=2', (req) => {
      //modify request
      req.url = modifiedUrl;
      req.headers[modifiedRequestHeaderProperty] =
        modifiedRequestHeaderPropertyValue;
    }).as('usersRequest');
    cy.get(selectors.users).click();
  });

  describe('Modified request verification', () => {
    it('should be a GET method', () => {
      cy.wait('@usersRequest').its('request.method').should('equal', 'GET');
    });

    it('should have the modified URL', () => {
      cy.wait('@usersRequest').its('request.url').should('equal', modifiedUrl);
    });

    it('should have an additional header property', () => {
      cy.wait('@usersRequest')
        .its('request.headers')
        .should(
          'have.property',
          modifiedRequestHeaderProperty,
          modifiedRequestHeaderPropertyValue
        );
    });
  });
});
