import { RECAPITI } from '../../src/navigation/routes.const';
import {
  CONTACTS_LIST,
  COURTESY_CONTACT,
  LEGAL_CONTACT,
} from '../../src/api/contacts/contacts.routes';
import { DELEGATIONS_BY_DELEGATE } from '../../src/api/delegations/delegations.routes';
import { CourtesyChannelType, LegalChannelType } from '../../src/models/contacts';

describe('Contacts', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.intercept(`${DELEGATIONS_BY_DELEGATE()}`, { fixture: 'delegations/no-mandates' }).as(
      'getActiveMandates'
    );

    cy.intercept('POST', `${LEGAL_CONTACT('default', LegalChannelType.PEC)}`, {
      statusCode: 200,
      fixture: '',
    }).as('addPec');

    cy.login();
    cy.visit(RECAPITI);
  });

  it('Should create a valid PEC', () => {
    // mock contacts (empty list)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/no-contacts',
    }).as('getContacts');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    // verify copy
    cy.log('Verify copy');
    cy.contains(/PEC/);
    cy.contains(
      'Quando c’è una notifica per te, ti inviamo qui l’avviso di avvenuta di ricezione. Accedi a Piattaforma Notifiche per leggerla e pagare eventuali spese.'
    );

    cy.get('#pec').should('have.attr', 'placeholder', 'Il tuo indirizzo PEC');

    cy.get('[data-testid="add contact"]').should('contain', 'Conferma').should('be.disabled');

    cy.get('[data-testid="legal contact disclaimer"]').should(
      'contain',
      'Questo è l’indirizzo principale che verrà utilizzato per inviarti gli avvisi di avvenuta ricezione in via digitale. Inserendolo, non riceverai più raccomandate cartacee.'
    );

    // enter an invalid address and verify the error message appears
    cy.log('enter an invalid address and verify the error message');

    cy.get('#pec').type('testcypress.it');
    cy.get('#pec-helper-text').should('be.visible').should('have.text', 'Indirizzo PEC non valido');
    cy.get('[data-testid="add contact"]').should('be.disabled');

    // enter a valid address
    cy.log('enter a valid address');
    cy.get('#pec').clear().type('test@cypress.it');
    cy.get('#pec-helper-text').should('not.exist');
    cy.get('[data-testid="add contact"]').should('be.enabled');

    // confirm and verify code modal copy
    cy.get('[data-testid="add contact"]').click();

    cy.contains('Abbiamo inviato un codice a test@cypress.it');
    cy.contains(
      'Inseriscilo qui sotto per confermare l’indirizzo PEC. Il codice è valido per 10 minuti.'
    );
    cy.contains('Inserisci codice');
    cy.contains(
      'Non l’hai ricevuto? Controlla che l’indirizzo PEC sia corretto o generane uno nuovo.'
    );

    cy.get('[data-testid="code confirm button"]').should('be.disabled');
    cy.get('[data-testid="code cancel button"]').should('be.enabled');

    // insert an invalid code
    cy.intercept('POST', `${LEGAL_CONTACT('default', LegalChannelType.PEC)}`, {
      statusCode: 422,
      fixture: 'contacts/invalid-code-response',
    }).as('addPec');

    cy.get('[data-testid="code input (0)"]').type('12345');
    cy.get('[data-testid="code confirm button"]').click();

    // verify the request is properly formatted
    cy.wait('@addPec').its('request.body').should('deep.equal', { value: 'test@cypress.it' });

    cy.get('[data-testid="errorAlert"]').should('be.visible');

    // insert a valid code
    cy.intercept('POST', `${LEGAL_CONTACT('default', LegalChannelType.PEC)}`, {
      statusCode: 204,
      fixture: '',
    }).as('addPec');

    cy.get('[data-testid="code input (0)"]').type('54321');
    cy.get('[data-testid="code confirm button"]').click();

    cy.wait('@addPec');
    cy.contains('PEC associata correttamente');
    cy.contains('test@cypress.it');
  });

  it.only('Should enable APPIO', () => {
    // mock contacts (IO not active)
    cy.intercept(`${CONTACTS_LIST()}*`, {
      fixture: 'contacts/no-contacts',
    }).as('getContacts');

    cy.wait('@getContacts');
    cy.get('[data-testid="body"]').should('not.exist');
    cy.get('[data-testid="content"]').should('not.exist');

    cy.contains('App IO');
    cy.contains(
      'Quando c’è una notifica per te, ti inviamo un messaggio su IO. Puoi leggerla e pagare eventuali spese direttamente in app. Qui ricevi anche eventuali comunicazioni importanti.'
    );

    cy.get('[data-testid="AppIO alert"]').should(
      'contain',
      'Scarica l’app IO, accedi e assicurati che il servizio "Notifiche digitali" di Piattaforma Notifiche sia attivo'
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
    cy.wait('@enableIO')
      .its('request.body')
      .should('deep.equal', { value: 'APPIO', verificationCode: '00000' });

    cy.get('.PrivateSwitchBase-input').should('be.checked');

    cy.intercept('DELETE', `${COURTESY_CONTACT('default', CourtesyChannelType.IOMSG)}`, {
      statusCode: 204,
      fixture: '',
    }).as('disableIO');

    cy.get('.PrivateSwitchBase-input').click();

    cy.wait('@disableIO');

    cy.get('.PrivateSwitchBase-input').should('not.be.checked');
  });
});
