describe('Auth', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
  });

  it.skip('Should login properly through UI', () => {
    cy.logout();
    cy.login();
    cy.loginWithUI();
  });

  it('Should login properly using APIs', () => {
    cy.logout();
    cy.login();
  });

  it('Should logout properly using APIs', () => {
    cy.logout();
    cy.window().then(win => {
      const user = win.sessionStorage.getItem('user');
      expect(user).to.be.null;
    });
  });
})