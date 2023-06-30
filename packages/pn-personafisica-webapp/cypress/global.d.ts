/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Logs-in user by using UI
     */
     login(): void;
     logout(): void;
  }
}

declare const Chainable: Cypress.Chainable