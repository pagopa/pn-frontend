import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';
import userEvent from '@testing-library/user-event';

import {
  PFTriggerEventSpy,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../../../../__test__/test-utils';
import { apiClient } from '../../../../../../api/apiClients';
import { OnboardingAvailableFlows } from '../../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import EmailSmsStep from '../../EmailSmsStep';

describe('EmailSmsStep - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;

  const mockEmail = 'test@mock.pagopa.it';
  const mockPhone = '3331234567';
  const basePayload = { onboarding_selected_flow: OnboardingAvailableFlows.COURTESY };

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

  const createProps = (ioEnabled = false) => ({
    ioEnabled,
    email: { value: undefined as string | undefined, alreadySet: false },
    sms: { value: undefined as string | undefined, alreadySet: false },
    onContactAdded: vi.fn(),
    registerContinueHandler: vi.fn(),
  });

  it('fires SEND_ONBOARDING_EMAIL_SMS_ACTIVATION on mount', () => {
    render(<EmailSmsStep {...createProps()} />);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_SMS_ACTIVATION,
      {
        ...basePayload,
        event_type: EventAction.SCREEN_VIEW,
        email_value: undefined,
        sms_value: undefined,
      }
    );
  });

  it('fires SEND_ONBOARDING_SMS_SELECTED when the SMS section is expanded', () => {
    const { getByRole } = render(<EmailSmsStep {...createProps(true)} />);

    fireEvent.click(
      getByRole('button', { name: 'onboarding.courtesy.sms.collapsed.button-label' })
    );

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SMS_SELECTED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_SMS_ACTIVATION_CANCELED when the SMS section is collapsed', async () => {
    const { getByRole } = render(<EmailSmsStep {...createProps(true)} />);

    // First expand SMS
    fireEvent.click(
      getByRole('button', { name: 'onboarding.courtesy.sms.collapsed.button-label' })
    );

    // Then collapse it
    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.courtesy.sms.insert.collapse-label' })
      );
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SMS_ACTIVATION_CANCELED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_VERIFICATION when verify is clicked with a valid email', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, { result: 'OK' });

    const { getByLabelText, getByRole } = render(<EmailSmsStep {...createProps()} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.email.insert.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.courtesy.email.insert.button-label' })
      );
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_VERIFICATION,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_ACTIVATED when the email is verified successfully', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, { result: 'OK' });

    const props = createProps();
    const { getByLabelText, getByRole } = render(<EmailSmsStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.email.insert.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.courtesy.email.insert.button-label' })
      );
    });

    await waitFor(() => {
      expect(props.onContactAdded).toHaveBeenCalledWith('email', mockEmail);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED, {
      ...basePayload,
      event_type: EventAction.CONFIRM,
    });
  });

  it('fires SEND_ONBOARDING_EMAIL_OTP when the API requires code verification for email', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { getByLabelText, getByRole } = render(<EmailSmsStep {...createProps()} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.email.insert.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.courtesy.email.insert.button-label' })
      );
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EMAIL_OTP, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_SMS_VERIFICATION when verify is clicked with a valid phone number', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/SMS').reply(200, { result: 'OK' });

    // SMS starts in insert mode when ioEnabled=false
    const { getByLabelText, getByRole } = render(<EmailSmsStep {...createProps(false)} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.sms.insert.input-label'), {
        target: { value: mockPhone },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.sms.insert.button-label' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SMS_VERIFICATION,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_SMS_OTP when the API requires code verification for SMS', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { getByLabelText, getByRole } = render(<EmailSmsStep {...createProps(false)} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.sms.insert.input-label'), {
        target: { value: mockPhone },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.sms.insert.button-label' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_SMS_OTP, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_SMS_OTP_VERIFICATION when the SMS OTP code is confirmed', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/SMS')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const { getByLabelText, getByRole, getByTestId } = render(
      <EmailSmsStep {...createProps(false)} />
    );

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.sms.insert.input-label'), {
        target: { value: mockPhone },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.sms.insert.button-label' }));
    });

    const dialog = await waitFor(() => getByTestId('codeDialog'));
    const codeInput = within(dialog).getByRole('textbox');
    codeInput.focus();
    await userEvent.keyboard('01234');

    mock.onPost('/bff/v1/addresses/COURTESY/default/SMS').reply(200, { result: 'OK' });

    const dialogButtons = dialog.querySelectorAll('button');
    await userEvent.click(dialogButtons[1]);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_SMS_OTP_VERIFICATION,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_SMS_ACTIVATED when the phone number is verified successfully', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/SMS').reply(200, { result: 'OK' });

    const props = createProps(false);
    const { getByLabelText, getByRole } = render(<EmailSmsStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.courtesy.sms.insert.input-label'), {
        target: { value: mockPhone },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.sms.insert.button-label' }));
    });

    await waitFor(() => {
      expect(props.onContactAdded).toHaveBeenCalled();
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_SMS_ACTIVATED, {
      ...basePayload,
      event_type: EventAction.CONFIRM,
    });
  });
});
