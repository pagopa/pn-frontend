/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import {PNRole} from '../../src/models/user';
import {User} from '../../src/redux/auth/types';
import './NewNotification';
import { GET_CONSENTS } from '../../src/api/consents/consents.routes';
import { AUTH_TOKEN_EXCHANGE } from '../../src/api/auth/auth.routes';
import { ConsentType } from '../../src/models/consents';

/*
 * Set user role
 */
Cypress.Commands.add('setRole', (role: PNRole) => {
  cy.window().then((win) => {
    let user: User = JSON.parse(win.sessionStorage.getItem('user'));
    user.organization.roles[0].role = role;
    win.sessionStorage.setItem('user', JSON.stringify(user));
  });
});

/*
 * Login with token exchange
 */
Cypress.Commands.add('loginWithTokenExchange', (role?: PNRole) => {
  Cypress.on('window:before:load', (window) => {
    window.document.cookie =
      'OptanonAlertBoxClosed=2023-03-17T15:26:49.072Z; ' +
      'OptanonConsent=isGpcEnabled=0' +
      '&datestamp=Thu+Apr+06+2023+11%3A18%3A13+GMT%2B0200+(Central+European+Summer+Time)' +
      '&version=202303.2.0' +
      '&isIABGlobal=false' +
      '&hosts=' +
      '&landingPath=NotLandingPage' +
      '&groups=C0001%3A1%2CC0002%3A1' +
      '&geolocation=%3B' +
      '&AwaitingReconsent=false';
  });
  cy.intercept({
    method: 'POST',
    url: AUTH_TOKEN_EXCHANGE(),
  }).as('login');
  cy.visit('/#selfCareToken=' + Cypress.env('tokenExchange'));
  cy.wait('@login');
  if (role) {
    cy.log(`Setting user role to ${role}`);
    cy.setRole(role);
  }
});

/**
 * Logout programmatically
 */
Cypress.Commands.add('logout', () => {
  /**
   * TODO: implement logout through api
   */
  cy.window().then((win) => {
    const user = win.sessionStorage.getItem('user');

    if (user) {
      win.sessionStorage.removeItem('user');
    }
  });
});

Cypress.Commands.add('stubConsents', () => {
  cy.intercept(GET_CONSENTS(ConsentType.TOS), {
    statusCode: 200,
    fixture: 'tos/tos-accepted',
  });
  cy.intercept(GET_CONSENTS(ConsentType.DATAPRIVACY), {
    statusCode: 200,
    fixture: 'tos/privacy-accepted',
  });
});
