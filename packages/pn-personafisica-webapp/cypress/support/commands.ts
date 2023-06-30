// @ts-check
///<reference path="../global.d.ts" />


import { GET_CONSENTS } from "../../src/api/consents/consents.routes";
import { ConsentType } from "../../src/models/consents";

/**
 * Login programmatically
 */
Cypress.Commands.add('login', () => {
  /**
   * TODO: implement login through api
   */
  Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });

  Cypress.on("window:before:load", window => {
    window.document.cookie =
      'OptanonAlertBoxClosed=2023-03-17T15:26:49.072Z; ' +
      'OptanonConsent=isGpcEnabled=0&datestamp=Thu+Apr+06+2023+11%3A18%3A13+GMT%2B0200+(Central+European+Summer+Time)&version=202303.2.0&isIABGlobal=false&hosts=&landingPath=NotLandingPage&groups=C0001%3A1%2CC0002%3A1&geolocation=%3B&AwaitingReconsent=false';
  });

  cy.window().then((win) => {
    const user = win.sessionStorage.getItem('user');

    if (!user) {
      win.sessionStorage.setItem('user', JSON.stringify(Cypress.env('user')));
    }
  });
  cy.visit('');

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
})
