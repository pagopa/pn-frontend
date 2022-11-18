
import { NotificationStatus } from '@pagopa-pn/pn-commons';

const notification = {
  taxIds: [
    'CLMCST42R12D969Z',
    'FRMTTR76M06B715E'
  ],
  iun: 'UAXE-PUWR-LDZX-202211-N-1',
  status: NotificationStatus.UNREACHABLE,
  legalFactId: 'PN_LEGAL_FACTS-0002-F6JE-7WPR-9Y92-OG95'
}

describe("Notification Detail", () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    cy.intercept('GET', /delivery\/notifications\/sent/, {
      statusCode: 200,
      fixture: 'notifications/list-10_page-1.json'
    }).as('notifications');

    cy.logout();
    cy.loginWithTokenExchange();
    cy.visit('/dashboard');
  });

  it('Downloads Legal fact', () => {
    cy.intercept('GET', `delivery/notifications/sent/${notification.iun}`, {
      statusCode: 200,
      fixture: 'notifications/notification-3.json'
    }).as('selectedNotification');

    
    cy.intercept('GET', `delivery-push/${notification.iun}/legal-facts/SENDER_ACK/${notification.legalFactId}`, {
      statusCode: 200,
      fixture: 'legalFacts/OG95.pdf'
    }).as('downloadLegalFact');

    cy.contains(notification.iun).click();

    cy.wait('@selectedNotification');

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.contains(/^Attestazione opponibile a terzi\b/).click();

    cy.wait('@downloadLegalFact').then((interception) => {
      expect(interception.request.url).include(notification.legalFactId);
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});