import { GET_CONSENTS } from "../../src/api/consents/consents.routes";
import { ConsentType } from "../../src/models/consents";

describe('TOS agreement', () => {
  
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
    cy.logout();
  });

  it('Accept TOS and PRIVACY - first acceptance', () => {
    cy.intercept(GET_CONSENTS(ConsentType.TOS), {
      statusCode: 200,
      fixture: 'tos/tos-first-acceptance'
    });
    cy.intercept(GET_CONSENTS(ConsentType.DATAPRIVACY), {
      statusCode: 200,
      fixture: 'tos/privacy-first-acceptance'
    });
    cy.login();
    cy.contains('Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso.');
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.disabled')
    cy.get('.PrivateSwitchBase-input').click();
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.enabled').click();
  });

  it('Accept TOS and PRIVACY - no first acceptance', () => {
    cy.intercept(GET_CONSENTS(ConsentType.TOS), {
      statusCode: 200,
      fixture: 'tos/tos-no-first-acceptance'
    });
    cy.intercept(GET_CONSENTS(ConsentType.DATAPRIVACY), {
      statusCode: 200,
      fixture: 'tos/privacy-no-first-acceptance'
    });
    cy.login();
    cy.contains('L’Informativa Privacy e i Termini e condizioni d’uso sono cambiati. Per accedere, leggi e accetta la nuova versione.');
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.disabled')
    cy.get('.PrivateSwitchBase-input').click();
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.enabled').click();
  });

  it('Accepted TOS and not accepted PRIVACY', () => {
    cy.intercept(GET_CONSENTS(ConsentType.TOS), {
      statusCode: 200,
      fixture: 'tos/tos-accepted'
    });
    cy.intercept(GET_CONSENTS(ConsentType.DATAPRIVACY), {
      statusCode: 200,
      fixture: 'tos/privacy-no-first-acceptance'
    });
    cy.login();
    cy.contains('L’Informativa Privacy e i Termini e condizioni d’uso sono cambiati. Per accedere, leggi e accetta la nuova versione.');
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.disabled')
    cy.get('.PrivateSwitchBase-input').click();
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.enabled').click();
  });

  it('Not accepted TOS and accepted PRIVACY', () => {
    cy.intercept(GET_CONSENTS(ConsentType.TOS), {
      statusCode: 200,
      fixture: 'tos/tos-no-first-acceptance'
    });
    cy.intercept(GET_CONSENTS(ConsentType.DATAPRIVACY), {
      statusCode: 200,
      fixture: 'tos/privacy-accepted'
    });
    cy.login();
    cy.contains('L’Informativa Privacy e i Termini e condizioni d’uso sono cambiati. Per accedere, leggi e accetta la nuova versione.');
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.disabled')
    cy.get('.PrivateSwitchBase-input').click();
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.enabled').click();
  });
});