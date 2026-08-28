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
import PecStep from '../../PecStep';

describe('PecStep - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;

  const mockPec = 'test@pec.mock.pagopa.it';
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
    pec: { value: undefined as string | undefined, alreadySet: false, isValid: undefined },
    email: { value: undefined as string | undefined, alreadySet: false },
    showOptionalEmail: false,
    onPecChange: vi.fn(),
    onEmailChange: vi.fn(),
    onShowOptionalEmail: vi.fn(),
    registerContinueHandler: vi.fn(),
  });

  it('fires SEND_ONBOARDING_PEC_VERIFICATION when verify is clicked with a valid PEC', async () => {
    mock.onPost('/bff/v1/addresses/LEGAL/default/PEC').reply(200, { result: 'OK', pecValid: true });

    const props = createProps();
    const { getByLabelText, getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.pec.input-label'), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox'));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.pec.verify-cta' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_PEC_VERIFICATION,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_PEC_ACTIVATED when the PEC is verified successfully', async () => {
    mock.onPost('/bff/v1/addresses/LEGAL/default/PEC').reply(200, { result: 'OK', pecValid: true });

    const props = createProps();
    const { getByLabelText, getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.pec.input-label'), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox'));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.pec.verify-cta' }));
    });

    await waitFor(() => {
      expect(props.onPecChange).toHaveBeenCalled();
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_PEC_ACTIVATED, {
      ...basePayload,
      event_type: EventAction.CONFIRM,
    });
  });

  it('fires SEND_ONBOARDING_PEC_OTP when the API requires code verification for PEC', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const props = createProps();
    const { getByLabelText, getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.pec.input-label'), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox'));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.pec.verify-cta' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_PEC_OTP, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_PEC_OTP_VERIFICATION when the PEC OTP code is confirmed', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC')
      .reply(200, { result: 'CODE_VERIFICATION_REQUIRED' });

    const props = createProps();
    const { getByLabelText, getByRole, getByTestId } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText('onboarding.digital-domicile.pec.input-label'), {
        target: { value: mockPec },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('checkbox'));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.pec.verify-cta' }));
    });

    const dialog = await waitFor(() => getByTestId('codeDialog'));
    const codeInput = within(dialog).getByRole('textbox');
    codeInput.focus();
    await userEvent.keyboard('01234');

    mock.onPost('/bff/v1/addresses/LEGAL/default/PEC').reply(200, { result: 'OK', pecValid: true });

    const confirmButton = within(dialog).getByTestId('codeConfirmButton');
    await userEvent.click(confirmButton);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_PEC_OTP_VERIFICATION,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_SELECTED when the optional email section is expanded', async () => {
    const props = { ...createProps(), showOptionalEmail: false };
    const { getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'onboarding.digital-domicile.pec.email-cta' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_SELECTED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_ACTIVATION_CANCELED when the optional email section is collapsed', async () => {
    const props = { ...createProps(), showOptionalEmail: true };
    const { getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.click(
        getByRole('button', { name: 'onboarding.digital-domicile.pec.cancel-email-cta' })
      );
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATION_CANCELED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_VERIFICATION when verify is clicked with a valid email in the optional email section', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, { result: 'OK' });

    const props = { ...createProps(), showOptionalEmail: true };
    const { getByLabelText, getByRole } = render(<PecStep {...props} />);

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

  it('fires SEND_ONBOARDING_EMAIL_EDITING when edit button is clicked on an existing optional email', async () => {
    const props = {
      ...createProps(),
      email: { value: mockEmail, alreadySet: true },
      showOptionalEmail: true,
    };
    const { getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_EDITING,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_CONFIRMED when edit is confirmed on the optional email', async () => {
    const props = {
      ...createProps(),
      email: { value: mockEmail, alreadySet: true },
      showOptionalEmail: true,
    };
    const { getByRole } = render(<PecStep {...props} />);

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_CONFIRMED,
      basePayload
    );
  });
});
