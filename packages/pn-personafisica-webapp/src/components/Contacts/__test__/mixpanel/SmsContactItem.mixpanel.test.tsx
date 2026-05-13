import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { ResponseEventDispatcher } from '@pagopa-pn/pn-commons';

import { digitalCourtesyAddresses } from '../../../../__mocks__/Contacts.mock';
import { fireEvent, render, screen, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { ChannelType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { internationalPhonePrefix } from '../../../../utility/contacts.utility';
import SmsContactItem from '../../SmsContactItem';
import { fillCodeDialog } from '../test-utils';

const VALID_PHONE = '3331234567';
const defaultAddress = digitalCourtesyAddresses.find(
  (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
)!;

describe('SmsContactItem - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  const enterInsertMode = async () => {
    const result = render(<SmsContactItem />);
    const addBtn = result.getByRole('button', { name: 'courtesy-contacts.email-sms-add' });
    fireEvent.click(addBtn);
    return result;
  };

  const submitSms = async (phone = VALID_PHONE) => {
    const result = await enterInsertMode();
    const form = result.container.querySelector('form')!;
    const input = form.querySelector('[name="default_sms"]')!;
    fireEvent.change(input, { target: { value: phone } });
    await waitFor(() => expect(input).toHaveValue(phone));
    fireEvent.click(result.getByTestId('default_sms-button'));
    return result;
  };

  it('fires SEND_ADD_SMS_START when the form is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitSms();
    await waitFor(() => expect(mock.history.post).toHaveLength(1));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SMS_START,
      expect.any(Object)
    );
  });

  it('fires SEND_ADD_SMS_OTP when the code dialog opens', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitSms();
    await waitFor(() =>
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SMS_OTP)
    );
  });

  it('fires SEND_ADD_SMS_UX_CONVERSION when the verification code is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
        verificationCode: '01234',
      })
      .reply(204);
    const result = await submitSms();
    await fillCodeDialog(result);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SMS_UX_CONVERSION, 'default');
  });

  it('fires SEND_ADD_SMS_UX_SUCCESS after the SMS is verified', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
        verificationCode: '01234',
      })
      .reply(204);
    const result = await submitSms();
    await fillCodeDialog(result);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SMS_UX_SUCCESS,
        expect.any(Object)
      );
    });
  });

  it('fires SEND_ADD_SMS_BACK when the code dialog is cancelled', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    await submitSms();
    await waitFor(() => screen.getByRole('dialog'));
    fireEvent.click(screen.getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SMS_BACK);
  });

  it('fires SEND_CHANGE_SMS_START when the edit button is clicked', () => {
    const { container } = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(container.querySelector('#modifyContact-default_sms')!);
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_CHANGE_SMS_START);
  });

  it('fires SEND_CHANGE_SMS_CANCEL when the edit is cancelled', () => {
    const { container } = render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(container.querySelector('#modifyContact-default_sms')!);
    fireEvent.click(screen.getByRole('button', { name: 'button.annulla' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_CHANGE_SMS_CANCEL);
  });

  it('fires SEND_REMOVE_SMS_START and SEND_REMOVE_SMS_POP_UP when the disable button is clicked', () => {
    render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SMS_START,
      expect.any(Object)
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SMS_POP_UP,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_SMS_POP_UP_CANCEL when the delete dialog is cancelled', async () => {
    render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    // DeleteDialog renders secondary first ([0]=cancel) then primary ([1]=confirm)
    fireEvent.click(dialog.querySelectorAll('button')[0]);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_REMOVE_SMS_POP_UP_CANCEL,
      expect.any(Object)
    );
  });

  it('fires SEND_REMOVE_SMS_SUCCESS and SEND_REMOVE_SMS_POP_UP_UX_SUCCESS after SMS is deleted', async () => {
    mock.onDelete('/bff/v1/addresses/COURTESY/default/SMS').reply(204);
    render(<SmsContactItem />, {
      preloadedState: { contactsState: { digitalAddresses: [defaultAddress] } },
    });
    fireEvent.click(screen.getByRole('button', { name: 'button.disable' }));
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    // DeleteDialog renders secondary first ([0]=cancel) then primary ([1]=confirm)
    fireEvent.click(dialog.querySelectorAll('button')[1]);
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_REMOVE_SMS_SUCCESS, 'default');
    });
    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_REMOVE_SMS_POP_UP_UX_SUCCESS,
        expect.any(Object)
      );
    });
  });

  it('fires SEND_ADD_SMS_CODE_ERROR when the verification code call fails', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: internationalPhonePrefix + VALID_PHONE,
        verificationCode: '01234',
      })
      .reply(500);

    const result = render(
      <>
        <ResponseEventDispatcher />
        <SmsContactItem />
      </>
    );

    fireEvent.click(result.getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));
    const input = result.container.querySelector('[name="default_sms"]')!;
    fireEvent.change(input, { target: { value: VALID_PHONE } });
    await waitFor(() => expect(input).toHaveValue(VALID_PHONE));
    fireEvent.click(result.getByTestId('default_sms-button'));

    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SMS_CODE_ERROR);
    });
  });
});
