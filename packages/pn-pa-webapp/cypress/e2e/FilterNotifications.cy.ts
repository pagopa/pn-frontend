import { formatDate, NotificationStatus } from '@pagopa-pn/pn-commons';

import {
  NOTIFICATION_DETAIL,
  NOTIFICATIONS_LIST,
} from '../../src/api/notifications/notifications.routes';
import { getParams } from '../support/utils';

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

  before(() => {
    cy.loginWithTokenExchange();
  });

  beforeEach(() => {
    // this prevents random errors in the app from breaking cypress tests
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    // stubs tos and privacy consents
    cy.stubConsents();

    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({})), {
      statusCode: 200,
      fixture: 'notifications/list-10/page-1',
    }).as('notifications');
    cy.viewport(1920, 1080);
  });

  after(() => {
    cy.logout();
  });

  it(`Filters by dates from ${startDate.formatted} to ${endDate.formatted}, enter a notification detail, then go back e verify filters are still set`, () => {
    cy.get('#startDate').type(startDate.formatted);
    cy.get('#endDate').type(endDate.formatted);

    // intercept filtered notifications with startDate and endDate inserted by the user
    // we use a generated string instead of a regex to avoid ambiguity
    cy.intercept(
      'GET',
      NOTIFICATIONS_LIST(getParams({ startDate: startDate.iso, endDate: endDate.iso })),
      {
        statusCode: 200,
        fixture: 'notifications/list-10/filtered-dates',
      }
    ).as('filteredNotifications');

    cy.intercept('GET', NOTIFICATION_DETAIL(filters.iun), {
      statusCode: 200,
      fixture: 'notifications/effective_date',
    }).as('notificationDetail');
    // show and await for filtered notifications
    cy.get('[data-testid="filterButton"]').click();
    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`startDate=${startDate.iso}`);
      expect(interception.request.url).include(`endDate=${endDate.isoNextDay}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('[data-testid="table(notifications).row"] > :nth-child(1)')
      .first()
      .should('be.visible')
      .click();
    cy.wait('@notificationDetail');
    cy.get('[data-testid="breadcrumb-indietro-button"]').click();
    cy.wait('@filteredNotifications');
    cy.get('#startDate').should('have.value', startDate.formatted);
    cy.get('#endDate').should('have.value', endDate.formatted);

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 8);
  });

  it(`Filter notifications by recipient tax id '${filters.taxId}'`, () => {
    cy.get('[data-testid="cancelButton"]').click();
    cy.wait('@notifications');

    cy.get('#recipientId').type(filters.taxId);
    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({ recipientId: filters.taxId })), {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-recipient',
    }).as('filteredByTaxId');

    cy.get('[data-testid="filterButton"]').click();

    cy.wait('@filteredByTaxId').then((interception) => {
      expect(interception.request.url).include(`recipientId=${filters.taxId}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('#recipientId').should('have.value', filters.taxId);

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 10);
  });

  it(`Filter notifications by IUN '${filters.iun}'`, () => {
    cy.get('[data-testid="cancelButton"]').click();
    cy.wait('@notifications');

    cy.get('#iunMatch').type(filters.iun);

    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({ iun: filters.iun })), {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-iun',
    }).as('filteredByIun');

    cy.get('[data-testid="filterButton"]').click();

    cy.wait('@filteredByIun').then((interception) => {
      expect(interception.request.url).include(`iunMatch=${filters.iun}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('#iunMatch').should('have.value', filters.iun);

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 1);
  });

  it(`Filter notifications by status '${filters.status}'`, () => {
    cy.get('[data-testid="cancelButton"]').click();
    cy.wait('@notifications');

    cy.get('#status').click();
    cy.get(`[data-value="${filters.status}"]`).click();

    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({ status: filters.status })), {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-status',
    }).as('filteredByStatus');

    cy.get('[data-testid="filterButton"]').click();

    cy.wait('@filteredByStatus').then((interception) => {
      expect(interception.request.url).include(`status=${filters.status}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('[name="status"]').should('have.value', filters.status);

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 10);
  });
});
