import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { LEGAL_CONTACT } from '../../../api/contacts/contacts.routes';
import { LegalChannelType } from '../../../models/contacts';
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
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

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
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: 'mail@valida.com',
      })
      .reply(200);
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: 'mail@valida.com',
        verificationCode: '01234',
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
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
    fireEvent.click(dialogButtons![1]);
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
  });

  it('adds pec - validation not required', async () => {
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: 'mail@valida.com',
      })
      .reply(200);
    mock
      .onPost(LEGAL_CONTACT('default', LegalChannelType.PEC), {
        value: 'mail@valida.com',
        verificationCode: '01234',
      })
      .reply(204);

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
    fireEvent.click(dialogButtons![1]);
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
  });
});
