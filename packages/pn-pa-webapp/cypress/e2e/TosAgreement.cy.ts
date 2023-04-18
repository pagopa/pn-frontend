import { GET_CONSENTS } from "../../src/api/consents/consents.routes";
import { ConsentType } from "../../src/models/consents";

describe('TOS agreement', () => {
  before(() => {
    cy.loginWithTokenExchange();
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);
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
    cy.visit('');
    cy.contains('Accedendo, accetti i Termini e condizioni d’uso del servizio e confermi di aver letto l’Informativa Privacy.');
    cy.contains('Accedi').should('be.enabled').click();
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
    cy.visit('');
    cy.contains('Accedendo, accetti i Termini e condizioni d’uso del servizio e confermi di aver letto l’Informativa Privacy.');
    cy.contains('Accedi').should('be.enabled').click();
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
    cy.visit('');
    cy.contains('Accedendo, accetti i Termini e condizioni d’uso del servizio e confermi di aver letto l’Informativa Privacy.');
    cy.contains('Accedi').should('be.enabled').click();
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
    cy.visit('');
    cy.contains('Accedendo, accetti i Termini e condizioni d’uso del servizio e confermi di aver letto l’Informativa Privacy.');
    cy.contains('Accedi').should('be.enabled').click();
  });
});