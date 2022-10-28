describe("Notifications", () => {
  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false;
    });
    cy.viewport(1920, 1080);
  });

  it.skip('Set filters to date range 01/09/2022 - 02/09/2022, view a notification detail, then go back e verify if filters are still enabled', () => {
    const startDate = '01/09/2022';
    const endDate = '02/09/2022';
    cy.logout();
    cy.login();
    cy.visit('/dashboard');
    cy.get('#startDate').type(startDate);
    cy.get('#endDate').type(endDate);
    cy.get('.MuiButton-outlined').click();
    cy.wait(3000);
    cy.get(':nth-child(1) > .css-pgy0cg-MuiTableCell-root').click();
    cy.wait(1000);
    cy.get('.css-6ezsbm-MuiStack-root > .MuiButton-root').click();
    cy.get('#startDate').should('have.value', startDate);
    cy.get('#endDate').should('have.value', endDate);
  });

  it('Create new notification', () => {
    const pdfTest1 = './cypress/fixtures/pdf_test_1.pdf';
    const pdfTest2 = './cypress/fixtures/pdf_test_2.pdf';
    const pdfTest3 = './cypress/fixtures/pdf_test_3.pdf';
    const pdfTest4 = './cypress/fixtures/pdf_test_4.pdf';

    cy.logout();
    cy.loginWithTokenExchange();

    cy.visit('/dashboard/nuova-notifica');

    // Fill step 1
    cy.get('#paProtocolNumber').type('Test new notification - Cypress');
    cy.get('#subject').type('Nuova Notifica');
    cy.get('[data-testid="comunicationTypeRadio"]').eq(0).click();
    cy.get('[data-testid="paymentMethodRadio"]').eq(1).click();
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Fill step 2
    cy.get('input[name="recipients\[0\]\.firstName"]').type('Nome');
    cy.get('input[name="recipients\[0\]\.lastName"]').type('Cognome');

    cy.log('writing invalid taxtId');
    cy.get('input[name="recipients\[0\]\.taxId"]').type('12345678901123').blur();

    cy.log('validation text error for taxId appears');
    cy.get('.css-1robk8y-MuiFormHelperText-root').should('be.visible');
    cy.wait(1000);

    cy.log('writing valid taxtId');
    cy.get('input[name="recipients\[0\]\.taxId"]').clear().type('WWWXXX99D09Z999A');

    cy.log('validation text error for taxId disappears');
    cy.get('.css-1robk8y-MuiFormHelperText-root').should('not.exist');

    cy.log('writing invalid creditor taxtId');
    cy.get('input[name="recipients\[0\]\.creditorTaxId"]').type('1231232131').blur();

    cy.log('validation text error for creditor taxId appears');
    cy.get('.css-1robk8y-MuiFormHelperText-root').should('be.visible');
    cy.wait(1000);

    cy.log('writing valid creditor taxtId');
    cy.get('input[name="recipients\[0\]\.creditorTaxId"]').clear().type('12312321315');

    cy.log('validation text error for creditor taxId disappears');
    cy.get('.css-1robk8y-MuiFormHelperText-root').should('not.exist');

    cy.log('writing invalid notice code');
    cy.get('input[name="recipients\[0\]\.noticeCode"]').type('12312312312312125').blur();

    cy.log('validation text error for notice code');
    cy.get('.css-1robk8y-MuiFormHelperText-root').should('be.visible');
    cy.wait(1000);

    cy.log('writing valid notice code');
    cy.get('input[name="recipients\[0\]\.noticeCode"]').clear().type('123123123123123125');

    cy.log('validation text error for notice code disappears');
    cy.get('.css-1robk8y-MuiFormHelperText-root').should('not.exist');

    cy.get('[data-testid="PhysicalAddressCheckbox"]').click();
    cy.get('input[name="recipients\[0\]\.address"]').type('Indirizzo');
    cy.get('input[name="recipients\[0\]\.houseNumber"]').type('3');
    cy.get('input[name="recipients\[0\]\.municipality"]').type('Milano');
    cy.get('input[name="recipients\[0\]\.province"]').type('MI');
    cy.get('input[name="recipients\[0\]\.zip"]').type('20100');
    cy.get('input[name="recipients\[0\]\.foreignState"]').type('Italia');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Fill step 3
    cy.get('.MuiPaper-root > :nth-child(2) > .MuiButton-root').click();
    cy.get('input[type="file"]').eq(0).selectFile(pdfTest1, { force: true });
    cy.get('input[type="file"]').eq(0).selectFile(pdfTest2, { force: true });
    cy.get('input[name="documents\.0\.name"]').type('pdf di Test 1');
    cy.get('input[name="documents\.1\.name"]').type('pdf di Test 2');
    cy.get('button[type="submit"]').should('not.be.disabled').click();

    // Fill step 4
    cy.get('input[type="file"]').eq(0).selectFile(pdfTest3, { force: true });
    cy.get('input[type="file"]').eq(0).selectFile(pdfTest4, { force: true });
    cy.get('button[type="submit"]').should('not.be.disabled');

  });

});