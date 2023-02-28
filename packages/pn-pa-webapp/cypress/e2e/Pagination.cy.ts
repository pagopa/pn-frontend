describe("Pagination", () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    // cy.intercept('GET', /delivery\/notifications\/sent/, {
    cy.intercept('GET', /delivery\/notifications\/sent.*size=10/, {
      statusCode: 200,
      fixture: 'notifications/list-10/page-1'
    }).as('notifications');

    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-accepted'
    });

    cy.logout();
    cy.loginWithTokenExchange();
    cy.visit('/dashboard');
  });

  it('should change the number of results per page', () => {
    cy.intercept('GET', /delivery\/notifications\/sent.*size=20/, {
      statusCode: 200,
      fixture: 'notifications/list-20/page-1'
    }).as('notifications_2');

    cy.get('[data-cy="table(notifications).row"]').should('have.length', 10);

    cy.get('.MuiButton-endIcon > [data-testid="ArrowDropDownIcon"]').click();
    cy.get('.MuiPaper-root > .MuiList-root > :nth-child(2)').click();

    cy.wait('@notifications_2').then((interception) => {
      expect(interception.request.url).include('size=20');
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');
    
    cy.get('[data-testid="itemsPerPageSelector"] > .MuiButton-root').should('have.text', '20');
    
    cy.get('[data-cy="table(notifications).row"]').should('have.length', 20);
  });

  it('Should change current page', () => {
    cy.intercept('GET', /delivery\/notifications\/sent.*nextPagesKey=11111111111111111111/, {
      statusCode: 200,
      fixture: 'notifications/list-10/page-2'
    }).as('notifications_2');
    
    cy.get('.MuiPagination-ul > :nth-child(1) button').should('be.disabled');
    cy.get('.MuiPagination-ul > :nth-child(3) > .MuiButtonBase-root').click();

    cy.wait('@notifications_2').then((interception) => {
      expect(interception.request.url).include('nextPagesKey=11111111111111111111');
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});