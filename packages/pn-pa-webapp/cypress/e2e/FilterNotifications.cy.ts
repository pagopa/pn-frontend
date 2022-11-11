describe("Notifications Filter", () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
  });

  it('Set filters to date range 01/09/2022 - 02/09/2022, view a notification detail, then go back e verify if filters are still enabled', () => {
    const startDate = '01/09/2022';
    const endDate = '02/09/2022';
    cy.logout();
    cy.loginWithTokenExchange();
    cy.visit('/dashboard');
    cy.get('#startDate').type(startDate);
    cy.get('#endDate').type(endDate);
    cy.intercept({
      method: 'GET',
      url: /delivery/
    }).as('filtering');
    cy.get('.MuiButton-outlined').click();
    cy.wait('@filtering');
    cy.get(':nth-child(1) > .css-pgy0cg-MuiTableCell-root').click();
    cy.get('.css-6ezsbm-MuiStack-root > .MuiButton-root').click();
    cy.get('#startDate').should('have.value', startDate);
    cy.get('#endDate').should('have.value', endDate);
  });
});