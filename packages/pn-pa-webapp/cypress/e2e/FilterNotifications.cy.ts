import { formatDate, NotificationStatus } from '@pagopa-pn/pn-commons';

const filters = {
  taxId: 'GRBGPP87L04L741X',
  iun: 'TQTY-DKPT-WXUM-202211-A-1',
  // startDate: '01/09/2022',
  // endDate: '02/09/2022',
  startDate: '2022-10-01',
  endDate: '2022-11-16',
  endFilteredDate: '2022-11-17',
  status: NotificationStatus.VIEWED,
};

describe('Filter Notifications', () => {
  const startDate = {
    iso: filters.startDate,
    formatted: formatDate(filters.startDate),
  };
  const endDate = {
    iso: filters.endDate,
    isoNextDay: filters.endFilteredDate,
    formatted: formatDate(filters.endDate),
  };
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10/page-1',
    }).as('notifications');

    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-accepted'
    });

    cy.logout();
    cy.loginWithTokenExchange();
    cy.visit('/dashboard');
  });

  it(`Filters by dates from ${startDate.formatted} to ${endDate.formatted}, enter a notification detail, then go back e verify filters are still set`, () => {
    cy.get('#startDate').type(startDate.formatted);
    cy.get('#endDate').type(endDate.formatted);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-dates',
    }).as('filteredNotifications');

    cy.intercept('GET', `/delivery\/notifications\/sent/${filters.iun}`, {
      statusCode: 200,
      fixture: 'notifications/effective_date',
    }).as('filteredNotifications');

    cy.get('.MuiButton-outlined').click();

    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`startDate=${startDate.iso}`);
      expect(interception.request.url).include(`endDate=${endDate.isoNextDay}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get(':nth-child(1) > .css-pgy0cg-MuiTableCell-root').should('be.visible').click();
    cy.get('[data-testid="breadcrumb-indietro-button"]').click();
    cy.get('#startDate').should('have.value', startDate.formatted);
    cy.get('#endDate').should('have.value', endDate.formatted);

    cy.get('[data-cy="table(notifications).row"]').should('have.length', 8);
  });

  it(`Filter notifications by recipient tax id '${filters.taxId}'`, () => {
    cy.get('#recipientId').type(filters.taxId);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-recipient',
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

  it(`Filter notifications by IUN '${filters.iun}'`, () => {
    cy.get('#iunMatch').type(filters.iun);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-iun',
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

  it(`Filter notifications by status '${filters.status}'`, () => {
    cy.get('#status').click();
    cy.get(`[data-value="${filters.status}"]`).click();

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-status',
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
