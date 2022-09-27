describe('Auth', () => {
  it('Should login properly through UI', () => {
    cy.logout();
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