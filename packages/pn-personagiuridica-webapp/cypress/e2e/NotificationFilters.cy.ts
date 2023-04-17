import { today } from '@pagopa-pn/pn-commons';
import { NOTIFICHE } from '../../src/navigation/routes.const';
import { NOTIFICATION_PAYMENT_INFO } from '../../src/api/notifications/notifications.routes';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATIONS_LIST,
} from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

const notifications = [
  {
    iun: 'XQPQ-MAJP-HMTJ-202211-E-1',
  },
  {
    iun: 'MUKX-VEDN-ZTLW-202211-L-1',
  },
];

const startDateInput = '[data-testid="input(start date)"]';
const endDateInput = '[data-testid="input(end date)"]';
const filterButton = 'Filtra';
const notificationMenuItem = '[data-testid="menu-item(notifiche)"]';
const delegationMenuItem = '[data-testid="menu-item(deleghe)"]';
const notificationListItem = '[data-testid="table(notifications)"] > :nth-child(2) > :first';
const notificationsByDelegateMenuItem = '[data-testid="collapsible-list"] > :nth-child(2)';

const getDates = (endToday: boolean = false) => {
  const startDate = new Date();
  const endDate = new Date();

  endToday ? endDate.setDate(today.getDate()) : endDate.setDate(today.getDate() - 1);

  startDate.setDate(endDate.getDate() - 30);

  const dateFormat: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  };

  const startDateStr = new Intl.DateTimeFormat('it-IT', dateFormat).format(startDate);
  const endDateStr = new Intl.DateTimeFormat('it-IT', dateFormat).format(endDate);

  return {
    startDate: startDateStr,
    endDate: endDateStr,
  };
};

describe('Notification Filters (no delegators)', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, {
      fixture: 'notifications/list-10/page-1',
    }).as('getNotifications');
    cy.intercept(`${NOTIFICATION_DETAIL(notifications[0].iun)}*`, {
      statusCode: 200,
      fixture: 'notifications/viewed',
    }).as('selectedNotification');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, { fixture: 'delegations/no-mandates' }).as(
      'getDelegators'
    );

    cy.intercept(`${NOTIFICATION_PAYMENT_INFO('', '')}/**`, { fixture: 'payments/required' }).as(
      'getPaymentInfo'
    );

    cy.login();
    cy.visit(NOTIFICHE);

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');
  });

  it('filtered dates should not change after visiting delegations page', () => {
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get(delegationMenuItem).click();

    cy.wait(['@getDelegates', '@getDelegators']);
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(notificationMenuItem).click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);
  });

  it('filtered dates should not change after visiting a notification detail', () => {
    const iun = notifications[0].iun;
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.intercept(`${NOTIFICATION_DETAIL(iun)}`, {
      statusCode: 200,
      fixture: 'notifications/viewed',
    }).as('selectedNotification');

    cy.get(notificationListItem).click();

    cy.wait('@selectedNotification');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');
    
    cy.get(notificationMenuItem).click();
    
    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');
    
    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);
  });

  it('filtered dates should not change after visiting a notification detail and delegation list', () => {
    const iun = notifications[0].iun;
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait('@getNotifications');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.intercept(`${NOTIFICATION_DETAIL(iun)}`, {
      statusCode: 200,
      fixture: 'notifications/viewed',
    }).as('selectedNotification');

    cy.get(notificationListItem).click();

    cy.wait('@selectedNotification');
    cy.wait('@getPaymentInfo');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get(notificationMenuItem).click();

    cy.wait('@getNotifications');

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);

    cy.get(delegationMenuItem).click();

    cy.wait(['@getDelegates', '@getDelegators']);
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(notificationMenuItem).click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);
  });

  it('end date should reset when "today" has been selected', () => {
    const { startDate, endDate } = getDates(true);

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton)
      .click()
      .then(() => {});

    cy.wait('@getNotifications');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get(delegationMenuItem).click();

    cy.wait(['@getDelegates', '@getDelegators']);
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(notificationMenuItem).click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', '');
  });

  it('should filter notifications by IUN', () => {
    const filteredIun = notifications[1].iun;

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, {
      fixture: 'notifications/list-10/page-1',
    }).as('getNotifications');

    cy.get('#iunMatch').type(filteredIun);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '', iun: filteredIun })}*`, {
      statusCode: 200,
      fixture: 'notifications/list-10/filtered-iun',
    }).as('filteredNotifications');

    cy.contains(/^Filtra$/).click();

    cy.wait('@filteredNotifications').then((interception) => {
      expect(interception.request.url).include(`iunMatch=${filteredIun}`);
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('#iunMatch').should('have.value', filteredIun);

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 1);
  });
});

describe('Notification Filters (delegators)', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`).as('getNotifications');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}*`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}*`, {
      fixture: 'delegations/mandates-by-delegate',
    }).as('getDelegators');

    cy.login();
    cy.visit(NOTIFICHE);

    cy.wait('@getNotifications');
  });

  it('filters reset visiting notifications list as a delegate', () => {
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait('@getNotifications');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, {
      fixture: 'notifications/delegator/list-10/page-1',
    }).as('getNotificationsByDelegate');

    cy.get(notificationsByDelegateMenuItem).click();

    cy.wait('@getNotificationsByDelegate');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get(startDateInput).should('have.value', '');
    cy.get(endDateInput).should('have.value', '');
  });
});
