import { NotificationStatus } from '@pagopa-pn/pn-commons';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATIONS_LIST,
} from '../../src/api/notifications/notifications.routes';
import { getParams } from '../support/utils';

const notifications = [
  {
    iun: 'RLRP-KDKT-WQYK-202211-Y-1',
    status: NotificationStatus.EFFECTIVE_DATE,
    legalFactId: 'PN_LEGAL_FACTS-0002-V547-0WE5-TKNE-OK0D',
  },
];

describe('Notification Detail', () => {
  before(() => {
    cy.loginWithTokenExchange();
  });

  beforeEach(() => {
    // this prevents random errors in the app from breaking cypress tests
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });

    cy.viewport(1920, 1080);

    cy.intercept('GET', NOTIFICATIONS_LIST(getParams({})), {
      statusCode: 200,
      fixture: 'notifications/list-10/page-1',
    }).as('notifications');

    // stubs tos and privacy consents
    cy.stubConsents();

    cy.visit('/dashboard');
  });

  it('Downloads Legal fact', () => {
    cy.intercept('GET', NOTIFICATION_DETAIL(notifications[0].iun), {
      statusCode: 200,
      fixture: 'notifications/effective_date',
    }).as('selectedNotification');

    // doesn't seem to be a compile route for this one
    cy.intercept('GET', `/delivery-push/${notifications[0].iun}/legal-facts/**`, {
      statusCode: 200,
      fixture: 'legalFacts/OG95.pdf',
    }).as('downloadLegalFact');

    cy.contains(notifications[0].iun).click();

    cy.wait('@selectedNotification');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('[data-testid="download-legalfact"]').first().click();

    cy.wait('@downloadLegalFact').then((interception) => {
      expect(interception.request.url).include(notifications[0].legalFactId);
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it(`Show notification status as '${notifications[0].status}'`, () => {
    cy.intercept('GET', NOTIFICATION_DETAIL(notifications[0].iun), {
      statusCode: 200,
      fixture: 'notifications/effective_date',
    }).as('selectedNotification');

    cy.contains(`${notifications[0].iun}`).click();

    cy.contains('Perfezionata per decorrenza termini');
  });
});
