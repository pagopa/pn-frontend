import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { RenderResult, fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { COURTESY_CONTACT } from '../../../api/contacts/contacts.routes';
import { CourtesyChannelType } from '../../../models/contacts';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('CourtesyContactItem component', () => {
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('test component having type "phone"', () => {
    const INPUT_VALID_PHONE = '3331234567';
    const INPUT_INVALID_PHONE = '33312345';

    it('type in an invalid number', async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
      // set invalid values
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => expect(input!).toHaveValue(INPUT_INVALID_PHONE));
      const inputError = result.container.querySelector(`#${CourtesyFieldType.PHONE}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-phone');
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => expect(input!).toHaveValue(''));
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-phone');
      const button = result.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.phone-add');
      expect(button).toBeDisabled();
    });

    it('save a new phone number', async () => {
      mock
        .onPost(COURTESY_CONTACT('default', CourtesyChannelType.SMS), {
          value: '+39' + INPUT_VALID_PHONE,
        })
        .reply(200);
      mock
        .onPost(COURTESY_CONTACT('default', CourtesyChannelType.SMS), {
          value: '+39' + INPUT_VALID_PHONE,
          verificationCode: '01234',
        })
        .reply(204);
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.getByRole('textbox');
      fireEvent.change(input!, { target: { value: INPUT_VALID_PHONE } });
      await waitFor(() => expect(input!).toHaveValue(INPUT_VALID_PHONE));
      const button = result.getByRole('button');
      fireEvent.click(button!);
      // Confirms the disclaimer dialog
      const disclaimerCheckbox = await waitFor(() =>
        screen.getByRole('checkbox', { name: 'button.capito' })
      );
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: '+39' + INPUT_VALID_PHONE,
        });
      });
      const dialog = await waitFor(() => {
        const dialogEl = screen.queryByTestId('codeDialog');
        expect(dialogEl).toBeInTheDocument();
        return dialogEl;
      });
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
          value: '+39' + INPUT_VALID_PHONE,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
    });

    it('type in an invalid number while in "edit mode"', async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={INPUT_VALID_PHONE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      result.getByText(INPUT_VALID_PHONE);
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${CourtesyFieldType.PHONE}"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(INPUT_VALID_PHONE);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => expect(input).toHaveValue(INPUT_INVALID_PHONE));
      expect(saveButton).toBeDisabled();
      const inputError = result.container.querySelector(`#${CourtesyFieldType.PHONE}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-phone');
    });

    it('delete phone number', async () => {
      mock.onDelete(COURTESY_CONTACT('default', CourtesyChannelType.SMS)).reply(204);
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={INPUT_VALID_PHONE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const phoneText = result.getByText(INPUT_VALID_PHONE);
      expect(phoneText).toBeInTheDocument();
      const deleteButton = result.getByRole('button', { name: 'button.elimina' });
      fireEvent.click(deleteButton);
      // find confirmation dialog and its buttons
      const dialogBox = screen.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
      expect(dialogBox).toBeVisible();
      const cancelButton = screen.getByRole('button', { name: 'button.annulla' });
      const confirmButton = screen.getByRole('button', { name: 'button.conferma' });
      // cancel delete and verify the dialog hides and the value is still on the page
      fireEvent.click(cancelButton);
      expect(dialogBox).not.toBeVisible();
      // delete the number
      fireEvent.click(deleteButton);
      expect(dialogBox).toBeVisible();
      fireEvent.click(confirmButton);
      await waitFor(() => {
        expect(dialogBox).not.toBeVisible();
        expect(mock.history.delete).toHaveLength(1);
      });
    });
  });

  describe('testing component having type "email"', () => {
    const VALID_EMAIL = 'prova@pagopa.it';
    const INVALID_EMAIL = 'testpagopa.it';

    it('type in an invalid email', async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
      // set invalid values
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input!).toHaveValue(INVALID_EMAIL));
      const inputError = result.container.querySelector(`#${CourtesyFieldType.EMAIL}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => expect(input!).toHaveValue(''));
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
      const button = result.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.email-add');
      expect(button).toBeDisabled();
    });

    it('add a new email', async () => {
      mock
        .onPost(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), {
          value: VALID_EMAIL,
        })
        .reply(200);
      mock
        .onPost(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), {
          value: VALID_EMAIL,
          verificationCode: '01234',
        })
        .reply(204);
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.getByRole('textbox');
      fireEvent.change(input!, { target: { value: VALID_EMAIL } });
      await waitFor(() => expect(input!).toHaveValue(VALID_EMAIL));
      const button = result.getByRole('button');
      await waitFor(() => fireEvent.click(button!));
      // Confirms the disclaimer dialog
      const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: VALID_EMAIL,
        });
      });
      const dialog = await waitFor(() => {
        const dialogEl = screen.queryByTestId('codeDialog');
        expect(dialogEl).toBeInTheDocument();
        return dialogEl;
      });
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
          value: VALID_EMAIL,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
    });

    it('type in an invalid email while in "edit mode"', async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value={VALID_EMAIL}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      result.getByText(VALID_EMAIL);
      result.getByRole('button', { name: 'button.elimina' });
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${CourtesyFieldType.EMAIL}"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(VALID_EMAIL);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
      expect(saveButton).toBeDisabled();
      const inputError = result.container.querySelector(`#${CourtesyFieldType.EMAIL}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
    });

    it('delete email', async () => {
      mock.onDelete(COURTESY_CONTACT('default', CourtesyChannelType.EMAIL)).reply(204);
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value={VALID_EMAIL}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const textValue = result.getByText(VALID_EMAIL);
      expect(textValue).toBeInTheDocument();
      const deleteButton = result.getByRole('button', { name: 'button.elimina' });
      fireEvent.click(deleteButton);
      // find confirmation dialog and its buttons
      const dialogBox = screen.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
      expect(dialogBox).toBeVisible();
      const cancelButton = screen.getByRole('button', { name: 'button.annulla' });
      const confirmButton = screen.getByRole('button', { name: 'button.conferma' });
      // cancel delete and verify the dialog hides and the value is still on the page
      fireEvent.click(cancelButton);
      expect(dialogBox).not.toBeVisible();
      // delete the number
      fireEvent.click(deleteButton);
      expect(dialogBox).toBeVisible();
      fireEvent.click(confirmButton);
      await waitFor(() => {
        expect(dialogBox).not.toBeVisible();
        expect(mock.history.delete).toHaveLength(1);
      });
    });
  });
});
