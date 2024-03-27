import React from 'react';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import CourtesyContactItem, { CourtesyFieldType } from '../CourtesyContactItem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
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
describe('CourtesyContactItem component', () => {
  describe('test component having type "phone"', () => {
    const INPUT_VALID_PHONE = '3331234567';
    const INPUT_INVALID_PHONE = '33312345';

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
  });

  describe('testing component having type "email"', () => {
    const VALID_EMAIL = 'prova@pagopa.it';
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
      result.getByText(VALID_EMAIL);
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
  });
});
