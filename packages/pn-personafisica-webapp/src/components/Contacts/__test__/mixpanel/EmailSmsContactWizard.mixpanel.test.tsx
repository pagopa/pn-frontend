import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { AddressType, ChannelType } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { internationalPhonePrefix } from '../../../../utility/contacts.utility';
import EmailSmsContactWizard from '../../EmailSmsContactWizard';
import { fillCodeDialog } from '../test-utils';

const existingEmail = [
  { addressType: AddressType.COURTESY, senderId: 'default', channelType: ChannelType.EMAIL, value: 'nome.utente@mail.it' },
];

const existingSms = [
  { addressType: AddressType.COURTESY, senderId: 'default', channelType: ChannelType.SMS, value: '+393333333333' },
];

describe('EmailSmsContactWizard - Mixpanel events', () => {
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
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ADD_SERCQ_SEND_EMAIL_SMS on mount', () => {
    render(<EmailSmsContactWizard />);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_SMS,
      expect.objectContaining({ event_type: expect.any(String) })
    );
  });

  it('fires SEND_ADD_SERCQ_SEND_ADD_EMAIL_START and SEND_ADD_SERCQ_SEND_EMAIL_OTP when email is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'test@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<EmailSmsContactWizard />);
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'test@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_START,
        expect.objectContaining({ email_validation: expect.any(String) })
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_EMAIL_OTP);
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION and SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS on email OTP flow', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'test@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'test@mail.it', verificationCode: '01234' })
      .reply(204);

    const result = render(<EmailSmsContactWizard />);
    const { container, getByRole } = result;
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'test@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_CONVERSION,
        'default'
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_UX_SUCCESS
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_ADD_EMAIL_BACK when email code dialog is closed', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL', { value: 'test@mail.it' })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<EmailSmsContactWizard />);
    fireEvent.change(getById(container, 'default_email'), { target: { value: 'test@mail.it' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-add' }));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    fireEvent.click(getByRole('button', { name: 'button.annulla' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_EMAIL_BACK);
  });

  it('fires SEND_ADD_SERCQ_SEND_CHANGE_EMAIL when edit is clicked on existing email', () => {
    const { container } = render(<EmailSmsContactWizard />, {
      preloadedState: { contactsState: { digitalAddresses: existingEmail } },
    });
    fireEvent.click(getById(container, 'modifyContact-default_email'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_CHANGE_EMAIL);
  });

  it('fires SEND_ADD_SERCQ_SEND_ADD_SMS_START and SEND_ADD_SERCQ_SEND_SMS_OTP when SMS is submitted', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: `${internationalPhonePrefix}3331234567`,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<EmailSmsContactWizard />, {
      route: '/recapiti/domicilio-digitale/attivazione',
    });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));
    await waitFor(() => expect(getById(container, 'default_sms')).toBeInTheDocument());
    fireEvent.change(getById(container, 'default_sms'), { target: { value: '3331234567' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.sms-add' }));

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_START,
        expect.objectContaining({ sms_validation: expect.any(String) })
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_SMS_OTP);
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_ADD_SMS_UX_CONVERSION and SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS on SMS OTP flow', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: `${internationalPhonePrefix}3331234567`,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: `${internationalPhonePrefix}3331234567`,
        verificationCode: '01234',
      })
      .reply(204);

    const result = render(<EmailSmsContactWizard />, {
      route: '/recapiti/domicilio-digitale/attivazione',
    });
    const { container, getByRole } = result;
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));
    await waitFor(() => expect(getById(container, 'default_sms')).toBeInTheDocument());
    fireEvent.change(getById(container, 'default_sms'), { target: { value: '3331234567' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.sms-add' }));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    await fillCodeDialog(result);

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_CONVERSION
      );
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_UX_SUCCESS
      );
    });
  });

  it('fires SEND_ADD_SERCQ_SEND_ADD_SMS_BACK when SMS code dialog is closed', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS', {
        value: `${internationalPhonePrefix}3331234567`,
      })
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { container, getByRole } = render(<EmailSmsContactWizard />, {
      route: '/recapiti/domicilio-digitale/attivazione',
    });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.email-sms-add' }));
    await waitFor(() => expect(getById(container, 'default_sms')).toBeInTheDocument());
    fireEvent.change(getById(container, 'default_sms'), { target: { value: '3331234567' } });
    fireEvent.click(getByRole('button', { name: 'courtesy-contacts.sms-add' }));

    await waitFor(() => expect(getByRole('dialog')).toBeInTheDocument());
    fireEvent.click(getByRole('button', { name: 'button.annulla' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_ADD_SMS_BACK);
  });

  it('fires SEND_ADD_SERCQ_SEND_CHANGE_SMS when edit is clicked on existing SMS', () => {
    const { container } = render(<EmailSmsContactWizard />, {
      preloadedState: { contactsState: { digitalAddresses: existingSms } },
    });
    fireEvent.click(getById(container, 'modifyContact-default_sms'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ADD_SERCQ_SEND_CHANGE_SMS);
  });
});
