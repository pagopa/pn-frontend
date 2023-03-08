describe('Auth', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
  });

  it('Should login properly using APIs', () => {
    cy.task(
      'log',
      '###################################################################################'
    );
    cy.task('log', Cypress.env('tokenExchange'));
    cy.logout();
    cy.loginWithTokenExchange();
    cy.window().then((win) => {
      cy.task('log', win.sessionStorage);
      cy.task(
        'log',
        '###################################################################################'
      );
      const user = win.sessionStorage.getItem('user');
      expect(user).not.to.be.null;
    });
  });

  it('Should logout properly using APIs', () => {
    cy.logout();
    cy.window().then((win) => {
      const user = win.sessionStorage.getItem('user');
      expect(user).to.be.null;
    });
  });
});
