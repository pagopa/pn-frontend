import React from 'react';

import { render, fireEvent, waitFor, screen, mockApi } from '../../../__test__/test-utils';
import { LegalChannelType } from '../../../models/contacts';
import { apiClient } from '../../../api/apiClients';
import { LEGAL_CONTACT } from '../../../api/contacts/contacts.routes';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import InsertLegalContact from '../InsertLegalContact';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('InsertLegalContact component', () => {
  it('renders InsertLegalContact', async () => {
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.queryByTestId('DigitalContactsCardBody');
    expect(cardBody).toHaveTextContent('legal-contacts.title');
    expect(cardBody).toHaveTextContent('legal-contacts.subtitle');
    expect(cardBody).toHaveTextContent('legal-contacts.description');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    expect(pecInput!).toHaveValue('');
    const button = await waitFor(() => result.getByRole('button', { name: 'button.conferma' }));
    expect(button).toBeDisabled();
  });

  it('checks invalid pec - 1', async () => {
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail-errata' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail-errata'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const button = result.getByRole('button', { name: 'button.conferma' });
    expect(button).toBeDisabled();
  });

  it('checks invalid pec - 2', async () => {
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail!1@invalida.it' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail!1@invalida.it'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
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
    const cardBody = result.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail@valida.com' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.com'));
    const errorMessage = cardBody?.querySelector('#pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByRole('button', { name: 'button.conferma' });
    expect(button).toBeEnabled();
  });

  it('adds pec - validation required', async () => {
    const mock = mockApi(apiClient, 'POST', LEGAL_CONTACT('default', LegalChannelType.PEC), 200, {
      value: 'mail@valida.com',
    });
    mockApi(
      mock,
      'POST',
      LEGAL_CONTACT('default', LegalChannelType.PEC),
      200,
      {
        value: 'mail@valida.com',
        verificationCode: '01234',
      },
      { result: 'PEC_VALIDATION_REQUIRED' }
    );
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail@valida.com' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.com'));
    const button = result.getByRole('button', { name: 'button.conferma' });
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: 'mail@valida.com',
      });
    });
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((codeInput, index) => {
      fireEvent.change(codeInput, { target: { value: index.toString() } });
    });
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![2]);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: 'mail@valida.com',
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    const validationDialog = await waitFor(() => screen.queryByTestId('validationDialog'));
    expect(validationDialog).toBeInTheDocument();
    mock.reset();
    mock.restore();
  });

  it('adds pec - validation not required', async () => {
    const mock = mockApi(apiClient, 'POST', LEGAL_CONTACT('default', LegalChannelType.PEC), 200, {
      value: 'mail@valida.com',
    });
    mockApi(mock, 'POST', LEGAL_CONTACT('default', LegalChannelType.PEC), 204, {
      value: 'mail@valida.com',
      verificationCode: '01234',
    });
    const result = render(
      <DigitalContactsCodeVerificationProvider>
        <InsertLegalContact recipientId={'mocked-recipientId'} />
      </DigitalContactsCodeVerificationProvider>
    );
    const cardBody = result.queryByTestId('DigitalContactsCardBody');
    const pecInput = cardBody?.querySelector('input[id="pec"]');
    fireEvent.change(pecInput!, { target: { value: 'mail@valida.com' } });
    await waitFor(() => expect(pecInput!).toHaveValue('mail@valida.com'));
    const button = result.getByRole('button', { name: 'button.conferma' });
    fireEvent.click(button!);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: 'mail@valida.com',
      });
    });
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((codeInput, index) => {
      fireEvent.change(codeInput, { target: { value: index.toString() } });
    });
    const dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![2]);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: 'mail@valida.com',
        verificationCode: '01234',
      });
    });
    expect(dialog).not.toBeInTheDocument();
    const validationDialog = await waitFor(() => screen.queryByTestId('validationDialog'));
    expect(validationDialog).not.toBeInTheDocument();
    mock.reset();
    mock.restore();
  });
});
