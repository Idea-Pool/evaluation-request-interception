const testData = require('../fixtures/data.json');

describe('Request Modification', () => {
  beforeEach(() => {
    cy.visit(testData.baseUrl);
    cy.intercept('GET', '/api/users?page=2', (req) => {
      req.url = testData.modifiedUrl;
      req.headers[testData.modifiedRequestHeaderProperty] =
        testData.modifiedRequestHeaderPropertyValue;
    }).as('usersRequest');
    cy.get(testData.selectors.users).click();
  });

  describe('Modified request verification', () => {
    it('should be a GET method', () => {
      cy.wait('@usersRequest').its('request.method').should('equal', 'GET');
    });

    it('should have the modified URL', () => {
      cy.wait('@usersRequest')
        .its('request.url')
        .should('equal', testData.modifiedUrl);
    });

    it('should have an additional header property', () => {
      cy.wait('@usersRequest')
        .its('request.headers')
        .should(
          'have.property',
          testData.modifiedRequestHeaderProperty,
          testData.modifiedRequestHeaderPropertyValue
        );
    });
  });
});
