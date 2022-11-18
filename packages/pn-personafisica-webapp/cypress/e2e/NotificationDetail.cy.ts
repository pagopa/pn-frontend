import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { NOTIFICHE } from '../../src/navigation/routes.const';
import { NOTIFICATION_PAYMENT_INFO } from '../../src/api/notifications/notifications.routes';
import { NOTIFICATION_DETAIL, NOTIFICATIONS_LIST } from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

const notifications = [
  {
    iun: 'PUGM-YUPG-UEUH-202211-U-1',
    statusBefore: NotificationStatus.DELIVERED,
    statusAfter: NotificationStatus.VIEWED
  }
];

describe('Notification Detail', () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
    cy.login();
    cy.visit(NOTIFICHE);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, { fixture: 'notifications/list-10_page-1' }).as('getNotifications');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}*`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}*`, { fixture: 'no-mandates-by-delegate.json' }).as(
      'getDelegators'
    );
    cy.intercept(`${NOTIFICATION_PAYMENT_INFO('*', '*')}*`).as('getPaymentInfo');

    // TODO: set the status during login to avoid keep doing this action
    // accept onetrust cookies
    // cy.get('#onetrust-accept-btn-handler').click();
  });

  it('change notification status from \'DELIVERED\' to \'VIEWED\'', () => {
    cy.intercept('GET', `${NOTIFICATION_DETAIL(notifications[0].iun)}`, {
      statusCode: 200,
      fixture: 'notifications/notification-1_delivered'
    }).as('selectedNotification');

    cy.contains(`${notifications[0].iun}`).click();

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.wait('@selectedNotification').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    // cy.contains('Perfezionata per visione');
    cy.contains('Depositata');
  });
});