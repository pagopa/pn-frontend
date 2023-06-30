import { getNextDay, formatToSlicedISOString } from '@pagopa-pn/pn-commons';

import { DELEGHE } from '../../src/navigation/routes.const';
import { NOTIFICATION_PAYMENT_INFO } from '../../src/api/notifications/notifications.routes';
import {
  NOTIFICATION_DETAIL,
  NOTIFICATIONS_LIST,
} from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
  CREATE_DELEGATION,
  REVOKE_DELEGATION,
  REJECT_DELEGATION,
  ACCEPT_DELEGATION,
} from '../../src/api/delegations/delegations.routes';

import mockData from '../fixtures/delegations/test-data';

const tomorrow = getNextDay(new Date());
const formattedTomorrowSliced = formatToSlicedISOString(tomorrow);

describe('Delegation', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`, {
      fixture: 'delegations/mandates-by-delegator',
    }).as('getDelegators');

    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, {
      fixture: 'delegations/mandates-by-delegate',
    }).as('getDelegates');

    cy.stubConsents();
    cy.visit(DELEGHE);
  });

  describe('As delegate', () => {
    it("Should access delegator's notifications list and access one", () => {
      const iun = 'WYEJ-VDAL-XDHJ-202211-Q-1';

      cy.fixture('delegations/mandates-by-delegate').then((mandates) => {
        const mandateId = mandates[1].mandateId;

        cy.intercept('GET', `${NOTIFICATIONS_LIST({})}**mandateId=${mandateId}**`, {
          statusCode: 200,
          fixture: 'notifications/delegator/list-10/page-1',
        }).as('notificationsListAsDelegate');

        cy.intercept('GET', `${NOTIFICATION_DETAIL(iun, mandateId)}`, {
          statusCode: 200,
          fixture: 'notifications/delegator/detail',
        }).as('notificationDetailAsDelegate');

        cy.get('[data-testid="sideMenuItem-Notifiche"]').click();
        cy.get('[data-testid="collapsible-list"] > :nth-child(2)').click();

        cy.wait('@notificationsListAsDelegate').then((interception) => {
          expect(interception.request.url).include(`mandateId=${mandateId}`);
          expect(interception.response.statusCode).to.equal(200);
        });

        cy.get('[data-testid="table(notifications).row"]').should('have.length', 10);
        cy.contains(iun).click();

        cy.wait('@notificationDetailAsDelegate').then((interception) => {
          expect(interception.request.url).include(`mandateId=${mandateId}`);
          expect(interception.request.url).include(iun);
          expect(interception.response.statusCode).to.equal(200);
        });
      });
    });

    it("Should reject delegator's request", () => {
      cy.wait('@getDelegators');

      cy.get('[data-testid="sideMenuItem-Deleghe"]').contains(/1/).should('exist');
      cy.get(
        '[data-testid="delegators-wrapper"] [data-testid="table(notifications)"] > .MuiTableBody-root > :nth-child(1) [data-testid="delegationMenuIcon"]'
      ).click();
      cy.get('.MuiPaper-root > .MuiList-root > .MuiButtonBase-root').click();

      cy.intercept('PATCH', `${REJECT_DELEGATION('af02d543-c67e-4c64-8259-4f7ac12249fd')}`, {
        statusCode: 200,
      }).as('rejectDelegation');
      cy.get('[data-testid="dialogAction"]').eq(1).click();
      cy.wait('@rejectDelegation');

      cy.get('[data-testid="delegators-wrapper"]')
        .contains(/Giuseppe Maria Garibaldi/)
        .should('not.exist');
    });

    it("Should accept delegator's request", () => {
      cy.get('[data-testid="sideMenuItem-Deleghe"]').contains(/1/).should('exist');
      cy.wait('@getDelegators');
      cy.get('[data-testid="statusChip-Attiva"]').should('have.length', 1);
      cy.get('[data-testid="acceptButton"]').contains('Accetta').click();
      const verificationCode = '25622';
      verificationCode
        .split('')
        .forEach((code, i) =>
          cy.get(`:nth-child(${i + 1}) > .MuiInputBase-root > #code-input-${i}`).type(code)
        );
      cy.intercept('PATCH', `${ACCEPT_DELEGATION('af02d543-c67e-4c64-8259-4f7ac12249fd')}`, {
        statusCode: 204,
        fixture: 'delegations/accept-delegation-response',
      }).as('acceptDelegation');
      cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, {
        fixture: 'delegations/mandates-by-delegate-after-activation',
      }).as('getDelegatesAfterActivation');

      cy.get('[data-testid="codeConfirmButton"]').contains('Accetta').click();
      cy.wait('@acceptDelegation').its('request.body').should('deep.equal', {
        verificationCode: '25622',
      });
      cy.wait('@getDelegatesAfterActivation');
      cy.get('[data-testid="statusChip-Attiva"]').should('have.length', 2);
    });
  });

  describe('As delegator', () => {
    it('Should create new delegate', () => {
      cy.wait(['@getDelegates', '@getDelegators']);
      cy.get('[data-testid="loading-skeleton"]').should('not.exist');
      cy.get('[data-testid="add-delegation"]').click();

      const formDelegator = mockData.copy.newDelegation;

      cy.get('#nome').type(formDelegator.name);
      cy.get('#cognome').type(formDelegator.surname);
      cy.get('#codiceFiscale').type(formDelegator.fiscalCode);

      /*
        Comments below are regardings to check correct payload sending and needs reworks
      */

      const newDelegationRequest = mockData.requests.newDelegation;

      cy.intercept('POST', `${CREATE_DELEGATION()}`, {
        statusCode: 201,
      }).as('createDelegation');

      cy.get('[data-testid="createButton"]').click();

      cy.get('[data-testid="courtesy-page"]')
        .contains(/La tua richiesta di delega è stata creata con successo/)
        .should('exist');
      cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`, {
        fixture: 'delegations/mandates-by-delegator-after-new-delegation',
      }).as('getDelegatorsAfterNewDelegation');
      cy.visit(DELEGHE);
      cy.wait('@getDelegatorsAfterNewDelegation');
      cy.get('[data-testid="delegates-wrapper"]')
        .contains(/Cristoforo Colombo/)
        .should('exist');
      cy.get('[data-testid="delegates-wrapper"] [data-testid="table(notifications)"]').within(
        () => {
          cy.get('[data-testid^="statusChip"]')
            .eq(1)
            .contains(/In attesa di conferma/)
            .should('exist');
        }
      );
    });

    // TODO skip this test: in CI gives this error that needs some investigation - Carlotta Dimatteo 20/04/2023
    //     1) Delegation
    //        As delegator
    //          Shoud revoke a delegate:
    //      CypressError: Timed out retrying after 4050ms: `cy.click()` failed because this element is detached from the DOM.

    // `<button class="MuiButtonBase-root MuiIconButton-root MuiIconButton-sizeMedium css-1fcoux-MuiButtonBase-root-MuiIconButton-root" tabindex="0" type="button" data-testid="delegationMenuIcon" aria-label="Delegation Menu Icon">...</button>`

    // Cypress requires elements be attached in the DOM to interact with them.

    // The previous command that ran was:

    //   > `cy.get()`

    // This DOM element likely became detached somewhere between the previous and current command.
    it.skip('Shoud revoke a delegate', () => {
      cy.wait(['@getDelegators', '@getDelegates']);
      cy.get('[data-testid="sideMenuItem-Deleghe"]').contains(/1/).should('exist');

      cy.get('[data-testid="delegates-wrapper"]')
        .contains(/Gaio Giulio Cesare/)
        .should('exist');
      cy.intercept('PATCH', `${REVOKE_DELEGATION('6c969e5d-b3a0-4c11-a82a-3b8360d1436c')}`, {
        statusCode: 200,
      }).as('revokeDelegation');

      cy.get('[data-testid="delegates-wrapper"] [data-testid="delegationMenuIcon"]').click();
      cy.get('[data-testid="menuItem-revokeDelegate"]').click();
      cy.get('[data-testid="dialogAction"]').eq(1).click();
      cy.wait('@revokeDelegation');

      cy.get('[data-testid="delegates-wrapper"]')
        .contains(/Gaio Giulio Cesare/)
        .should('not.exist');
    });
  });
});
