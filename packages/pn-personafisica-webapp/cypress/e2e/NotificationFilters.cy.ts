import { today } from '@pagopa-pn/pn-commons';
import { NOTIFICHE } from '../../src/navigation/routes.const';
import { NOTIFICATION_PAYMENT_INFO } from '../../src/api/notifications/notifications.routes';
import { NOTIFICATIONS_LIST } from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

const startDateInput = '[data-cy="input(start date)"]';
const endDateInput = '[data-cy="input(end date)"]';
const filterButton = 'Filtra';
const notificationMenuItem = '[data-cy="menu-item(notifiche)"]';
const delegationMenuItem = '[data-cy="menu-item(deleghe)"]';
const notificationListItem = '[data-cy="table(notifications)"] > :nth-child(2) > :first';
const collapsibleNotificationMenu = '[data-cy="collapsible-menu"]';
const notificationsByDelegateMenuItem = '[data-cy="collapsible-list"] > :nth-child(2)';

const getDates = (endToday: boolean = false) => {
  const startDate = new Date();
  const endDate = new Date();

  endToday ? endDate.setDate(today.getDate()) : endDate.setDate(today.getDate() - 1);

  startDate.setDate(endDate.getDate() - 30);

  const dateFormat: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }

  const startDateStr = new Intl.DateTimeFormat('it-IT', dateFormat).format(startDate);
  const endDateStr = new Intl.DateTimeFormat('it-IT', dateFormat).format(endDate);

  return {
    startDate: startDateStr,
    endDate: endDateStr,
  };
};

describe('Notification Filters (no delegators)', () => {
  beforeEach(() => {
    // Cypress.on('uncaught:exception', (err, runnable) => {
    //   return false;
    // });
    cy.viewport(1920, 1080);
    cy.login();
    cy.visit(NOTIFICHE);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`).as('getNotifications');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}*`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}*`, { fixture: 'no-mandates-by-delegate.json' }).as(
      'getDelegators'
    );
    cy.intercept(`${NOTIFICATION_PAYMENT_INFO('*', '*')}*`).as('getPaymentInfo');

    // TODO: set the status during login to avoid keep doing this action
    // accept onetrust cookies
    cy.get('#onetrust-accept-btn-handler').click();
  });

  it('filtered dates should not change after visiting delegations page', () => {
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait(['@getNotifications']);

    cy.get(delegationMenuItem).click();

    cy.wait(['@getDelegates', '@getDelegators']);

    cy.get(notificationMenuItem).click();

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);
  });

  it('filtered dates should not change after visiting a notification detail', () => {
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait(['@getNotifications', '@getNotifications']);

    cy.get(notificationListItem).click();

    cy.get(notificationMenuItem).click();

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);
  });

  it('filtered dates should not change after visiting a notification detail and delegation list', () => {
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait(['@getNotifications', '@getNotifications']);

    cy.get(notificationListItem).click();

    cy.wait('@getPaymentInfo');

    cy.get(notificationMenuItem).click();

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);

    cy.get(delegationMenuItem).click();

    cy.wait(['@getDelegates', '@getDelegators']);

    cy.get(notificationMenuItem).click();

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

    cy.wait(['@getNotifications', '@getNotifications']);

    cy.get(delegationMenuItem).click();

    cy.get(notificationMenuItem).click();

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', '');
  });
});

describe('Notification Filters (delegators)', () => {
  beforeEach(() => {
    // Cypress.on('uncaught:exception', (err, runnable) => {
    //   return false;
    // });
    cy.viewport(1920, 1080);
    cy.login();
    cy.visit(NOTIFICHE);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`).as('getNotifications');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}*`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}*`, { fixture: 'mandates-by-delegate.json' }).as(
      'getDelegators'
    );
    
    // accept onetrust cookies
    cy.get('#onetrust-accept-btn-handler').click();
  });

  it('filters reset visiting notifications list as a delegate', () => {
    const { startDate, endDate } = getDates();

    cy.get(startDateInput, { timeout: 10000 }).type(startDate);
    cy.get(endDateInput).type(endDate);
    cy.contains(filterButton).click();

    cy.wait(['@getNotifications', '@getNotifications']);

    cy.get(startDateInput).should('have.value', startDate);
    cy.get(endDateInput).should('have.value', endDate);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}*`, {
      fixture: 'delegations-by-delegate.json',
    }).as('getNotificationsByDelegate');
    cy.get(collapsibleNotificationMenu).click();
    cy.get(notificationsByDelegateMenuItem).click();

    cy.wait('@getNotificationsByDelegate');

    cy.get(startDateInput).should('have.value', '');
    cy.get(endDateInput).should('have.value', '');
  });
});
