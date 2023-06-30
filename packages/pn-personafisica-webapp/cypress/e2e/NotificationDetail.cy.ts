import { NotificationStatus } from '@pagopa-pn/pn-commons';

import { NOTIFICHE } from '../../src/navigation/routes.const';
import {
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_DETAIL,
  NOTIFICATIONS_LIST
} from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

const notifications = [
  {
    iun: 'XQPQ-MAJP-HMTJ-202211-E-1',
    statusBefore: NotificationStatus.DELIVERED,
    statusAfter: NotificationStatus.VIEWED,
    legalFactId: 'safestorage%3A%2F%2FPN_LEGAL_FACTS-0002-XVU9-QOPG-DMBU-53R4',
  },
  {
    iun: 'RLRP-KDKT-WQYK-202211-Y-1',
    status: NotificationStatus.EFFECTIVE_DATE,
  },
];

describe('Notification Detail', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, {
      fixture: 'notifications/list-10/page-1',
    }).as('getNotifications');

    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`, { fixture: 'delegations/no-mandates' }).as(
      'getDelegates'
    );
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, { fixture: 'delegations/no-mandates' }).as(
      'getDelegators'
    );

    cy.intercept(`${NOTIFICATION_PAYMENT_INFO('', '')}/**`, { fixture: 'payments/required'}).as('getPaymentInfo');

    cy.stubConsents();

    cy.visit(NOTIFICHE);

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');
  });

  it('Downloads Legal fact', () => {
    cy.intercept(`${NOTIFICATION_DETAIL(notifications[0].iun)}*`, {
      statusCode: 200,
      fixture: 'notifications/viewed',
    }).as('selectedNotification');

    cy.contains(notifications[0].iun).click();

    // cy.intercept('GET', `${NOTIFICATION_DETAIL_LEGALFACT(notifications[0].iun, notifications[0].legalFactId)}`, {
    cy.intercept('GET', `/delivery-push/${notifications[0].iun}/legal-facts/**`, {
      statusCode: 200,
      fixture: 'legalFacts/WZ94.pdf',
    }).as('downloadLegalFact');

    cy.wait('@selectedNotification');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains(/^Attestazione opponibile a terzi\b/).click();

    cy.wait('@downloadLegalFact').then((interception) => {
      expect(interception.request.url).include(notifications[0].legalFactId);
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');
  });

  it(`Changes notification status from '${notifications[0].statusBefore}' to '${notifications[0].statusAfter}'`, () => {
    cy.intercept('GET', `${NOTIFICATION_DETAIL(notifications[0].iun)}`, {
      statusCode: 200,
      fixture: 'notifications/viewed',
    }).as('selectedNotification');

    cy.contains(`${notifications[0].iun}`).click();

    cy.wait('@selectedNotification').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.wait('@getPaymentInfo');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains('Avvenuto accesso');

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, {
      fixture: 'notifications/list-10/page-1_viewed',
    }).as('getNotifications');

    cy.get('[data-testid="menu-item(notifiche)"]').click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get('[data-testid="table(notifications).row"]')
      .eq(0)
      .find('[data-testid^="statusChip"]')
      .should('have.text', 'Avvenuto accesso');
  });

  it("should have status 'EFFECTIVE_DATE'", () => {
    cy.intercept('GET', `${NOTIFICATION_DETAIL(notifications[1].iun)}`, {
      statusCode: 200,
      fixture: 'notifications/effective_date',
    }).as('selectedNotification');

    cy.get('[data-testid="table(notifications).row"]')
      .eq(2)
      .find('[data-testid^="statusChip"]')
      .should('have.text', 'Perfezionata per decorrenza termini');

    cy.contains(`${notifications[1].iun}`).click();

    cy.wait('@selectedNotification').then((interception) => {
      expect(interception.response.statusCode).to.equal(200);
    });
    cy.wait('@getPaymentInfo');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains('Perfezionata per decorrenza termini');
  });
});
