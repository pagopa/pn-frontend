import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  fireEvent,
  render,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import CourtesyContactItem from '../CourtesyContactItem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const fillCodeDialog = async (result: RenderResult) => {
  const dialog = await waitFor(() => result.getByTestId('codeDialog'));
  expect(dialog).toBeInTheDocument();
  const codeInputs = dialog?.querySelectorAll('input');
  // fill inputs with values
  codeInputs?.forEach((codeInput, index) => {
    fireEvent.change(codeInput, { target: { value: index.toString() } });
  });
  // confirm the addition
  const dialogButtons = dialog?.querySelectorAll('button');
  fireEvent.click(dialogButtons[1]);
  return dialog;
};

const defaultEmailAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.EMAIL && addr.senderId === 'default'
);

const defaultPhoneAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
);

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nella pagina dei contatti, dove si può testare anche il cambio di stato di redux e le api

Andrea Cimini - 6/09/2023
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
      const result = render(<CourtesyContactItem type={ChannelType.SMS} value="" />);

      const input = result.container.querySelector(`[name="${smsInputName}"]`);
      // set invalid values
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => {
        expect(input!).toHaveValue(INPUT_INVALID_PHONE);
      });
      const inputError = result.container.querySelector(`#${smsInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => {
        expect(input!).toHaveValue('');
      });
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
      const button = result.getByRole('button');
      expect(button).toHaveTextContent('courtesy-contacts.sms-add');
      expect(button).toBeDisabled();
    });

    it('type in an invalid number while in "edit mode"', async () => {
      const result = render(
        <CourtesyContactItem type={ChannelType.SMS} value={INPUT_VALID_PHONE} />
      );
      result.getByText(INPUT_VALID_PHONE);
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${smsInputName}"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(INPUT_VALID_PHONE);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => {
        expect(input).toHaveValue(INPUT_INVALID_PHONE);
      });
      expect(saveButton).toBeDisabled();
      const inputError = result.container.querySelector(`#${smsInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
    });

    it('add new phone number', async () => {
      const phoneValue = '3333333333';
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
          value: '+39' + phoneValue,
        })
        .reply(200, {
          result: 'CODE_VERIFICATION_REQUIRED',
        });
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
          value: '+39' + phoneValue,
          verificationCode: '01234',
        })
        .reply(204);
      const result = render(<CourtesyContactItem type={ChannelType.SMS} value="" />);
      const input = result.container.querySelector(`[name="${smsInputName}"]`);
      expect(input).toHaveValue('');
      fireEvent.change(input!, { target: { value: phoneValue } });
      await waitFor(() => expect(input!).toHaveValue(phoneValue));
      const button = result.getByTestId('courtesy-sms-button');
      expect(button).toBeEnabled();
      // save the phone
      fireEvent.click(button);

      // Confirms the disclaimer dialog
      const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: '+39' + phoneValue,
        });
      });
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: '+39' + phoneValue,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY
          )
      ).toStrictEqual([
        {
          ...defaultPhoneAddress,
          senderName: undefined,
          value: '+39' + phoneValue,
        },
      ]);
      // simulate rerendering due to redux changes
      result.rerender(
        <CourtesyContactItem type={ChannelType.SMS} value={defaultPhoneAddress!.value} />
      );
      await waitFor(() => {
        expect(input).not.toBeInTheDocument();
        expect(result.container).toHaveTextContent('+39' + phoneValue);
      });
    });

    it('override an existing phone number with a new one', async () => {
      const phoneValue = '+393333333334';
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
          value: phoneValue,
        })
        .reply(200, {
          result: 'CODE_VERIFICATION_REQUIRED',
        });
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
          value: phoneValue,
          verificationCode: '01234',
        })
        .reply(204);
      const result = render(
        <CourtesyContactItem type={ChannelType.SMS} value={defaultPhoneAddress!.value} />,
        {
          preloadedState: {
            contactsState: { digitalAddresses: [defaultPhoneAddress] },
          },
        }
      );
      const phoneForm = result.getByTestId(`courtesyContacts-${smsInputName}`);
      const editButton = within(phoneForm).getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${smsInputName}"]`);
      fireEvent.change(input!, { target: { value: phoneValue } });
      await waitFor(() => {
        expect(input!).toHaveValue(phoneValue);
      });
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      fireEvent.click(saveButton);
      // Confirms the disclaimer dialog
      const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: phoneValue,
        });
      });
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: phoneValue,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY
          )
      ).toStrictEqual([
        {
          ...defaultPhoneAddress,
          senderName: undefined,
          value: phoneValue,
        },
      ]);
      // simulate rerendering due to redux changes
      const updatedDigitalCourtesyAddresses = [
        {
          ...defaultPhoneAddress!,
          value: phoneValue,
        },
      ];
      result.rerender(
        <CourtesyContactItem
          type={ChannelType.SMS}
          value={updatedDigitalCourtesyAddresses[0].value}
        />
      );
      await waitFor(() => {
        expect(input).not.toBeInTheDocument();
        expect(result.container).toHaveTextContent(phoneValue);
      });
    });

    it('delete phone number', async () => {
      mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
      const phoneValue = defaultPhoneAddress!.value;
      const result = render(
        <CourtesyContactItem type={ChannelType.SMS} value={defaultPhoneAddress!.value} />,
        {
          preloadedState: {
            contactsState: { digitalAddresses: [defaultPhoneAddress] },
          },
        }
      );
      const phoneText = result.getByText(phoneValue);
      expect(phoneText).toBeInTheDocument();
      const phoneForm = result.getByTestId(`courtesyContacts-${smsInputName}`);
      const deleteButton = within(phoneForm).getByRole('button', { name: 'button.elimina' });
      fireEvent.click(deleteButton);
      // find confirmation dialog and its buttons
      const dialogBox = result.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
      expect(dialogBox).toBeVisible();
      const cancelButton = within(dialogBox).getByRole('button', { name: 'button.annulla' });
      const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
      // cancel delete and verify the dialog hides
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
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY
          )
      ).toStrictEqual([]);
      // simulate rerendering due to redux changes
      result.rerender(<CourtesyContactItem type={ChannelType.SMS} value="" />);
      await waitFor(() => {
        const input = result.container.querySelector(`[name="${smsInputName}"]`);
        expect(input).toBeInTheDocument();
        expect(result.container).not.toHaveTextContent(phoneValue);
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
      const result = render(<CourtesyContactItem type={ChannelType.EMAIL} value="" />);
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
      const result = render(<CourtesyContactItem type={ChannelType.EMAIL} value={VALID_EMAIL} />);
      result.getByText(VALID_EMAIL);
      const editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${emailInputName}"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(VALID_EMAIL);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => {
        expect(input).toHaveValue(INVALID_EMAIL);
      });
      expect(saveButton).toBeDisabled();
      const inputError = result.container.querySelector(`#${emailInputName}-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
    });

    it.only('add new email', async () => {
      const mailValue = 'nome.utente@mail.it';
      mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: mailValue }).reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
          value: mailValue,
          verificationCode: '01234',
        })
        .reply(204);
      const result = render(<CourtesyContactItem type={ChannelType.EMAIL} value="" />);
      const input = result.container.querySelector(`[name="${emailInputName}"]`);
      expect(input).toHaveValue('');
      fireEvent.change(input!, { target: { value: mailValue } });
      await waitFor(() => expect(input!).toHaveValue(mailValue));
      const button = result.getByTestId('courtesy-email-button');
      expect(button).toBeEnabled();
      // save the email
      fireEvent.click(button);
      // Confirms the disclaimer dialog
      const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: mailValue,
        });
      });
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: mailValue,
          verificationCode: '01234',
        });
      });
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY && addr.senderId === 'default'
          )
      ).toStrictEqual([
        {
          ...defaultEmailAddress,
          value: mailValue,
        },
      ]);
      // simulate rerendering due to redux changes
      result.rerender(
        <CourtesyContactItem type={ChannelType.EMAIL} value={defaultEmailAddress!.value} />
      );
      await waitFor(() => {
        expect(input).not.toBeInTheDocument();
        expect(result.container).toHaveTextContent(mailValue);
      });
    });

    it('override an existing email with a new one', async () => {
      const emailValue = 'nome.cognome-modified@mail.com';
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
          value: emailValue,
        })
        .reply(200, {
          result: 'CODE_VERIFICATION_REQUIRED',
        });
      mock
        .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', {
          value: emailValue,
          verificationCode: '01234',
        })
        .reply(204);
      const result = render(
        <CourtesyContactItem type={ChannelType.EMAIL} value={defaultEmailAddress!.value} />,
        {
          preloadedState: {
            contactsState: { digitalAddresses: [defaultEmailAddress] },
          },
        }
      );
      const emailForm = result.getByTestId(`courtesyContacts-${emailInputName}`);
      const editButton = within(emailForm).getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="${emailInputName}"]`);
      fireEvent.change(input!, { target: { value: emailValue } });
      await waitFor(() => expect(input!).toHaveValue(emailValue));
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      fireEvent.click(saveButton);
      // Confirms the disclaimer dialog
      const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
      fireEvent.click(disclaimerCheckbox);
      const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
      fireEvent.click(disclaimerConfirmButton);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(1);
        expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
          value: emailValue,
        });
      });
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: emailValue,
          verificationCode: '01234',
        });
      });
      expect(dialog).not.toBeInTheDocument();
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY
          )
      ).toStrictEqual([
        {
          ...defaultEmailAddress,
          senderName: undefined,
          value: emailValue,
        },
      ]);
      // simulate rerendering due to redux changes
      const updatedDigitalCourtesyAddresses = [
        {
          ...defaultEmailAddress!,
          value: emailValue,
        },
      ];
      result.rerender(
        <CourtesyContactItem
          type={ChannelType.EMAIL}
          value={updatedDigitalCourtesyAddresses[0].value}
        />
      );
      await waitFor(() => {
        expect(input).not.toBeInTheDocument();
        expect(result.container).toHaveTextContent(emailValue);
      });
    });

    it('delete email', async () => {
      mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
      const emailValue = defaultEmailAddress!.value;
      const result = render(
        <CourtesyContactItem type={ChannelType.EMAIL} value={defaultEmailAddress!.value} />,
        {
          preloadedState: {
            contactsState: { digitalAddresses: [defaultEmailAddress] },
          },
        }
      );
      const emailText = result.getByText(emailValue);
      expect(emailText).toBeInTheDocument();
      const emailForm = result.getByTestId(`courtesyContacts-${emailInputName}`);
      const deleteButton = within(emailForm).getByRole('button', { name: 'button.elimina' });
      fireEvent.click(deleteButton);
      // find confirmation dialog and its buttons
      const dialogBox = result.getByRole('dialog', { name: /courtesy-contacts.remove\b/ });
      expect(dialogBox).toBeVisible();
      const cancelButton = within(dialogBox).getByRole('button', { name: 'button.annulla' });
      const confirmButton = within(dialogBox).getByRole('button', { name: 'button.conferma' });
      // cancel delete and verify the dialog hides
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
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter(
            (addr) => addr.addressType === AddressType.COURTESY
          )
      ).toStrictEqual([]);
      // simulate rerendering due to redux changes
      result.rerender(<CourtesyContactItem type={ChannelType.EMAIL} value="" />);
      await waitFor(() => {
        const input = result.container.querySelector(`[name="${emailInputName}"]`);
        expect(input).toBeInTheDocument();
        expect(result.container).not.toHaveTextContent(emailValue);
      });
    });
  });
});
