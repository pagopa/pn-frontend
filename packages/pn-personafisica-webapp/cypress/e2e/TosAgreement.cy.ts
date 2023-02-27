describe('TOS agreement', () => {
  
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
    cy.logout();
  });

  it('Accept TOS - first acceptance', () => {
    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-first-acceptance'
    });
    cy.login();
    cy.contains('Prima di accedere, accetta i Termini e condizioni d’uso del servizio e leggi l’Informativa Privacy.');
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.disabled')
    cy.get('.PrivateSwitchBase-input').click();
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.enabled').click();
  });

  it('Accept TOS - no first acceptance', () => {
    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-no-first-acceptance'
    });
    cy.login();
    cy.contains('L’Informativa Privacy e i Termini e condizioni d’uso sono cambiati. Per accedere, leggi e accetta la nuova versione.');
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.disabled')
    cy.get('.PrivateSwitchBase-input').click();
    cy.get('.css-xi606m > .MuiButtonBase-root').should('be.enabled').click();
  });
});