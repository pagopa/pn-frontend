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
} from '../../../../../__test__/test-utils';
import { apiClient } from '../../../../../api/apiClients';
import { OnboardingAvailableFlows } from '../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import EmailStep from '../../EmailStep';

describe('EmailStep - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;

  const mockEmail = 'test@mock.pagopa.it';
  const basePayload = { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE };

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

  const createProps = () => ({
    value: undefined as string | undefined,
    alreadySet: false,
    onChange: vi.fn(),
    onVerified: vi.fn(),
  });

  it('fires SEND_ONBOARDING_EMAIL_VERIFICATION when verify is clicked with a valid email', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, { result: 'OK' });

    const props = createProps();
    const { getByLabelText, getByRole } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.email.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.digital-domicile.email.verify-cta' })
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
    const { getByLabelText, getByRole } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.email.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.digital-domicile.email.verify-cta' })
      );
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(mockEmail);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED, {
      ...basePayload,
      event_type: EventAction.CONFIRM,
    });
  });

  it('fires SEND_ONBOARDING_EMAIL_OTP when the API requires code verification', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const props = createProps();
    const { getByLabelText, getByRole } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.email.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.digital-domicile.email.verify-cta' })
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

  it('fires SEND_ONBOARDING_EMAIL_OTP_VERIFICATION when the OTP code is confirmed', async () => {
    mock
      .onPost('/bff/v1/addresses/COURTESY/default/EMAIL')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const props = createProps();
    const { getByLabelText, getByRole, getByTestId } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.email.input-label'), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.digital-domicile.email.verify-cta' })
      );
    });

    const dialog = await waitFor(() => getByTestId('codeDialog'));
    const codeInput = within(dialog).getByRole('textbox');
    codeInput.focus();
    await userEvent.keyboard('01234');

    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, { result: 'OK' });

    const dialogButtons = dialog.querySelectorAll('button');
    await userEvent.click(dialogButtons[1]);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_OTP_VERIFICATION,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_EDITING when edit button is clicked on an existing email', async () => {
    const props = { ...createProps(), value: mockEmail, alreadySet: true };
    const { getByRole } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_EDITING,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_CONFIRMED when edit is confirmed on an existing email', async () => {
    const props = { ...createProps(), value: mockEmail, alreadySet: true };
    const { getByRole } = render(<EmailStep {...props} />);

    // Enter edit mode
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    // Confirm without changing value (no API call needed)
    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_CONFIRMED,
      basePayload
    );
  });
});
