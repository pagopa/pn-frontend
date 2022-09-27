// @ts-check
///<reference path="../global.d.ts" />

/**
 * Login programmatically
 */
Cypress.Commands.add('login', () => {
  /**
   * TODO: implement login through api
   */
   cy.window().then(win => {
    const user = win.sessionStorage.getItem('user');

    if(!user) {
      win.sessionStorage.setItem("user", JSON.stringify(Cypress.env("user")));
    }
   });
});

/**
 * Logout programmatically
 */
Cypress.Commands.add('logout', () => {
  /**
   * TODO: implement logout through api
   */
   cy.window().then(win => {
    const user = win.sessionStorage.getItem('user');

    if(user) {
      win.sessionStorage.removeItem("user");
    }
   });
});

Cypress.Commands.add('loginWithUI', () => {
  cy.visit('');

  cy.window().then(win => {
    const user = win.sessionStorage.getItem('user');
    const username = Cypress.env("username") as string;
    // const password = Cypress.env("password", {log: false}) as string;
    const password = Cypress.env("password") as string;

    if(!user) { // no session... login needed
      cy.get('#spidButton').click();

      cy.get('[alt="test"]').click();
      cy.get('input#username').type(username);

      cy.get('input#password').type(password);
      cy.get('button[type="submit"]').first().click();
      cy.get('input[value="Conferma"]').click();
      cy.get('#onetrust-accept-btn-handler').click();
    }
  }); 

  cy.contains('Notifiche');
});