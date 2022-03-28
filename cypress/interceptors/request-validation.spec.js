const testData = require('../fixtures/data.json');

describe('Request Validation', () => {
  beforeEach(() => {
    cy.visit(testData.baseUrl);
    cy.intercept('GET', '/api/users?page=2').as('usersRequest');
    cy.get(testData.selectors.users).click();
  });

  describe('Request verification', () => {
    it('should be a GET method', () => {
      cy.wait('@usersRequest').its('request.method').should('equal', 'GET');
    });

    it('should have the correct URL', () => {
      cy.wait('@usersRequest')
        .its('request.url')
        .should('equal', testData.requestUrl);
    });
  });
});
