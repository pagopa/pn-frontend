import React from 'react';
import { vi } from 'vitest';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import InsertLegalContact from '../InsertLegalContact';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nella pagina dei contatti, dove si può testare anche il cambio di stato di redux e le api

Andrea Cimini - 6/09/2023
*/
describe('InsertLegalContact component', () => {
  it('renders InsertLegalContact', async () => {
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.getByTestId('DigitalContactsCardBody');
    expect(cardBody).toHaveTextContent('legal-contacts.title');
    expect(cardBody).toHaveTextContent('legal-contacts.subtitle');
    expect(cardBody).toHaveTextContent('legal-contacts.description');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    expect(pecInput!).toHaveValue('');
    const button = await waitFor(() => result.getByRole('button', { name: 'button.conferma' }));
    expect(button).toBeDisabled();
    const disclaimer = result.getByTestId('legal-contact-disclaimer');
    expect(disclaimer).toBeInTheDocument();
  });

  it('checks invalid pec', async () => {
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.getByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail-errata' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail-errata'));
    let errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    fireEvent.change(pecInput!, { target: { value: '' } });
    await waitFor(() => expect(pecInput!).toHaveValue(''));
    errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const button = result.getByRole('button', { name: 'button.conferma' });
    expect(button).toBeDisabled();
  });

  it('checks valid pec', async () => {
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.getByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail@valida.com' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.com'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByRole('button', { name: 'button.conferma' });
    expect(button).toBeEnabled();
  });
});
