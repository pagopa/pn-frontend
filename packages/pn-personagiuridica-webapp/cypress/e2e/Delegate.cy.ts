import { NOTIFICHE } from '../../src/navigation/routes.const';
import {
  NOTIFICATION_PAYMENT_INFO,
  NOTIFICATION_DETAIL,
  NOTIFICATIONS_LIST,
} from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

describe('Delegation', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}**size=10`, {
      fixture: 'notifications/list-10/page-1',
    }).as('getNotifications');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, {
      fixture: 'delegations/mandates-by-delegate',
    }).as('getDelegators');

    cy.intercept(`${NOTIFICATION_PAYMENT_INFO('', '')}/**`, { fixture: 'payments/required' }).as(
      'getPaymentInfo'
    );

    cy.login();
    cy.visit(NOTIFICHE);
  });

  it('should access a notification as delegate', () => {
    const iun = 'WYEJ-VDAL-XDHJ-202211-Q-1';

    cy.fixture('delegations/mandates-by-delegate').then((mandates) => {
      const mandateId = mandates[0].mandateId;

      cy.intercept('GET', `${NOTIFICATIONS_LIST({})}**mandateId=${mandateId}**`, {
        statusCode: 200,
        fixture: 'notifications/delegator/list-10/page-1',
      }).as('notificationsAsDelegate');

      cy.intercept('GET', `${NOTIFICATION_DETAIL(iun, mandateId)}`, {
        statusCode: 200,
        fixture: 'notifications/delegator/detail',
      }).as('notificationAsDelegate');

      cy.get('[data-testid="collapsible-list"] > :nth-child(2)').click();

      cy.wait('@notificationsAsDelegate').then((interception) => {
        expect(interception.request.url).include(`mandateId=${mandateId}`);
        expect(interception.response.statusCode).to.equal(200);
      });
      cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

      cy.get('[data-testid="table(notifications).row"]').should('have.length', 10);

      cy.contains(iun).click();

      cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');
      cy.wait('@notificationAsDelegate').then((interception) => {
        expect(interception.request.url).include(`mandateId=${mandateId}`);
        expect(interception.request.url).include(iun);
        expect(interception.response.statusCode).to.equal(200);
      });
    });
  });
});
