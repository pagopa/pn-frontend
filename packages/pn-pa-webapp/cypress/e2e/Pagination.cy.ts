import { NOTIFICATIONS_LIST } from '../../src/api/notifications/notifications.routes';
import { getParams } from '../support/utils';

describe('Pagination', () => {
  before(() => {
    cy.loginWithTokenExchange();
  });

  beforeEach(() => {
    // this prevents random errors in the app from breaking cypress tests
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.viewport(1920, 1080);

    // cy.intercept('GET', /delivery\/notifications\/sent/, {
    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({})), {
      statusCode: 200,
      fixture: 'notifications/list-10/page-1',
    }).as('notifications');

    // stubs tos and privacy consents
    cy.stubConsents();

    cy.visit('/dashboard');
  });

  it('should change the number of results per page', () => {
    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({ size: 20 })), {
      statusCode: 200,
      fixture: 'notifications/list-20/page-1',
    }).as('notifications_2');

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 10);

    cy.get('[data-testid="rows-per-page"]').click();
    cy.get('[data-testid="pageSize-20"]').click();

    cy.wait('@notifications_2').then((interception) => {
      expect(interception.request.url).include('size=20');
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('[data-testid="itemsPerPageSelector"] > .MuiButton-root').should('have.text', '20');

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 20);
  });

  it('Should change current page', () => {
    const pageKey = '11111111111111111111';
    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({ nextPagesKey: pageKey })), {
      statusCode: 200,
      fixture: 'notifications/list-10/page-2',
    }).as('notifications_2');

    cy.get('[aria-label="Vai alla pagina precedente"]').should('be.disabled');
    cy.get('[aria-label="Vai alla pagina successiva"]').click();

    cy.wait('@notifications_2').then((interception) => {
      expect(interception.request.url).include(`nextPagesKey=${pageKey}`);
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});
