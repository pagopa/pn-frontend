import { RECAPITI } from '../../src/navigation/routes.const';
import {
  CONTACTS_LIST,
  COURTESY_CONTACT,
  LEGAL_CONTACT,
} from '../../src/api/contacts/contacts.routes';
import { DELEGATIONS_BY_DELEGATE } from '../../src/api/delegations/delegations.routes';
import { GET_ALL_ACTIVATED_PARTIES } from '../../src/api/external-registries/external-registries-routes';
import { CourtesyChannelType, LegalChannelType } from '../../src/models/contacts';

import mockData from '../fixtures/contacts/test-data';

describe('Contacts', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, { fixture: 'delegations/no-mandates' }).as(
      'getActiveMandates'
    );

    cy.intercept(`${GET_ALL_ACTIVATED_PARTIES()}*`, {
      fixture: 'commons/activated-parties',
    }).as('getParties');

    cy.intercept(/TOS/, {
      statusCode: 200,
      fixture: 'tos/tos-accepted'
    });

    cy.login();
    cy.visit(RECAPITI);
  });

  it('Should add a valid PEC', () => {
    // mock contacts (empty list)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/no-contacts',
    }).as('getContacts');

    cy.intercept('POST', `${LEGAL_CONTACT('default', LegalChannelType.PEC)}`, {
      statusCode: 200,
      fixture: '',
    }).as('addPec');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    // verify copy
    cy.log('Verify copy');
    cy.contains(mockData.copy.pec.title);
    cy.contains(mockData.copy.pec.subtitle);

    cy.get('#pec').should('have.attr', 'placeholder', mockData.copy.pec.inputPlaceholder);

    cy.get('[data-testid="add contact"]')
      .should('contain', mockData.copy.pec.confirmButton)
      .should('be.disabled');

    cy.get('[data-testid="legal contact disclaimer"]').should(
      'contain',
      mockData.copy.pec.disclaimer
    );

    // enter an invalid address and verify the error message appears
    cy.log('enter an invalid address and verify the error message');

    cy.get('#pec').type(mockData.data.pec.invalid);
    cy.get('#pec-helper-text')
      .should('be.visible')
      .should('have.text', mockData.copy.pec.inputInvalidMessage);
    cy.get('[data-testid="add contact"]').should('be.disabled');

    // enter a valid address
    cy.log('enter a valid address');
    cy.get('#pec').clear().type(mockData.data.pec.valid);
    cy.get('#pec-helper-text').should('not.exist');
    cy.get('[data-testid="add contact"]').should('be.enabled');

    // confirm and verify code modal copy
    cy.get('[data-testid="add contact"]').click();

    cy.contains(mockData.copy.modal.title.replace('{{value}}', mockData.data.pec.valid));
    cy.contains(
      mockData.copy.modal.description.replace('{{value}}', mockData.copy.pec.modalDescriptionValue)
    );
    cy.contains(mockData.copy.modal.insertCode);
    cy.contains(mockData.copy.modal.help.replace('{{value}}', mockData.copy.pec.modalHelpValue));

    cy.get('[data-testid="code confirm button"]').should('be.disabled');
    cy.get('[data-testid="code cancel button"]').should('be.enabled');

    // insert an invalid code
    cy.intercept('POST', `${LEGAL_CONTACT('default', LegalChannelType.PEC)}`, {
      statusCode: 422,
      fixture: 'contacts/invalid-code-response',
    }).as('sendInvalidCode');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.invalid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    // verify the request is properly formatted
    cy.wait('@sendInvalidCode').its('request.body').should('deep.equal', {
      value: mockData.data.pec.valid,
      verificationCode: mockData.data.codes.invalid,
    });

    cy.get('[data-testid="errorAlert"]')
      .should('be.visible')
      .should('contain.text', mockData.copy.modal.errorTitle)
      .should('contain.text', mockData.copy.modal.errorMessage);

    // insert a valid code
    cy.intercept('POST', `${LEGAL_CONTACT('default', LegalChannelType.PEC)}`, {
      statusCode: 204,
      fixture: '',
    }).as('addPec');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.valid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    cy.wait('@addPec');
    cy.contains(mockData.copy.pec.successMessage);
    cy.contains('pec@cypress.pagopa.it');
  });

  it('Should enable/disable APPIO', () => {
    // mock contacts (IO not active)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/no-contacts',
    }).as('getContacts');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.contains(mockData.copy.io.title);
    cy.contains(mockData.copy.io.subtitle);

    cy.get('[data-testid="AppIO contact disclaimer"]').should(
      'contain',
      mockData.copy.io.disclaimer
    );

    // mock contacts (io active but disabled)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/contacts',
    }).as('getContacts');

    cy.get('[data-cy="menu-item(notifiche)"]').click();
    cy.get('[data-cy="menu-item(i tuoi recapiti)"]').click();

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    // enable io
    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.IOMSG)}`, {
      statusCode: 200,
      fixture: '',
    }).as('enableIO');

    cy.get('.PrivateSwitchBase-input').should('not.be.checked').click();

    // verify the request is properly formatted
    cy.wait('@enableIO').its('request.body').should('deep.equal', {
      value: mockData.data.io.value,
      verificationCode: mockData.data.io.code,
    });

    cy.get('.PrivateSwitchBase-input').should('be.checked');

    cy.intercept('DELETE', `${COURTESY_CONTACT('default', CourtesyChannelType.IOMSG)}`, {
      statusCode: 204,
      fixture: '',
    }).as('disableIO');

    cy.get('.PrivateSwitchBase-input').click();

    cy.wait('@disableIO');

    cy.get('.PrivateSwitchBase-input').should('not.be.checked');
  });

  it('Should add a valid email', () => {
    // mock contacts (empty list)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/no-contacts',
    }).as('getContacts');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    // verify copy
    cy.log('Verify copy');
    cy.contains(mockData.copy.courtesy.title);
    cy.contains(mockData.copy.courtesy.subtitle);

    cy.get('#email').should('have.attr', 'placeholder', mockData.copy.mail.inputPlaceholder);

    cy.get('[data-testid="add email"]')
      .should('contain', mockData.copy.mail.confirmButton)
      .should('be.disabled');

    cy.get('[data-testid="contacts disclaimer"]').should(
      'contain',
      mockData.copy.courtesy.disclaimer
    );

    // enter an invalid address and verify the error message appears
    cy.log('enter an invalid address and verify the error message');

    cy.get('#email').type(mockData.data.mail.invalid);
    cy.get('#email-helper-text')
      .should('be.visible')
      .should('have.text', mockData.copy.mail.inputInvalidMessage);
    cy.get('[data-testid="add email"]').should('be.disabled');

    // enter a valid address
    cy.log('enter a valid address');
    cy.get('#email').clear().type(mockData.data.mail.valid);
    cy.get('#email-helper-text').should('not.exist');
    cy.get('[data-testid="add email"]').should('be.enabled');

    // confirm and verify code modal copy
    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.EMAIL)}`, {
      statusCode: 200,
      fixture: '',
    }).as('addEmail');
    cy.get('[data-testid="add email"]').click();

    cy.wait('@addEmail');

    cy.contains(mockData.copy.modal.title.replace('{{value}}', mockData.data.mail.valid));
    cy.contains(
      mockData.copy.modal.description.replace('{{value}}', mockData.copy.mail.modalDescriptionValue)
    );
    cy.contains(mockData.copy.modal.insertCode);
    cy.contains(mockData.copy.modal.help.replace('{{value}}', mockData.copy.mail.modalHelpValue));

    cy.get('[data-testid="code confirm button"]').should('be.disabled');
    cy.get('[data-testid="code cancel button"]').should('be.enabled');

    // insert an invalid code
    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.EMAIL)}`, {
      statusCode: 422,
      fixture: 'contacts/invalid-code-response',
    }).as('sendInvalidCode');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.invalid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    // verify the request is properly formatted
    cy.wait('@sendInvalidCode').its('request.body').should('deep.equal', {
      value: mockData.data.mail.valid,
      verificationCode: mockData.data.codes.invalid,
    });

    cy.get('[data-testid="errorAlert"]').should('be.visible');

    // insert a valid code
    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.EMAIL)}`, {
      statusCode: 204,
      fixture: '',
    }).as('addEmail');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.valid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    cy.wait('@addEmail');
    cy.contains(mockData.copy.mail.successMessage);
    cy.contains(mockData.data.mail.valid);
  });

  it('Should add a valid phone number', () => {
    // mock contacts (empty list)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/no-contacts',
    }).as('getContacts');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    // Generic Component text has already been verified during email test

    cy.get('#phone').should('have.attr', 'placeholder', mockData.copy.phone.inputPlaceholder);

    cy.get('[data-testid="add phone"]')
      .should('contain', mockData.copy.phone.confirmButton)
      .should('be.disabled');

    // enter an invalid number and verify the error message appears
    cy.log('enter an invalid phone number and verify the error message');

    cy.get('#phone').type(mockData.data.phone.invalid);
    cy.get('#phone-helper-text')
      .should('be.visible')
      .should('have.text', mockData.copy.phone.inputInvalidMessage);
    cy.get('[data-testid="add email"]').should('be.disabled');

    // enter a valid phone number
    cy.log('enter a valid address');
    cy.get('#phone').clear().type(mockData.data.phone.valid);
    cy.get('#phone-helper-text').should('not.exist');
    cy.get('[data-testid="add phone"]').should('be.enabled');

    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.SMS)}`, {
      statusCode: 200,
      fixture: '',
    }).as('addPhone');
    cy.get('[data-testid="add phone"]').click();

    cy.wait('@addPhone');

    cy.contains(
      mockData.copy.modal.title.replace('{{value}}', mockData.data.phone.validWithIntPrefix)
    );
    cy.contains(
      mockData.copy.modal.description.replace(
        '{{value}}',
        mockData.copy.phone.modalDescriptionValue
      )
    );
    cy.contains('Inserisci codice');
    cy.contains(mockData.copy.modal.help.replace('{{value}}', mockData.copy.phone.modalHelpValue));

    cy.get('[data-testid="code confirm button"]').should('be.disabled');
    cy.get('[data-testid="code cancel button"]').should('be.enabled');

    // insert an invalid code
    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.SMS)}`, {
      statusCode: 422,
      fixture: 'contacts/invalid-code-response',
    }).as('sendInvalidCode');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.invalid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    // verify the request is properly formatted
    cy.wait('@sendInvalidCode').its('request.body').should('deep.equal', {
      value: mockData.data.phone.validWithIntPrefix,
      verificationCode: mockData.data.codes.invalid,
    });

    cy.get('[data-testid="errorAlert"]').should('be.visible');

    // insert a valid code
    cy.intercept('POST', `${COURTESY_CONTACT('default', CourtesyChannelType.SMS)}`, {
      statusCode: 204,
      fixture: '',
    }).as('addPhone');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.valid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    cy.wait('@addPhone');
    cy.contains(mockData.copy.phone.successMessage);
    cy.contains(mockData.data.phone.validWithIntPrefix);
  });

  it('Should add additional contact', () => {
    // mock contacts

    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/contacts',
    }).as('getContacts');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');
    cy.get('[data-testid="loading-spinner"] > .MuiBox-root').should('not.exist');

    // verify copy
    cy.log('Verify copy');
    cy.contains(mockData.copy.additional.title);
    cy.contains(mockData.copy.additional.subtitle);

    cy.contains(mockData.copy.additional.senderPlaceholder);
    cy.contains(mockData.copy.additional.addrTypePlaceholder);
    cy.contains(mockData.copy.additional.pecPlaceholder);
    cy.get('[data-testid="Special contact add button"]').should('be.disabled');

    cy.get('#sender').click();
    cy.get(`[data-value="${mockData.data.additional.sender}"]`).click();
    cy.get('#addressType').click();
    cy.get('[data-value="EMAIL"]').click();
    cy.contains(mockData.copy.additional.mailPlaceholder);

    cy.get('#addressType').click();
    cy.get('[data-value="PEC"]').click();

    // enter an invalid pec and verify the error message
    cy.get('#s_pec').type(mockData.data.additional.invalidPec);
    cy.get('#s_pec-helper-text')
      .should('be.visible')
      .should('have.text', mockData.copy.additional.invalidPecMessage);

    cy.get('[data-testid="Special contact add button"]').should('be.disabled');

    // enter a valid pec and confirm
    cy.get('#s_pec').clear().type(mockData.data.additional.validPec);

    cy.intercept(
      'POST',
      `${LEGAL_CONTACT(mockData.data.additional.sender, LegalChannelType.PEC)}`,
      {
        statusCode: 200,
        fixture: '',
      }
    ).as('addPec');

    cy.get('[data-testid="Special contact add button"]').should('be.enabled').click();

    cy.get('[data-testid="code confirm button"]').should('be.disabled');
    cy.get('[data-testid="code cancel button"]').should('be.enabled');

    // insert an invalid code
    cy.intercept(
      'POST',
      `${LEGAL_CONTACT(mockData.data.additional.sender, LegalChannelType.PEC)}`,
      {
        statusCode: 422,
        fixture: 'contacts/invalid-code-response',
      }
    ).as('sendInvalidCode');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.invalid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    // verify the request is properly formatted
    cy.wait('@sendInvalidCode').its('request.body').should('deep.equal', {
      value: mockData.data.additional.validPec,
      verificationCode: mockData.data.codes.invalid,
    });

    cy.get('[data-testid="errorAlert"]').should('be.visible');

    // insert a valid code
    cy.intercept(
      'POST',
      `${LEGAL_CONTACT(mockData.data.additional.sender, LegalChannelType.PEC)}`,
      {
        statusCode: 204,
        fixture: '',
      }
    ).as('addPec');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.valid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    // verify the successful toast and the new address are shown
    cy.wait('@addPec');
    cy.contains(mockData.copy.additional.successPecMessage);
    cy.contains(mockData.data.additional.validPec);

    // adding a phone number to special contacts
    cy.get('#addressType').click();
    cy.get('[data-value="SMS"]').click();

    // enter an invalid phone number and verify the error message
    cy.get('#s_phone').type(mockData.data.additional.invalidPhone, { delay: 100 });
    cy.get('#s_phone-helper-text')
      .should('be.visible')
      .should('have.text', mockData.copy.additional.invalidPhoneMessage);

    cy.get('[data-testid="Special contact add button"]').should('be.disabled');

    // // enter a valid phone number and confirm
    cy.get('#s_phone').clear().type(mockData.data.additional.validPhone);

    cy.intercept(
      'POST',
      `${COURTESY_CONTACT(mockData.data.additional.sender, CourtesyChannelType.SMS)}`,
      {
        statusCode: 200,
        fixture: '',
      }
    ).as('addPhone');

    /**
     * <WORKAROUND>
     * change sender in order to avoid a bug just spotted in the following process:
     * 1) select the sender, the contact type, type in the contact and confirm
     * 2) try to add another contact changing the type and value
     *
     * the "invalid input" error message goes away when the input is correct, but
     * the submit button is not enabled without changing the sender
     *  */
    cy.get('#sender').click();
    cy.get(`[data-value="${mockData.data.additional.sender2}"]`).click();
    cy.get('#sender').click();
    cy.get(`[data-value="${mockData.data.additional.sender}"]`).click();
    /**
     * </WORKAROUND>
     */

    cy.get('[data-testid="Special contact add button"]').should('be.enabled').click();

    cy.get('[data-testid="code confirm button"]').should('be.disabled');
    cy.get('[data-testid="code cancel button"]').should('be.enabled');

    // insert an invalid code
    cy.intercept(
      'POST',
      `${COURTESY_CONTACT(mockData.data.additional.sender, CourtesyChannelType.SMS)}`,
      {
        statusCode: 422,
        fixture: 'contacts/invalid-code-response',
      }
    ).as('sendInvalidCode');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.invalid, { delay: 100 });

    cy.get('[data-testid="code confirm button"]').click();

    // verify the request is properly formatted
    cy.wait('@sendInvalidCode').its('request.body').should('deep.equal', {
      value: mockData.data.additional.validPhoneWithIntPrefix,
      verificationCode: mockData.data.codes.invalid,
    });

    cy.get('[data-testid="errorAlert"]').should('be.visible');

    // insert a valid code
    cy.intercept(
      'POST',
      `${COURTESY_CONTACT(mockData.data.additional.sender, CourtesyChannelType.SMS)}`,
      {
        statusCode: 204,
        fixture: '',
      }
    ).as('addPhone');

    cy.get('[data-testid="code input (0)"]').type(mockData.data.codes.valid, { delay: 100 });
    cy.get('[data-testid="code confirm button"]').click();

    cy.wait('@addPhone');
    cy.contains(mockData.copy.additional.successPhoneMessage);
    cy.contains(mockData.data.additional.validPhoneWithIntPrefix);
  });
});
