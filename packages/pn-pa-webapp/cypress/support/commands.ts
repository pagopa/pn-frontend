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

import './NewNotification';


/*
  * Login with token exchange
  */
Cypress.Commands.add('loginWithTokenExchange', () => {
  cy.intercept({
    method:'POST',
    url: /token-exchange/
  }).as('login');
  cy.visit('/#selfCareToken=' + Cypress.env('tokenExchange'));
  cy.wait('@login');
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

Cypress.Commands.add('fillRecipient', (recipient: RecipientFormData) => {
  // Recipient 2
  cy.get(`input[name="recipients\[${recipient.position}\]\.firstName"]`).clear().type(recipient.data.firstname);
  cy.get(`input[name="recipients\[${recipient.position}\]\.lastName"]`).clear().type(recipient.data.lastname);

  cy.log('writing valid taxtId');
  cy.get(`input[name="recipients\[${recipient.position}\]\.taxId"]`).clear().type(recipient.data.taxId);
  
  if(recipient.data.creditorTaxId) {
    cy.log('writing valid creditor taxtId');
    cy.get(`input[name="recipients\[${recipient.position}\]\.creditorTaxId"]`).clear().type(recipient.data.creditorTaxId);
  }

  if(recipient.data.noticeCode) {
    cy.log('writing valid notice code');
    cy.get(`input[name="recipients\[${recipient.position}\]\.noticeCode"]`).clear().type(recipient.data.noticeCode);
  }

  //Address
  cy.get('[data-testid="PhysicalAddressCheckbox"]').eq(recipient.position).click();
  
  cy.get('button[type="submit"]').should('be.disabled');
  
  cy.get(`input[name="recipients\[${recipient.position}\]\.address"]`).type(recipient.data.address);
  cy.get(`input[name="recipients\[${recipient.position}\]\.houseNumber"]`).type(recipient.data.houseNumber);
  cy.get(`input[name="recipients\[${recipient.position}\]\.municipality"]`).type(recipient.data.municipality);
  cy.get(`input[name="recipients\[${recipient.position}\]\.province"]`).type(recipient.data.province);
  cy.get(`input[name="recipients\[${recipient.position}\]\.zip"]`).type(recipient.data.zip);
  cy.get(`input[name="recipients\[${recipient.position}\]\.foreignState"]`).type(recipient.data.foreignState);
});
