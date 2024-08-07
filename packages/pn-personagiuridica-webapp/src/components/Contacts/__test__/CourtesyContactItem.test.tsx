import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { ChannelType } from '../../../models/contacts';
import CourtesyContactItem from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

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

Andrea Cimini - 11/09/2023
*/
describe('CourtesyContactItem component', () => {
  describe('test component having type "phone"', () => {
    let mock: MockAdapter;
    const INPUT_VALID_PHONE = '3331234567';
    const INPUT_INVALID_PHONE = '33312345';
    const smsInputName = ChannelType.SMS.toLowerCase();

    beforeAll(() => {
      mock = new MockAdapter(apiClient);
    });

    afterEach(() => {
      mock.reset();
    });

    afterAll(() => {
      mock.restore();
    });

    it('type in an invalid number', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem type={ChannelType.SMS} value="" />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.container.querySelector(`[name="${smsInputName}"]`);
      // set invalid values
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => expect(input!).toHaveValue(INPUT_INVALID_PHONE));
      const inputError = result.container.querySelector(`#${smsInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => expect(input!).toHaveValue(''));
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
      const button = result.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.sms-add');
      expect(button).toBeDisabled();
    });

    it('type in an invalid number while in "edit mode"', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem type={ChannelType.SMS} value={INPUT_VALID_PHONE} />
        </DigitalContactsCodeVerificationProvider>
      );
      result.getByText(INPUT_VALID_PHONE);
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${smsInputName}"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(INPUT_VALID_PHONE);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => expect(input).toHaveValue(INPUT_INVALID_PHONE));
      expect(saveButton).toBeDisabled();
      const inputError = result.container.querySelector(`#${smsInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
    });

    it('remove contact', async () => {
      mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
      // render component
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem type={ChannelType.SMS} value={INPUT_VALID_PHONE} />
        </DigitalContactsCodeVerificationProvider>
      );
      const buttons = result.container.querySelectorAll('button');
      // click on cancel
      fireEvent.click(buttons![1]);
      let dialog = await waitFor(() => screen.getByRole('dialog'));
      expect(dialog).toBeInTheDocument();
      let dialogButtons = dialog?.querySelectorAll('button');
      // cancel remove operation
      fireEvent.click(dialogButtons![0]);
      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
      // click on confirm
      fireEvent.click(buttons![1]);
      dialog = await waitFor(() => screen.getByRole('dialog'));
      dialogButtons = dialog?.querySelectorAll('button');
      fireEvent.click(dialogButtons![1]);
      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(mock.history.delete).toHaveLength(1);
      });
    });
  });

  describe('testing component having type "email"', () => {
    let mock: MockAdapter;
    const VALID_EMAIL = 'prova@pagopa.it';
    const INVALID_EMAIL = 'testpagopa.it';
    const emailInputName = ChannelType.EMAIL.toLowerCase();

    beforeAll(() => {
      mock = new MockAdapter(apiClient);
    });

    afterEach(() => {
      mock.reset();
    });

    afterAll(() => {
      mock.restore();
    });

    it('type in an invalid email', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem type={ChannelType.EMAIL} value="" />
        </DigitalContactsCodeVerificationProvider>
      );
      const input = result.container.querySelector(`[name="${emailInputName}"]`);
      // set invalid values
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input!).toHaveValue(INVALID_EMAIL));
      const inputError = result.container.querySelector(`#${emailInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => expect(input!).toHaveValue(''));
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
      const button = result.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.email-add');
      expect(button).toBeDisabled();
    });

    it('type in an invalid email while in "edit mode"', async () => {
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem type={ChannelType.EMAIL} value={VALID_EMAIL} />
        </DigitalContactsCodeVerificationProvider>
      );
      result.getByText(VALID_EMAIL);
      result.getByRole('button', { name: 'button.elimina' });
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${emailInputName}"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(VALID_EMAIL);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
      expect(saveButton).toBeDisabled();
      const inputError = result.container.querySelector(`#${emailInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
    });

    it('remove contact', async () => {
      mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
      // render component
      const result = render(
        <DigitalContactsCodeVerificationProvider>
          <CourtesyContactItem type={ChannelType.EMAIL} value={VALID_EMAIL} />
        </DigitalContactsCodeVerificationProvider>
      );
      const buttons = result.container.querySelectorAll('button');
      // click on cancel
      fireEvent.click(buttons![1]);
      let dialog = await waitFor(() => screen.getByRole('dialog'));
      expect(dialog).toBeInTheDocument();
      let dialogButtons = dialog?.querySelectorAll('button');
      // cancel remove operation
      fireEvent.click(dialogButtons![0]);
      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
      // click on confirm
      fireEvent.click(buttons![1]);
      dialog = await waitFor(() => screen.getByRole('dialog'));
      dialogButtons = dialog?.querySelectorAll('button');
      fireEvent.click(dialogButtons![1]);
      await waitFor(() => {
        expect(dialog).not.toBeInTheDocument();
      });
      await waitFor(() => {
        expect(mock.history.delete).toHaveLength(1);
      });
    });
  });
});
