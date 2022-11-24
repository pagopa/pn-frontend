import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { NOTIFICHE } from '../../src/navigation/routes.const';
import { NOTIFICATION_PAYMENT_INFO } from '../../src/api/notifications/notifications.routes';
import { NOTIFICATION_DETAIL, NOTIFICATION_DETAIL_LEGALFACT, NOTIFICATIONS_LIST } from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

const notifications = [
  {
    iun: 'PUGM-YUPG-UEUH-202211-U-1',
    statusBefore: NotificationStatus.DELIVERED,
    statusAfter: NotificationStatus.VIEWED
  },
  {
    iun: 'NUKM-YLNM-EYUG-202211-W-1',
    status: NotificationStatus.EFFECTIVE_DATE,
    legalFactId: 'safestorage%3A%2F%2FPN_LEGAL_FACTS-0002-B4ZJ-7MCN-2Y59-4B6C'
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

  it.only('Downloads Legal fact', () => {
    cy.intercept(`${NOTIFICATION_DETAIL(notifications[1].iun)}*`, {
      statusCode: 200,
      fixture: 'notifications/notification-5_effective_date' }
    ).as('selectedNotification');
    
    cy.contains(notifications[1].iun).click();

    // cy.intercept('GET', `${NOTIFICATION_DETAIL_LEGALFACT(notifications[1].iun, notifications[1].legalFactId)}*`, {
    cy.intercept('GET', `delivery-push/${notifications[1].iun}/legal-facts/DIGITAL_DELIVERY/${notifications[1].legalFactId}*`, {
      statusCode: 200,
      fixture: 'legalFacts/WZ94.pdf'
    }).as('downloadLegalFact');
    
    cy.wait('@selectedNotification');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains(/^Attestazione opponibile a terzi\b/).click();

    cy.wait('@downloadLegalFact').then((interception) => {
      expect(interception.request.url).include(notifications[1].legalFactId);
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it('change notification status from \'DELIVERED\' to \'VIEWED\'', () => {
    cy.intercept('GET', `${NOTIFICATION_DETAIL(notifications[0].iun)}`, {
      statusCode: 200,
      fixture: 'notifications/notification-1_viewed'
    }).as('selectedNotification');

    cy.contains(`${notifications[0].iun}`).click();

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.wait('@selectedNotification').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.wait('@getPaymentInfo');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains('Perfezionata per visione');

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, { fixture: 'notifications/list-10_page-1_viewed' }).as('getNotifications');

    cy.get('[data-cy="menu-item(notifiche)"]').click();

    cy.get('[data-cy="table(notifications).row"]').eq(0).find('.MuiChip-label').should('have.text', 'Perfezionata per visione');
  });

  it('should have status \'EFFECTIVE_DATE\'', () => {
    cy.intercept('GET', `${NOTIFICATION_DETAIL(notifications[1].iun)}`, {
      statusCode: 200,
      fixture: 'notifications/notification-5_effective_date'
    }).as('selectedNotification');

    cy.get('[data-cy="table(notifications).row"]').eq(4).find('.MuiChip-label')
    .should('have.text', 'Perfezionata per decorrenza termini');

    cy.contains(`${notifications[1].iun}`).click();

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.wait('@selectedNotification').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.wait('@getPaymentInfo');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains('Perfezionata per decorrenza termini');
  });
});