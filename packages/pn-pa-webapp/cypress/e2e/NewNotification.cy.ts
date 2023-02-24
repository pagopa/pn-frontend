import { cesare, garibaldi } from '../fixtures/recipients';
// import {NUOVA_NOTIFICA} from '../../src/navigation/routes.const';
import { CREATE_NOTIFICATION } from '../../src/api/notifications/notifications.routes';
import { PNRole } from '../../src/models/user';

describe('New Notification', () => {
  const pdfTest1 = './cypress/fixtures/attachments/pdf_test_1.pdf';
  const pdfTest2 = './cypress/fixtures/attachments/pdf_test_2.pdf';
  const pdfTest3 = './cypress/fixtures/attachments/pdf_test_3.pdf';
  const pdfTest4 = './cypress/fixtures/attachments/pdf_test_4.pdf';

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);

    // intercepts send notification request stubbing its successful response
    cy.intercept('POST', CREATE_NOTIFICATION(), {
      statusCode: 202,
      body: {
        notificationRequestId: 'S0FOQS1VV1JBLUFLSkUtMjAyMjExLVAtMQ==',
        paProtocolNumber: 'prot-12555514',
      },
    }).as('saveNewNotification');

    cy.intercept('/delivery/attachments/preload').as('preloadAttachments');
  });

  describe('Single/multi recipients', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginWithTokenExchange();
      cy.intercept(/TOS/, {
        statusCode: 200,
        fixture: 'tos/tos-accepted'
      });
      cy.intercept(/groups/, { fixture: 'groups/no-groups' });
      cy.visit('/dashboard/nuova-notifica');
    });

    it('Creates a single recipient notification with a payment document', () => {
      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing single recipient with a payment document',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.fillRecipient({
        position: 0,
        data: {
          ...cesare,
          creditorTaxId: '77777777777',
          noticeCode: '302001869076319100',
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a single recipient notification without any payment document', () => {
      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing single recipient without payment document',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 2
      cy.fillRecipient({
        position: 0,
        data: cesare,
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.contains(/^Invia$/).click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a single recipient notification with payment document selected but without uploading it', () => {
      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing single recipient without payment document',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 2
      cy.fillRecipient({
        position: 0,
        data: {
          ...cesare,
          creditorTaxId: '77777777777',
          noticeCode: '302001869076319100',
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.contains(/^Invia$/).click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a multi recipients notification with payment documents', () => {
      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing multi recipient with payment documents',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 2

      // Recipient 1
      cy.fillRecipient({
        position: 0,
        data: {
          ...cesare,
          creditorTaxId: '77777777777',
          noticeCode: '302001869076319100',
        },
      });

      cy.contains(/^Aggiungi un destinatario$/).click();

      // Recipient 2
      cy.fillRecipient({
        position: 1,
        data: {
          ...garibaldi,
          creditorTaxId: '77777777777',
          noticeCode: '302001869076319101',
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest3, { force: true });
      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a multi recipients notification without payment documents', () => {
      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing multi recipient without payment documents',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 2

      // Recipient 1
      cy.fillRecipient({
        position: 0,
        data: cesare,
      });

      cy.contains(/^Aggiungi un destinatario$/).click();

      // Recipient 2
      cy.fillRecipient({
        position: 1,
        data: garibaldi,
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.get('button[type="submit"]').should('be.disabled');

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.contains(/^Invia$/).click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a notification and verify recipient form inputs validity', () => {
      // Fill step 1
      cy.get('#paProtocolNumber').type('Test new notification - Cypress');
      cy.get('#subject').type('Nuova Notifica');
      cy.get('#taxonomyCode').type('012345X');
      cy.get('[data-testid="comunicationTypeRadio"]').eq(0).click();
      cy.get('[data-testid="paymentMethodRadio"]').eq(1).click();
      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 2
      cy.get('input[name="recipients[0].firstName"]').type('Nome');
      cy.get('input[name="recipients[0].lastName"]').type('Cognome');

      cy.log('writing invalid taxtId');
      cy.get('input[name="recipients[0].taxId"]').type('12345678901123').blur();

      cy.log('validation text error for taxId appears');
      cy.get('.css-1robk8y-MuiFormHelperText-root').should('be.visible');

      cy.log('writing valid taxtId');
      cy.get('input[name="recipients[0].taxId"]').clear().type('WWWXXX99D09Z999A');

      cy.log('validation text error for taxId disappears');
      cy.get('.css-1robk8y-MuiFormHelperText-root').should('not.exist');

      cy.log('writing invalid creditor taxtId');
      cy.get('input[name="recipients[0].creditorTaxId"]').type('1231232131').blur();

      cy.log('validation text error for creditor taxId appears');
      cy.get('.css-1robk8y-MuiFormHelperText-root').should('be.visible');

      cy.log('writing valid creditor taxtId');
      cy.get('input[name="recipients[0].creditorTaxId"]').clear().type('12312321315');

      cy.log('validation text error for creditor taxId disappears');
      cy.get('.css-1robk8y-MuiFormHelperText-root').should('not.exist');

      cy.log('writing invalid notice code');
      cy.get('input[name="recipients[0].noticeCode"]').type('12312312312312125').blur();

      cy.log('validation text error for notice code');
      cy.get('.css-1robk8y-MuiFormHelperText-root').should('be.visible');

      cy.log('writing valid notice code');
      cy.get('input[name="recipients[0].noticeCode"]').clear().type('123123123123123125');

      cy.log('validation text error for notice code disappears');
      cy.get('.css-1robk8y-MuiFormHelperText-root').should('not.exist');

      cy.get('[data-testid="PhysicalAddressCheckbox"]').click();
      cy.get('input[name="recipients[0].address"]').type('Indirizzo');
      cy.get('input[name="recipients[0].houseNumber"]').type('3');
      cy.get('input[name="recipients[0].municipality"]').type('Milano');
      cy.get('input[name="recipients[0].province"]').type('MI');
      cy.get('input[name="recipients[0].zip"]').type('20100');
      cy.get('input[name="recipients[0].foreignState"]').type('Italia');
      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('[data-testid="AddIcon"]').click();
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('input[name="documents.1.name"]').type('pdf di Test 2');
      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest3, { force: true });
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest4, { force: true });

      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });
  });

  describe('Administrator role', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginWithTokenExchange(PNRole.ADMIN);
      cy.visit('/dashboard/nuova-notifica');
    });

    it('Creates a new notification when no user group is available', () => {
      cy.intercept(/groups/, { fixture: 'groups/no-groups' });

      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing as administrator and without user groups',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
      });

      cy.get('#group').should('be.disabled');

      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.fillRecipient({
        position: 0,
        data: {
          ...cesare,
          creditorTaxId: '77777777777',
          noticeCode: '302001869076319100',
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a new notification when a user group is available', () => {
      cy.intercept(/groups/, { fixture: 'groups/groups' });

      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing as administrator and with user groups',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
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
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });
  });

  describe('Operator role', () => {
    beforeEach(() => {
      cy.logout();
      cy.loginWithTokenExchange(PNRole.OPERATOR);
      cy.visit('/dashboard/nuova-notifica');
    });

    it('Creates a new notification when no user group is available', () => {
      cy.intercept(/groups/, { fixture: 'groups/no-groups' });

      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing as operator and without user groups',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
      });

      cy.get('#group').should('be.disabled');

      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.fillRecipient({
        position: 0,
        data: {
          ...cesare,
          creditorTaxId: '77777777777',
          noticeCode: '302001869076319100',
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });

    it('Creates a new notification when a user group is available', () => {
      cy.intercept(/groups/, { fixture: 'groups/groups' });

      // Fill step 1
      cy.fillPreliminaryInfo({
        paProtocolNumber: 'prot-123456789',
        subject: 'Cypress Test - Create new notification',
        abstract: 'Testing as operator and with user groups',
        taxonomyCode: '012345X',
        communicationType: 'Model_890',
        paymentMethod: 'pagoPA',
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
        },
      });

      cy.get('button[type="submit"]').should('be.enabled').click();

      // Fill step 3
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
      cy.get('input[name="documents.0.name"]').type('pdf di Test 1');
      cy.get('button[type="submit"]').should('be.enabled').click();

      cy.wait('@preloadAttachments').its('response.statusCode').should('eq', 200);

      // Fill step 4
      cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
      cy.get('button[type="submit"]').click();

      cy.wait('@saveNewNotification');

      cy.contains('La notifica è stata correttamente creata');
    });
  });
});
