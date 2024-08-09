import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
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
      // render component
      const { container } = render(<CourtesyContactItem type={ChannelType.SMS} value="" />);
      const form = container.querySelector('form');
      const input = form!.querySelector(`[name="sms"]`);
      // add invalid values
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => {
        expect(input!).toHaveValue(INPUT_INVALID_PHONE);
      });
      const errorMessage = form!.querySelector(`#sms-helper-text`);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');
      const buttons = form!.querySelectorAll('button');
      expect(buttons[0]).toBeDisabled();
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => {
        expect(input!).toHaveValue('');
      });
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');
    });

    it('type in an invalid number while in "edit mode"', async () => {
      const { container, getByRole } = render(
        <CourtesyContactItem type={ChannelType.SMS} value={INPUT_VALID_PHONE} />
      );
      const form = container.querySelector('form');
      const phoneValue = getById(form!, 'sms-typography');
      expect(phoneValue).toHaveTextContent(INPUT_VALID_PHONE);
      const editButton = getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = container.querySelector(`[name="sms"]`);
      const saveButton = getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(INPUT_VALID_PHONE);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
      await waitFor(() => {
        expect(input).toHaveValue(INPUT_INVALID_PHONE);
      });
      expect(saveButton).toBeDisabled();
      const inputError = container.querySelector(`#sms-helper-text`);
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
      // insert new phone
      const form = result.container.querySelector('form');
      const input = form!.querySelector(`[name="sms"]`);
      fireEvent.change(input!, { target: { value: phoneValue } });
      await waitFor(() => expect(input!).toHaveValue(phoneValue));
      const errorMessage = form?.querySelector('#phone-helper-text');
      expect(errorMessage).not.toBeInTheDocument();
      const button = result.getByTestId('courtesy-sms-button');
      expect(button).toBeEnabled();
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
      // inser otp and confirm
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: '+39' + phoneValue,
          verificationCode: '01234',
        });
      });
      // check that contact has been added
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
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
      });
      const smsValue = getById(form!, 'sms-typography');
      expect(smsValue).toBeInTheDocument();
      expect(smsValue).toHaveTextContent('+39' + phoneValue);
      const editButton = getById(form!, 'modifyContact-default');
      expect(editButton).toBeInTheDocument();
      const deleteButton = getById(form!, 'cancelContact-default');
      expect(deleteButton).toBeInTheDocument();
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
      // render component
      const result = render(
        <CourtesyContactItem type={ChannelType.SMS} value={defaultPhoneAddress!.value} />
      );
      // edit value
      const form = result.container.querySelector('form');
      let smsValue = getById(form!, 'sms-typography');
      expect(smsValue).toHaveTextContent(defaultPhoneAddress!.value);
      let editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="sms"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(defaultPhoneAddress!.value);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: phoneValue } });
      await waitFor(() => {
        expect(input!).toHaveValue(phoneValue);
      });
      // confirm new value
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
      // inser otp and confirm
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: phoneValue,
          verificationCode: '01234',
        });
      });
      // check that contact has been added
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
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
      });
      smsValue = getById(form!, 'sms-typography');
      expect(smsValue).toBeInTheDocument();
      expect(smsValue).toHaveTextContent(phoneValue);
      editButton = getById(form!, 'modifyContact-default');
      expect(editButton).toBeInTheDocument();
      const deleteButton = getById(form!, 'cancelContact-default');
      expect(deleteButton).toBeInTheDocument();
    });

    it('delete phone number', async () => {
      mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
      // render component
      const result = render(
        <CourtesyContactItem type={ChannelType.SMS} value={defaultPhoneAddress!.value} />
      );
      const buttons = result.container.querySelectorAll('button');
      // click on cancel
      fireEvent.click(buttons[1]);
      let dialog = await waitFor(() => screen.getByRole('dialog'));
      expect(dialog).toBeInTheDocument();
      let dialogButtons = dialog.querySelectorAll('button');
      // cancel remove operation
      fireEvent.click(dialogButtons[0]);
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
      // click on confirm
      fireEvent.click(buttons[1]);
      dialog = await waitFor(() => screen.getByRole('dialog'));
      dialogButtons = dialog.querySelectorAll('button');
      fireEvent.click(dialogButtons[1]);
      await waitFor(() => {
        expect(dialog).not.toBeVisible();
      });
      await waitFor(() => {
        expect(mock.history.delete).toHaveLength(1);
      });
      await waitFor(() => {
        expect(
          testStore
            .getState()
            .contactsState.digitalAddresses.filter(
              (addr) => addr.addressType === AddressType.COURTESY
            )
        ).toStrictEqual([]);
      });
      // simulate rerendering due to redux changes
      result.rerender(<CourtesyContactItem type={ChannelType.SMS} value="" />);
      await waitFor(() => {
        const input = result.container.querySelector(`[name="sms"]`);
        expect(input).toBeInTheDocument();
        expect(result.container).not.toHaveTextContent('');
      });
    });
  });

  describe('testing component having type "email"', () => {
    let mock: MockAdapter;
    const VALID_EMAIL = 'prova@pagopa.it';
    const INVALID_EMAIL = 'testpagopa.it';

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
      // render component
      const { container } = render(<CourtesyContactItem type={ChannelType.EMAIL} value="" />);
      const form = container.querySelector('form');
      const input = form!.querySelector(`[name="email"]`);
      // set invalid values
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => expect(input).toHaveValue(INVALID_EMAIL));
      const errorMessage = form!.querySelector(`#email-helper-text`);
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
      const buttons = form!.querySelectorAll('button');
      expect(buttons[0]).toBeDisabled();
      fireEvent.change(input!, { target: { value: '' } });
      await waitFor(() => expect(input!).toHaveValue(''));
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-email');
    });

    it('type in an invalid email while in "edit mode"', async () => {
      const { container, getByRole } = render(
        <CourtesyContactItem type={ChannelType.EMAIL} value={VALID_EMAIL} />
      );
      const form = container.querySelector('form');
      const phoneValue = getById(form!, 'email-typography');
      expect(phoneValue).toHaveTextContent(VALID_EMAIL);
      const editButton = getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = container.querySelector(`[name="email"]`);
      const saveButton = getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(VALID_EMAIL);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: INVALID_EMAIL } });
      await waitFor(() => {
        expect(input).toHaveValue(INVALID_EMAIL);
      });
      expect(saveButton).toBeDisabled();
      const inputError = container.querySelector(`#email-helper-text`);
      expect(inputError).toHaveTextContent('courtesy-contacts.valid-email');
    });

    it('add new email', async () => {
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
      // insert new email
      const form = result.container.querySelector('form');
      const input = form!.querySelector(`[name="email"]`);
      fireEvent.change(input!, { target: { value: mailValue } });
      await waitFor(() => expect(input!).toHaveValue(mailValue));
      const errorMessage = form?.querySelector('#sms-helper-text');
      expect(errorMessage).not.toBeInTheDocument();
      const button = result.getByTestId('courtesy-email-button');
      expect(button).toBeEnabled();
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
      // inser otp and confirm
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: mailValue,
          verificationCode: '01234',
        });
      });
      // check that contact has been added
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
          senderName: undefined,
          value: mailValue,
        },
      ]);
      // simulate rerendering due to redux changes
      result.rerender(
        <CourtesyContactItem type={ChannelType.EMAIL} value={defaultEmailAddress!.value} />
      );
      await waitFor(() => {
        expect(input).not.toBeInTheDocument();
      });
      const emailValue = getById(form!, 'email-typography');
      expect(emailValue).toBeInTheDocument();
      expect(emailValue).toHaveTextContent(mailValue);
      const editButton = getById(form!, 'modifyContact-default');
      expect(editButton).toBeInTheDocument();
      const deleteButton = getById(form!, 'cancelContact-default');
      expect(deleteButton).toBeInTheDocument();
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
      // render component
      const result = render(
        <CourtesyContactItem type={ChannelType.EMAIL} value={defaultEmailAddress!.value} />
      );
      // edit value
      const form = result.container.querySelector('form');
      let mailValue = getById(form!, 'email-typography');
      expect(mailValue).toHaveTextContent(defaultEmailAddress!.value);
      let editButton = result.getByRole('button', { name: 'button.modifica' });
      fireEvent.click(editButton);
      const input = result.container.querySelector(`[name="email"]`);
      const saveButton = result.getByRole('button', { name: 'button.salva' });
      expect(input).toHaveValue(defaultEmailAddress!.value);
      expect(saveButton).toBeEnabled();
      fireEvent.change(input!, { target: { value: emailValue } });
      await waitFor(() => expect(input!).toHaveValue(emailValue));
      // confirm new value
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
      // inser otp and confirm
      const dialog = await fillCodeDialog(result);
      await waitFor(() => {
        expect(mock.history.post).toHaveLength(2);
        expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
          value: emailValue,
          verificationCode: '01234',
        });
      });
      // check that contact has been added
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
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
      });
      mailValue = getById(form!, 'email-typography');
      expect(mailValue).toBeInTheDocument();
      expect(mailValue).toHaveTextContent(emailValue);
      editButton = getById(form!, 'modifyContact-default');
      expect(editButton).toBeInTheDocument();
      const deleteButton = getById(form!, 'cancelContact-default');
      expect(deleteButton).toBeInTheDocument();
    });

    it('delete email', async () => {
      mock.onDelete('/bff/v1/addresses/COURTESY/default/EMAIL').reply(204);
      const result = render(
        <CourtesyContactItem type={ChannelType.EMAIL} value={defaultEmailAddress!.value} />
      );
      const buttons = result.container.querySelectorAll('button');
      // click on cancel
      fireEvent.click(buttons[1]);
      let dialog = await waitFor(() => screen.getByRole('dialog'));
      expect(dialog).toBeInTheDocument();
      let dialogButtons = dialog.querySelectorAll('button');
      // cancel remove operation
      fireEvent.click(dialogButtons[0]);
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
      // click on confirm
      fireEvent.click(buttons[1]);
      dialog = await waitFor(() => screen.getByRole('dialog'));
      dialogButtons = dialog.querySelectorAll('button');
      fireEvent.click(dialogButtons[1]);
      await waitFor(() => {
        expect(dialog).not.toBeVisible();
      });
      await waitFor(() => {
        expect(mock.history.delete).toHaveLength(1);
      });
      await waitFor(() => {
        expect(
          testStore
            .getState()
            .contactsState.digitalAddresses.filter(
              (addr) => addr.addressType === AddressType.COURTESY
            )
        ).toStrictEqual([]);
      });
      // simulate rerendering due to redux changes
      result.rerender(<CourtesyContactItem type={ChannelType.EMAIL} value="" />);
      await waitFor(() => {
        const input = result.container.querySelector(`[name="email"]`);
        expect(input).toBeInTheDocument();
        expect(result.container).not.toHaveTextContent('');
      });
    });
  });
});
