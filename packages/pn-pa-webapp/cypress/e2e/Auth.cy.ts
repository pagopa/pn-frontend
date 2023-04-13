describe('Auth', () => {
  beforeEach(() => {
    // this prevents random errors in the app from breaking cypress tests
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.viewport(1920, 1080);
  });

  it('Should login properly using APIs', () => {
    cy.logout();
    cy.loginWithTokenExchange();
    cy.window().its('sessionStorage').invoke('getItem', 'user').should('not.to.be.null');
  });

  it('Should logout properly using APIs', () => {
    cy.logout();
    cy.window().then((win) => {
      const user = win.sessionStorage.getItem('user');
      expect(user).to.be.null;
    });
  });
});
