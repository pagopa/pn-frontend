import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalCourtesyAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, testStore, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { internationalPhonePrefix } from '../../../utility/contacts.utility';
import SmsContactItem from '../SmsContactItem';
import { fillCodeDialog } from './test-utils';

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
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('type in an invalid number', async () => {
    // render component
    const { container, getByRole } = render(<SmsContactItem />);

    const addBtn = getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    fireEvent.click(addBtn);

    // check label is visible
    const label = container.querySelector('#default_sms-custom-label');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('courtesy-contacts.sms-to-add');

    const form = container.querySelector('form');
    const input = form!.querySelector(`[name="default_sms"]`);
    expect(input).toBeInTheDocument();

    // add invalid values
    fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });

    await waitFor(() => {
      expect(input!).toHaveValue(INPUT_INVALID_PHONE);
    });

    // check error message
    const errorMessage = container.querySelector(`#default_sms-helper-text`);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');

    // clear and verify the error is still there
    fireEvent.change(input!, { target: { value: '' } });

    await waitFor(() => {
      expect(input!).toHaveValue('');
    });

    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('courtesy-contacts.valid-sms');
  });

  it('type in an invalid number while in "edit mode"', async () => {
    const { container, getByRole } = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    expect(container).toHaveTextContent('courtesy-contacts.sms-title');
    expect(container).toHaveTextContent('status.active');
    expect(container).toHaveTextContent('courtesy-contacts.sms-description');
    const form = container.querySelector('form');
    const phoneValue = getById(form!, 'default_sms-typography');
    expect(phoneValue).toHaveTextContent(defaultAddress?.value!);
    const editButton = getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = container.querySelector(`[name="default_sms"]`);
    const saveButton = getByRole('button', { name: 'button.conferma' });
    expect(input).toHaveValue(defaultAddress?.value.replace(internationalPhonePrefix, ''));
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: INPUT_INVALID_PHONE } });
    await waitFor(() => {
      expect(input).toHaveValue(INPUT_INVALID_PHONE);
    });
    expect(saveButton).toBeEnabled();
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
    const addBtn = result.getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    fireEvent.click(addBtn);

    // insert new phone
    let form = result.container.querySelector('form');
    const input = form!.querySelector(`[name="default_sms"]`);
    expect(input).toBeInTheDocument();

    fireEvent.change(input!, { target: { value: phoneValue } });
    await waitFor(() => expect(input!).toHaveValue(phoneValue));

    const errorMessage = form?.querySelector('#default_sms-helper-text');
    expect(errorMessage).not.toBeInTheDocument();

    const submitButton = result.getByTestId('default_sms-button');
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);

    // Confirms the informative dialog
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

    const addresses = testStore
      .getState()
      .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY);

    expect(addresses).toStrictEqual([
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
    // the component should have been re-rendered, need to take the updated form
    form = result.container.querySelector('form');
    const smsValue = getById(form!, 'default_sms-typography');
    expect(smsValue).toBeInTheDocument();
    expect(smsValue).toHaveTextContent(internationalPhonePrefix + phoneValue);
    const editButton = getById(form!, 'modifyContact-default_sms');
    expect(editButton).toBeInTheDocument();
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
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
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
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
    // Confirms the informative dialog
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
    smsValue = getById(form!, 'default_sms-typography');
    expect(smsValue).toBeInTheDocument();
    expect(smsValue).toHaveTextContent(internationalPhonePrefix + phoneValue);
    editButton = getById(form!, 'modifyContact-default_sms');
    expect(editButton).toBeInTheDocument();
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
  });

  it('delete phone number', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
    // render component
    const result = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    const disableBtn = result.getByRole('button', { name: 'button.disable' });
    expect(disableBtn).toBeInTheDocument();
    // click on cancel
    fireEvent.click(disableBtn);
    let dialog = await waitFor(() => result.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog.querySelectorAll('button');
    // cancel remove operation
    fireEvent.click(dialogButtons[0]);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    // click on confirm
    fireEvent.click(disableBtn);
    dialog = await waitFor(() => result.getByRole('dialog'));
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
    expect(result.container).toHaveTextContent('courtesy-contacts.email-sms-updates');
    expect(result.container).toHaveTextContent('courtesy-contacts.email-sms-add');
  });
});
