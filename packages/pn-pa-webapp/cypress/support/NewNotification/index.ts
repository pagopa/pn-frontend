import { PaymentMethodType, PreliminaryInfoFormData, RecipientFormData } from "../../global";

const getPaymentMethodIndex = (paymentType: PaymentMethodType): number => {
  switch (paymentType) {
    case 'pagoPA':
      return 0;
    case 'pagoPA_F24_FlatRate':
      return 1;
    case 'pagoPA_F24_Standard':
      return 2;
    default:
      return 3;
  }
}

Cypress.Commands.add('fillPreliminaryInfo', (data: PreliminaryInfoFormData) => {
  cy.get('#paProtocolNumber').type(data.paProtocolNumber);
  cy.get('#subject').type(data.subject);

  if(data.abstract) {
    cy.get('#abstract').type(data.abstract);
  }
  
  cy.get('#taxonomyCode').type(data.taxonomyCode);

  const communicationType = data.communicationType === 'A/R' ? 1 : 0;
  cy.get('[data-testid="comunicationTypeRadio"]').eq(communicationType).click();

  if(Cypress.env('IS_PAYMENT_ENABLED')) {
    const paymentMethodIndex = getPaymentMethodIndex(data.paymentMethod);
    cy.get('[data-testid="paymentMethodRadio"]').eq(paymentMethodIndex).click();
  }
});

Cypress.Commands.add('fillRecipient', (recipient: RecipientFormData) => {
  // Recipient 2
  cy.get(`input[name="recipients\[${recipient.position}\]\.firstName"]`).clear().type(recipient.data.firstname);
  cy.get(`input[name="recipients\[${recipient.position}\]\.lastName"]`).clear().type(recipient.data.lastname);

  cy.log('writing valid taxtId');
  cy.get(`input[name="recipients\[${recipient.position}\]\.taxId"]`).clear().type(recipient.data.taxId);
  
  if(recipient.data.creditorTaxId && Cypress.env('IS_PAYMENT_ENABLED')) {
    cy.log('writing valid creditor taxtId');
    cy.get(`input[name="recipients\[${recipient.position}\]\.creditorTaxId"]`).clear().type(recipient.data.creditorTaxId);
  }

  if(recipient.data.noticeCode && Cypress.env('IS_PAYMENT_ENABLED')) {
    cy.log('payment enabled', Cypress.env('IS_PAYMENT_ENABLED'));
    cy.log('writing valid notice code');
    cy.get(`input[name="recipients\[${recipient.position}\]\.noticeCode"]`).clear().type(recipient.data.noticeCode);
  }

  //Address
  cy.get('[data-testid="PhysicalAddressCheckbox"]').eq(recipient.position).click();
  
  cy.get('button[type="submit"]').should('be.disabled');
  
  cy.get(`input[name="recipients\[${recipient.position}\]\.address"]`).type(recipient.data.address);
  cy.get(`input[name="recipients\[${recipient.position}\]\.houseNumber"]`).type(recipient.data.houseNumber);
  cy.get(`input[name="recipients\[${recipient.position}\]\.municipality"]`).type(recipient.data.municipality);
  cy.get(`input[name="recipients\[${recipient.position}\]\.province"]`).type(recipient.data.province);
  cy.get(`input[name="recipients\[${recipient.position}\]\.zip"]`).type(recipient.data.zip);
  cy.get(`input[name="recipients\[${recipient.position}\]\.foreignState"]`).type(recipient.data.foreignState);
});