
import { NotificationStatus } from '@pagopa-pn/pn-commons';

const filters = {
  taxId: 'CLMCST42R12D969Z',
  iun: 'UAXE-PUWR-LDZX-202211-N-1',
  startDate: '',
  endDate: '',
  status: NotificationStatus.VIEWED
}

describe("Notifications Filter", () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10_page-1'
    }).as('notifications');

    cy.logout();
    cy.loginWithTokenExchange();
    cy.visit('/dashboard');
  });

  it('Set filters to date range 01/09/2022 - 02/09/2022, view a notification detail, then go back e verify if filters are still enabled', () => {
    const startDate = '01/09/2022';
    const endDate = '02/09/2022';
    cy.get('#startDate').type(startDate);
    cy.get('#endDate').type(endDate);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10_filtered-dates_page-1'
    }).as('filteredNotifications');

    cy.get('.MuiButton-outlined').click();

    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`startDate=2022-09-01`);
      expect(interception.request.url).include(`endDate=2022-09-03`);
      expect(interception.response.statusCode).to.equal(200);
    });
    
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get(':nth-child(1) > .css-pgy0cg-MuiTableCell-root').should('be.visible').click();
    cy.get('.css-6ezsbm-MuiStack-root > .MuiButton-root').click();
    cy.get('#startDate').should('have.value', startDate);
    cy.get('#endDate').should('have.value', endDate);
  });

  it('Filter notifications list by recipient tax id', () => {
    cy.get('#recipientId').type(filters.taxId);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10_filtered-recipientTaxId_page-1'
    }).as('filteredNotifications');

    cy.contains(/^Filtra$/).click();

    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`recipientId=${filters.taxId}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('#recipientId').should('have.value', filters.taxId);

    cy.get('[data-cy="table(notifications).row"]').should('have.length', 10);
  });

  it('Filter notifications list by IUN', () => {
    cy.get('#iunMatch').type(filters.iun);
    
    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list_filtered-iun'
    }).as('filteredNotifications');

    cy.contains(/^Filtra$/).click();

    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`iunMatch=${filters.iun}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('#iunMatch').should('have.value', filters.iun);

    cy.get('[data-cy="table(notifications).row"]').should('have.length', 1);
  });

  it('Filter notifications list by status', () => {
    cy.get('#status').click();
    cy.get(`[data-value="${filters.status}"]`).click();
    
    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list_filtered-status'
    }).as('filteredNotifications');

    cy.contains(/^Filtra$/).click();

    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`status=${filters.status}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('[NAME="status"]').should('have.value', filters.status);

    cy.get('[data-cy="table(notifications).row"]').should('have.length', 10);
  });
});