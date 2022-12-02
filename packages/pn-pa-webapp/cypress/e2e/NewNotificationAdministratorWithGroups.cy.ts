import { cesare } from '../fixtures/recipients/recipients';
import {CREATE_NOTIFICATION} from '../../src/api/notifications/notifications.routes';
import { PNRole } from '../../src/models/user';
describe("Notifications New Notification", () => {
  const pdfTest1 = './cypress/fixtures/attachments/pdf_test_1.pdf';
  const pdfTest2 = './cypress/fixtures/attachments/pdf_test_2.pdf';

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    cy.logout();
    cy.loginWithTokenExchange(PNRole.ADMIN);    

    // intercepts send notification request stubbing its successful response
    cy.intercept('POST', CREATE_NOTIFICATION(), {
      statusCode: 202,
      body: {
        notificationRequestId: 'S0FOQS1VV1JBLUFLSkUtMjAyMjExLVAtMQ==',
        paProtocolNumber: 'prot-12555514'
      },
    }).as('saveNewNotification');
    
    cy.intercept('/delivery/attachments/preload').as('preloadAttachments');
    
    cy.visit('/dashboard/nuova-notifica');
  });

  it.only('Create new notification with groups and administrator role', () => {

    cy.intercept(/groups/, { fixture: 'groups/groups' });
    
    // Fill step 1
    cy.fillPreliminaryInfo({
      paProtocolNumber: 'prot-123456789',
      subject: 'Cypress Test - Create new notification',
      abstract: 'Testing as administrator and with user groups',
      taxonomyCode: '012345X',
      communicationType: 'Model_890',
      paymentMethod: 'pagoPA'
    });

    // The following validation need to be resolved with PN-2198
    // cy.get('button[type="submit"]').should('be.disabled')

    cy.get('#group').click();
    cy.get('.MuiMenuItem-root').click();

    cy.get('button[type="submit"]').should('be.enabled').click();

    cy.fillRecipient({
      position: 0,
      data: {
        ...cesare,
        creditorTaxId: '77777777777',
        noticeCode: '302001869076319100',
      }
    });
    
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    
    // Fill step 3
    cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
    cy.get('input[name="documents\.0\.name"]').type('pdf di Test 1');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

    // Fill step 4
    cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@saveNewNotification');

    cy.contains('La notifica è stata correttamente creata');
  });
});