import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { internationalPhonePrefix } from '../../../utility/contacts.utility';
import SmsContactItem from '../SmsContactItem';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const defaultAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
);

describe('test SmsContactItem', () => {
  let mock: MockAdapter;
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
    const { container } = render(<SmsContactItem />);
    expect(container).toHaveTextContent('courtesy-contacts.sms-title');
    expect(container).toHaveTextContent('courtesy-contacts.sms-description');
    const form = container.querySelector('form');
    const input = form!.querySelector(`[name="default_sms"]`);
    // add invalid values
    fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
    await waitFor(() => {
      expect(input!).toHaveValue(INPUT_INVALID_PHONE);
    });
    const errorMessage = form!.querySelector(`#default_sms-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');
    const buttons = form!.querySelectorAll('button');
    expect(buttons[0]).toBeEnabled();
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => {
      expect(input!).toHaveValue('');
    });
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');
  });

  it('type in an invalid number while in "edit mode"', async () => {
    const { container, getByRole } = render(<SmsContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const form = container.querySelector('form');
    const phoneValue = getById(form!, 'default_sms-typography');
    expect(phoneValue).toHaveTextContent(defaultAddress?.value!);
    const editButton = getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = container.querySelector(`[name="default_sms"]`);
    const saveButton = getByRole('button', { name: 'button.conferma' });
    expect(input).toHaveValue(defaultAddress?.value!.replace(internationalPhonePrefix, ''));
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
    await waitFor(() => {
      expect(input).toHaveValue(INPUT_INVALID_PHONE);
    });
    expect(saveButton).toBeDisabled();
    const inputError = container.querySelector(`#default_sms-helper-text`);
    expect(inputError).toHaveTextContent('courtesy-contacts.valid-sms');
  });

  it('add new phone number', async () => {
    const phoneValue = '3333333333';
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + phoneValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(<SmsContactItem />);
    // insert new phone
    const form = result.container.querySelector('form');
    const input = form!.querySelector(`[name="default_sms"]`);
    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => expect(input!).toHaveValue(phoneValue));
    const errorMessage = form?.querySelector('#default_sms-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByTestId('default_sms-button');
    expect(button).toBeEnabled();
    fireEvent.click(button);
    // Confirms the disclaimer dialog
    /* const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    fireEvent.click(disclaimerCheckbox);
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    fireEvent.click(disclaimerConfirmButton); */
    const informativeDialog = await waitFor(() => result.getByTestId('informativeDialog'));
    expect(informativeDialog).toBeInTheDocument();
    const understandButton = result.getByTestId('understandButton');
    expect(understandButton).toBeInTheDocument();
    fireEvent.click(understandButton);
    await waitFor(() => {
      expect(informativeDialog).not.toBeVisible();
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultAddress,
        senderName: undefined,
        value: internationalPhonePrefix + phoneValue,
      },
    ]);
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    const smsValue = getById(form!, 'default_sms-typography');
    expect(smsValue).toBeInTheDocument();
    expect(smsValue).toHaveTextContent(internationalPhonePrefix + phoneValue);
    const editButton = getById(form!, 'modifyContact-default_sms');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default_sms');
    expect(deleteButton).toBeInTheDocument();
  });

  it('override an existing phone number with a new one', async () => {
    const phoneValue = '3333333334';
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + phoneValue,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<SmsContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    // edit value
    const form = result.container.querySelector('form');
    let smsValue = getById(form!, 'default_sms-typography');
    expect(smsValue).toHaveTextContent(defaultAddress!.value);
    let editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector(`[name="default_sms"]`);
    const saveButton = result.getByRole('button', { name: 'button.conferma' });
    expect(input).toHaveValue(defaultAddress!.value.replace(internationalPhonePrefix, ''));
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => {
      expect(input!).toHaveValue(phoneValue);
    });
    // confirm new value
    fireEvent.click(saveButton);
    // Confirms the disclaimer dialog
    /* const disclaimerCheckbox = await waitFor(() => result.getByTestId('disclaimer-checkbox'));
    fireEvent.click(disclaimerCheckbox);
    const disclaimerConfirmButton = result.getByTestId('disclaimer-confirm-button');
    fireEvent.click(disclaimerConfirmButton); */
    const informativeDialog = await waitFor(() => result.getByTestId('informativeDialog'));
    expect(informativeDialog).toBeInTheDocument();
    const understandButton = result.getByTestId('understandButton');
    expect(understandButton).toBeInTheDocument();
    fireEvent.click(understandButton);
    await waitFor(() => {
      expect(informativeDialog).not.toBeVisible();
    });
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: internationalPhonePrefix + phoneValue,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    ).toStrictEqual([
      {
        ...defaultAddress,
        senderName: undefined,
        value: internationalPhonePrefix + phoneValue,
      },
    ]);
    // whait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    smsValue = getById(form!, 'default_sms-typography');
    expect(smsValue).toBeInTheDocument();
    expect(smsValue).toHaveTextContent(internationalPhonePrefix + phoneValue);
    editButton = getById(form!, 'modifyContact-default_sms');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default_sms');
    expect(deleteButton).toBeInTheDocument();
  });

  it('delete phone number', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
    // render component
    const result = render(<SmsContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
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
    // whait rerendering due to redux changes
    await waitFor(() => {
      const input = result.container.querySelector(`[name="default_sms"]`);
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent('');
    });
  });
});
