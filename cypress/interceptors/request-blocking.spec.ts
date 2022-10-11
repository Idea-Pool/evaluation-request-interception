import { selectors } from '../fixtures/test-data.json';

describe('Request Blocking', () => {
  before(() => {
    cy.visit('/');
    cy.intercept('GET', '/api/users?page=2', (req) => req.destroy());
    cy.get(selectors.users).click();
  });

  describe('Blocking the request', () => {
    it("should not let the response text appear in the UI's response section", () => {
      cy.get(selectors.uiUsersResponse).invoke('text').should('be.empty');
    });
  });
});
