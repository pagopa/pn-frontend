import { NOTIFICHE } from '../../src/navigation/routes.const';
import { NOTIFICATIONS_LIST } from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
} from '../../src/api/delegations/delegations.routes';

describe('Pagination', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    // cy.intercept('GET', /delivery\/notifications\/sent/, {

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}**size=10`, {
      fixture: 'notifications/list-10/page-1',
    }).as('getNotifications');
    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`).as('getDelegates');
    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, { fixture: 'delegations/no-mandates' }).as(
      'getDelegators'
    );

    cy.login();
    cy.visit(NOTIFICHE);
  });

  it('should change the number of results per page', () => {
    cy.intercept('GET', `${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}**size=20`, {
      statusCode: 200,
      fixture: 'notifications/list-20/page-1',
    }).as('notifications_2');

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 10);

    cy.get('.MuiButton-endIcon > [data-testid="ArrowDropDownIcon"]').click();
    cy.get('.MuiPaper-root > .MuiList-root > :nth-child(2)').click();

    cy.wait('@notifications_2').then((interception) => {
      expect(interception.request.url).include('size=20');
      expect(interception.response.statusCode).to.equal(200);
    });

    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    cy.get('[data-testid="itemsPerPageSelector"] > .MuiButton-root').should('have.text', '20');

    cy.get('[data-testid="table(notifications).row"]').should('have.length', 20);
  });

  it('Should change current page', () => {
    cy.intercept('GET', `${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}**nextPagesKey=11111111111111111111`, {
      statusCode: 200,
      fixture: 'notifications/list-10/page-2',
    }).as('notifications_2');

    cy.get('.MuiPagination-ul > :nth-child(1) button').should('be.disabled');
    cy.get('.MuiPagination-ul > :nth-child(3) > .MuiButtonBase-root').click();

    cy.wait('@notifications_2').then((interception) => {
      expect(interception.request.url).include('nextPagesKey=11111111111111111111');
      expect(interception.response.statusCode).to.equal(200);
    });
  });
});
