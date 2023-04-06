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

import { PNRole } from '../../src/models/user';
import { User } from '../../src/redux/auth/types';
import './NewNotification';

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
  Cypress.on("window:before:load", window => {
    window.document.cookie =
      'OptanonAlertBoxClosed=2023-03-17T15:26:49.072Z; ' +
      'OptanonConsent=isGpcEnabled=0&datestamp=Thu+Apr+06+2023+11%3A18%3A13+GMT%2B0200+(Central+European+Summer+Time)&version=202302.1.0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1&geolocation=%3B&AwaitingReconsent=false';
  });
  cy.intercept({
    method: 'POST',
    url: 'token-exchange',
  }).as('login');
  cy.visit('/#selfCareToken=' + Cypress.env('tokenExchange'));
  cy.wait('@login');
  if (role) {
    cy.log(`Setting user role to ${role}`);
    cy.setRole(role);
  }
});

Cypress.Commands.add('getExchangedToken', () => {
  Cypress.on("window:before:load", window => {
    window.document.cookie =
      'OptanonAlertBoxClosed=2023-03-17T15:26:49.072Z; '
      + 'OptanonConsent=isGpcEnabled=0'
      + '&datestamp=Thu+Apr+06+2023+11%3A18%3A13+GMT%2B0200+(Central+European+Summer+Time)'
      + '&version=202302.1.0'
      + '&isIABGlobal=false'
      + '&hosts='
      + '&landingPath=NotLandingPage'
      + '&groups=C0001%3A1%2CC0002%3A1'
      + '&geolocation=%3B'
      + '&AwaitingReconsent=false';
  });
  cy.intercept({
    method: 'POST',
    url: 'token-exchange',
  }).as('tokenExchange');
  cy.visit('/#selfCareToken=' + Cypress.env('tokenExchange'));
  return cy.wait('@tokenExchange').then((interception) => interception.response);
});

Cypress.Commands.add('loginWithMockedTokenExchange', (tokenExchangeResponse) => {
  cy.intercept({
      method: 'POST',
      url: 'token-exchange',
    },
    tokenExchangeResponse
  );
})

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

Cypress.Commands.add('loginWithUI', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  cy.visit('');
  cy.get('.css-131dr2y-MuiStack-root > :nth-child(2) > .MuiButton-root').click();
  cy.get('#onetrust-accept-btn-handler').click();
  cy.get('#spidButton').click();
  cy.get('[alt="test"]').click();

  cy.origin('selc-u-spid-testenv.westeurope.azurecontainer.io', () => {
    cy.get('#username').type('baldassarremazza');
    cy.get('#password').type('test');
    cy.get('button[type="submit"]').eq(0).click();
    cy.get('button[type="submit"]').eq(0).click();
  });

  cy.get('[data-testid="PartyItemContainer: Comune di Milano"]').click();
  cy.get('.css-ld1zcw > .MuiButton-root').click();
  cy.get(
    ':nth-child(7) > .MuiPaper-root > .MuiCardContent-root > .MuiGrid-container > .css-gzsrxl > .MuiCardActions-root > .MuiButton-root'
  ).click();
});
