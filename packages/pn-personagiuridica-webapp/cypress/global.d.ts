/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Logs-in user by using UI
     */
     login(): void;
     logout(): void;
     loginWithUI(): void;
  }
}