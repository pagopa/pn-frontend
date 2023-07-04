import React from 'react';

import { render, fireEvent, screen, waitFor, mockApi } from '../../../__test__/test-utils';
import { CourtesyChannelType } from '../../../models/contacts';
import { apiClient } from '../../../api/apiClients';
import { COURTESY_CONTACT } from '../../../api/contacts/contacts.routes';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

describe('CourtesyContactItem component', () => {
  describe('test component having type "phone"', () => {
    const INPUT_VALID_PHONE = '3331234567';
    const INPUT_INVALID_PHONE = '33312345';
    const INPUT_VALID_PHONE_UPDATE = '+393337654321';

    it('type in an invalid number', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const inputs = await result.findAllByRole('textbox');
      expect(inputs![0]).toBeInTheDocument();
      expect(inputs).toHaveLength(1);
      const input = result.getByTestId('courtesy-contact-phone');
      expect(inputs![0]).toEqual(input);
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => expect(input!).toHaveValue(INPUT_INVALID_PHONE));
      const textMessage = result.queryByText('courtesy-contacts.valid-phone');
      expect(textMessage).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.phone-add');
      expect(button).toBeDisabled();
    });

    it('type in a valid number', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.getByRole('textbox');
      expect(input).toHaveValue('');
      fireEvent.change(input!, { target: { value: INPUT_VALID_PHONE } });
      await waitFor(() => expect(input!).toHaveValue(INPUT_VALID_PHONE));
      const textMessage = result.queryByText('courtesy-contacts.valid-phone');
      expect(textMessage).not.toBeInTheDocument();
      const buttons = result.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('courtesy-contacts.phone-add');
      expect(buttons[0]).toBeEnabled();
    });

    it('save a new phone number', async () => {
      const mock = mockApi(
        apiClient,
        'POST',
        COURTESY_CONTACT('default', CourtesyChannelType.SMS),
        200,
        {
          value: '+39' + INPUT_VALID_PHONE,
        }
      );
      mockApi(mock, 'POST', COURTESY_CONTACT('default', CourtesyChannelType.SMS), 204, {
        value: '+39' + INPUT_VALID_PHONE,
        verificationCode: '01234',
      });
      const result = render(
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
      fireEvent.click(dialogButtons![2]);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: '+39' + INPUT_VALID_PHONE,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      mock.reset();
      mock.restore();
    });

    it('type in an invalid number while in "edit mode"', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={INPUT_VALID_PHONE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      //verify initial conditions
      result.getByText(INPUT_VALID_PHONE);
      result.getByRole('button', { name: 'button.elimina' });
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.getByRole('textbox');
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(INPUT_VALID_PHONE);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => expect(input).toHaveValue(INPUT_INVALID_PHONE));
      expect(saveButton).toBeDisabled();
    });

    it('override an existing phone number with a new one', async () => {
      const mock = mockApi(
        apiClient,
        'POST',
        COURTESY_CONTACT('default', CourtesyChannelType.SMS),
        200,
        {
          value: INPUT_VALID_PHONE_UPDATE,
        }
      );
      mockApi(mock, 'POST', COURTESY_CONTACT('default', CourtesyChannelType.SMS), 204, {
        value: INPUT_VALID_PHONE_UPDATE,
        verificationCode: '01234',
      });
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={INPUT_VALID_PHONE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.getByRole('textbox');
      fireEvent.change(input!, { target: { value: INPUT_VALID_PHONE_UPDATE } });
      await waitFor(() => expect(input!).toHaveValue(INPUT_VALID_PHONE_UPDATE));
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      fireEvent.click(saveButton);
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
          value: INPUT_VALID_PHONE_UPDATE,
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
      fireEvent.click(dialogButtons![2]);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: INPUT_VALID_PHONE_UPDATE,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      mock.reset();
      mock.restore();
    });

    it('delete phone number', async () => {
      const mock = mockApi(
        apiClient,
        'DELETE',
        COURTESY_CONTACT('default', CourtesyChannelType.SMS),
        204
      );
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.PHONE}
            value={INPUT_VALID_PHONE_UPDATE}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const phoneText = result.getByText(INPUT_VALID_PHONE_UPDATE);
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
      mock.reset();
      mock.restore();
    });
  });

  describe('testing component having type "email"', () => {
    const VALID_EMAIL = 'prova@pagopa.it';
    const VALID_EMAIL_UPDATE = 'prova-nuova@pagopa.it';
    const INVALID_EMAIL = 'testpagopa.it';

    it('type in an invalid email', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const inputs = await result.findAllByRole('textbox');
      expect(inputs![0]).toBeInTheDocument();
      expect(inputs).toHaveLength(1);
      const input = result.getByTestId('courtesy-contact-email');
      expect(inputs![0]).toEqual(input);
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input!).toHaveValue(INVALID_EMAIL));
      const textMessage = result.queryByText('courtesy-contacts.valid-email');
      expect(textMessage).toBeInTheDocument();
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.email-add');
      expect(button).toBeDisabled();
    });

    it('type in a valid email', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value=""
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.getByRole('textbox');
      expect(input).toHaveValue('');
      fireEvent.change(input!, { target: { value: VALID_EMAIL } });
      await waitFor(() => expect(input!).toHaveValue(VALID_EMAIL));
      const textMessage = result.queryByText('courtesy-contacts.valid-email');
      expect(textMessage).not.toBeInTheDocument();
      const buttons = result.getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('courtesy-contacts.email-add');
      expect(buttons[0]).toBeEnabled();
    });

    it('add a new email', async () => {
      const mock = mockApi(
        apiClient,
        'POST',
        COURTESY_CONTACT('default', CourtesyChannelType.EMAIL),
        200,
        {
          value: VALID_EMAIL,
        }
      );
      mockApi(mock, 'POST', COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), 204, {
        value: VALID_EMAIL,
        verificationCode: '01234',
      });
      const result = render(
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
      fireEvent.click(dialogButtons![2]);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: VALID_EMAIL,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      mock.reset();
      mock.restore();
    });

    it('type in an invalid email while in "edit mode"', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value={VALID_EMAIL}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      //verify initial conditions
      result.getByText(VALID_EMAIL);
      result.getByRole('button', { name: 'button.elimina' });
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.getByRole('textbox');
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(VALID_EMAIL);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
      expect(saveButton).toBeDisabled();
    });

    it('override an existing email with a new one', async () => {
      const mock = mockApi(
        apiClient,
        'POST',
        COURTESY_CONTACT('default', CourtesyChannelType.EMAIL),
        200,
        {
          value: VALID_EMAIL_UPDATE,
        }
      );
      mockApi(mock, 'POST', COURTESY_CONTACT('default', CourtesyChannelType.EMAIL), 204, {
        value: VALID_EMAIL_UPDATE,
        verificationCode: '01234',
      });
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem
            recipientId="mocked-recipient"
            type={CourtesyFieldType.EMAIL}
            value={VALID_EMAIL}
          />
        </DigitalContactsCodeVerificationProvider>
      );
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.getByRole('textbox');
      fireEvent.change(input!, { target: { value: VALID_EMAIL_UPDATE } });
      await waitFor(() => expect(input!).toHaveValue(VALID_EMAIL_UPDATE));
      const saveButton = screen.getByRole('button', { name: 'button.salva' });
      fireEvent.click(saveButton!);
      // Confirms the disclaimer dialog
      const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = screen.getByRole('button', { name: 'button.conferma' });
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: VALID_EMAIL_UPDATE,
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
      fireEvent.click(dialogButtons![2]);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: VALID_EMAIL_UPDATE,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      mock.reset();
      mock.restore();
    });

    it('delete email', async () => {
      const mock = mockApi(
        apiClient,
        'DELETE',
        COURTESY_CONTACT('default', CourtesyChannelType.EMAIL),
        204
      );
      const result = render(
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
      mock.reset();
      mock.restore();
    });
  });
});
