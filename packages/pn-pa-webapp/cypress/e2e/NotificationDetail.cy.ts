import { NotificationStatus } from '@pagopa-pn/pn-commons';

const notifications = [
  {
    iun: 'RLRP-KDKT-WQYK-202211-Y-1',
    status: NotificationStatus.EFFECTIVE_DATE,
    legalFactId: 'PN_LEGAL_FACTS-0002-V547-0WE5-TKNE-OK0D'
  }
];

describe("Notification Detail", () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10/page-1'
    }).as('notifications');

    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-accepted'
    });

    cy.logout();
    cy.loginWithTokenExchange();
    cy.visit('/dashboard');
  });

  it('Downloads Legal fact', () => {
    cy.intercept('GET', `delivery/notifications/sent/${notifications[0].iun}`, {
      statusCode: 200,
      fixture: 'notifications/effective_date'
    }).as('selectedNotification');

    cy.intercept('GET', `/delivery-push/${notifications[0].iun}/legal-facts/**`, {
      statusCode: 200,
      fixture: 'legalFacts/OG95.pdf'
    }).as('downloadLegalFact');

    cy.contains(notifications[0].iun).click();

    cy.wait('@selectedNotification');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains(/^Attestazione opponibile a terzi\b/).click();

    cy.wait('@downloadLegalFact').then((interception) => {
      expect(interception.request.url).include(notifications[0].legalFactId);
      expect(interception.response.statusCode).to.equal(200);
    });
  });

  it(`Show notification status as '${notifications[0].status}'`, () => {
    cy.intercept('GET', `delivery/notifications/sent/${notifications[0].iun}`, {
      statusCode: 200,
      fixture: 'notifications/effective_date'
    }).as('selectedNotification');

    cy.contains(`${notifications[0].iun}`).click();

    cy.contains('Perfezionata per decorrenza termini');
  });
});