import { NOTIFICHE, DELEGHE } from '../../src/navigation/routes.const';
import { NOTIFICATION_PAYMENT_INFO } from '../../src/api/notifications/notifications.routes';
import { NOTIFICATION_DETAIL, NOTIFICATIONS_LIST } from '../../src/api/notifications/notifications.routes';
import {
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_BY_DELEGATE,
  CREATE_DELEGATION,
  REOVKE_DELEGATION,
  REJECT_DELEGATION,
  ACCEPT_DELEGATION,
} from '../../src/api/delegations/delegations.routes';

import mockData from '../fixtures/delegations/test-data';
import { getNextDay, formatToSlicedISOString } from '../../../pn-commons/src/utils/date.utility';

const tomorrow = getNextDay( new Date() );
const formattedTomorrowSliced = formatToSlicedISOString(tomorrow);

describe('Delegation', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${NOTIFICATIONS_LIST({ startDate: '', endDate: '' })}**size=10`, {
      fixture: 'notifications/list-10/page-1',
    }).as('getNotifications');

    cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`, {
      fixture: 'delegations/mandates-by-delegator',
    }).as('getDelegators');

    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, {
      fixture: 'delegations/mandates-by-delegate',
    }).as('getDelegates');

    cy.intercept(`${NOTIFICATION_PAYMENT_INFO('', '')}/**`, { fixture: 'payments/required'}).as('getPaymentInfo');
    
    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-accepted'
    });

    cy.login();
    cy.visit(NOTIFICHE);
  });

  describe('As delegate', () => {
    it('Should access delegator\'s notifications list and access one', () => {
      const iun = 'WYEJ-VDAL-XDHJ-202211-Q-1';

      cy.wait('@getNotifications');

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
        
        cy.get('[data-cy="collapsible-list"] > :nth-child(2)').click();

        cy.wait('@notificationsListAsDelegate').then((interception) => {
          expect(interception.request.url).include(`mandateId=${mandateId}`);
          expect(interception.response.statusCode).to.equal(200);
        });

        // cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');
        cy.get('[data-cy="table(notifications).row"]').should('have.length', 10);
        cy.contains(iun).click();
        
        // cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');
        cy.wait('@notificationDetailAsDelegate').then((interception) => {
          expect(interception.request.url).include(`mandateId=${mandateId}`);
          expect(interception.request.url).include(iun);
          expect(interception.response.statusCode).to.equal(200);
        });
      });
    });

    it('Should reject delegator\'s request', () => {
      cy.get('[data-testid="menu-list"] > :nth-child(4) > .MuiBox-root').contains(/1/).should('exist');
      cy.visit(DELEGHE);
      cy.wait('@getDelegators');
      cy.get('[data-testid="delegators-wrapper"] [data-cy="table(notifications)"] > .MuiTableBody-root > :nth-child(1) [data-testid="delegationMenuIcon"]').click();
      cy.get('.MuiPaper-root > .MuiList-root > .MuiButtonBase-root').click();
      cy.intercept('PATCH', `${REJECT_DELEGATION('af02d543-c67e-4c64-8259-4f7ac12249fd')}`, {
        statusCode: 200
      }).as('rejectDelegation');
      cy.get('.css-pj2eij-MuiGrid-root > [data-testid="dialogAction"]').click();
      cy.wait('@rejectDelegation');
      cy.get('[data-testid="delegators-wrapper"]').contains(/Giuseppe Maria Garibaldi/).should('not.exist');
    });

    it('Should accept delegator\s request', () => {
      cy.get('[data-testid="menu-list"] > :nth-child(4) > .MuiBox-root').contains(/1/).should('exist');
      cy.visit(DELEGHE);
      cy.wait('@getDelegators');
      cy.get('.MuiTableCell-alignCenter > .MuiButtonBase-root').click();
      const verificationCode = '25622';
      verificationCode.split('').forEach((code, i) =>
        cy.get(`:nth-child(${i + 1}) > .MuiInputBase-root > #outlined-basic`).type(code)
      );
      cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, {
        fixture: 'delegations/mandates-by-delegate-after-activation',
      }).as('getDelegatesAfterActivation');
      cy.intercept('PATCH',`${ACCEPT_DELEGATION('af02d543-c67e-4c64-8259-4f7ac12249fd')}`, {
        statusCode: 204,
        fixture: 'delegations/accept-delegation-response'
      }).as('acceptDelegation');
      cy.get('.MuiDialogActions-root > .MuiButton-contained').click();
      cy.wait('@acceptDelegation').its('request.body').should('deep.equal', {
        verificationCode: '25622'
      });
      cy.wait('@getDelegatesAfterActivation')
      cy.get(':nth-child(2) > .MuiTableCell-alignCenter > .MuiChip-root > .MuiChip-label').contains(/Attiva/).should('exist');
    });
  });

  describe('As delegator', () => {
    it('Should create new delegate', () => {
      cy.intercept(DELEGHE).as('getDeleghePage');
      cy.visit(DELEGHE);
      cy.wait(['@getDeleghePage', '@getDelegates', '@getDelegators']);
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
        // body: {
        //   ...newDelegationRequest,
        //   expirationDate: tomorrow,
        // }
      }).as('createDelegation');

      cy.get('[data-testid="createButton"]').click();

      /*

      const payload = mockData.payloads.newDelegation;
      cy.wait('@createDelegation').its('request.body').should('deep.equal', {
        ...payload,
        dateto: formattedTomorrowSliced
      });

      */

      cy.get('[data-testid="courtesy-page"]').contains(/La tua richiesta di delega è stata creata con successo/).should('exist');
      cy.intercept(`${DELEGATIONS_BY_DELEGATOR()}`, {
        fixture: 'delegations/mandates-by-delegator-after-new-delegation',
      }).as('getDelegatorsAfterNewDelegation');
      cy.visit(DELEGHE);
      cy.wait('@getDelegatorsAfterNewDelegation');
      cy.get('[data-testid="delegates-wrapper"]').contains(/Cristoforo Colombo/).should('exist');
      cy.get('[data-testid="delegates-wrapper"] [data-cy="table(notifications)"] > .MuiTableBody-root > :nth-child(2) .MuiChip-label').contains(/In attesa di conferma/).should('exist');
    });

    it('Shoud revoke a delegate', () => {
      cy.visit(DELEGHE);
      cy.wait('@getDelegators');
      cy.intercept('PATCH', `${REOVKE_DELEGATION('6c969e5d-b3a0-4c11-a82a-3b8360d1436c')}`, {
        statusCode: 200
      }).as('revokeDelegation');
      cy.get('[data-testid="delegates-wrapper"] [data-testid="delegationMenuIcon"]').click();
      cy.get('.MuiList-root > [tabindex="-1"]').click();
      cy.get('.css-pj2eij-MuiGrid-root > [data-testid="dialogAction"]').click();
      cy.get('[data-testid="delegates-wrapper"]').contains(/Ettore Fieramosca/).should('not.exist');
    });
  });
});
