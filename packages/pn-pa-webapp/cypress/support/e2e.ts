// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import { PNRole } from "../../src/models/user";

declare global {
  namespace Cypress {
    interface Chainable {
      login(): void;
      logout(): void;
      setRole(role: PNRole): void;
      loginWithTokenExchange(role?: PNRole): void;
      fillRecipient(recipient: RecipientFormData): void;
      stubConsents(): void;
    }
  }
}
// Import commands.js using ES2015 syntax:
import './commands'
import {RecipientFormData} from "../global";

// Alternatively you can use CommonJS syntax:
// require('./commands')
