import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';

import { act, fireEvent, render, waitFor } from '../../../../__test__/test-utils';
import { apiClient } from '../../../../api/apiClients';
import { OnboardingAvailableFlows } from '../../../../models/Onboarding';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import EmailStep from '../EmailStep';

vi.mock('../../../../utility/MixpanelUtils/PFEventStrategyFactory', () => ({
  default: { triggerEvent: vi.fn() },
}));

describe('EmailStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.email';
  const mockEmail = 'test@mock.pagopa.it';
  const updatedEmail = 'updated@mock.pagopa.it';

  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
  });

  const createProps = () => ({
    value: undefined,
    alreadySet: false,
    onChange: vi.fn(),
    onVerified: vi.fn(),
  });

  it('renders the entry state when no email is available', () => {
    const props = createProps();

    const { getByText, getByLabelText, getByRole, queryByRole } = render(<EmailStep {...props} />);

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByLabelText(`${labelPrefix}.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.verify-cta` })).toBeInTheDocument();
    expect(queryByRole('button', { name: 'button.modifica' })).not.toBeInTheDocument();
  });

  it('shows a validation error when the email is invalid', async () => {
    const props = createProps();

    const { getByLabelText, getByRole, findByText } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: 'abc' },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    expect(await findByText('courtesy-contacts.valid-email')).toBeInTheDocument();
    expect(props.onChange).not.toHaveBeenCalled();
    expect(props.onVerified).not.toHaveBeenCalled();
    expect(PFEventStrategyFactory.triggerEvent).not.toHaveBeenCalled();
  });

  it('verifies a new email and calls onChange and onVerified on success', async () => {
    const props = createProps();

    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, {
      result: 'OK',
    });

    const { getByLabelText, getByRole } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: mockEmail,
      });
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(mockEmail);
      expect(props.onVerified).toHaveBeenCalledTimes(1);
    });

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_VERIFICATION,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE, event_type: EventAction.CONFIRM }
    );
  });

  it('fires SEND_ONBOARDING_EMAIL_OTP when the API requires code verification', async () => {
    const props = createProps();

    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, {
      result: 'CODE_VERIFICATION_REQUIRED',
    });

    const { getByLabelText, getByRole, findByRole } = render(<EmailStep {...props} />);

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: `${labelPrefix}.verify-cta` }));
    });

    await findByRole('dialog');

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_VERIFICATION,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_OTP,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE, event_type: EventAction.SCREEN_VIEW }
    );
  });

  it('renders the readonly summary when a new email has already been added during the wizard', () => {
    const props = createProps();

    const { getByText, queryByRole } = render(
      <EmailStep {...props} value={mockEmail} alreadySet={false} />
    );

    expect(getByText(`${labelPrefix}.title-existing`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.label`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(queryByRole('button', { name: 'button.modifica' })).not.toBeInTheDocument();
  });

  it('renders an existing email in editable mode and enters edit state', async () => {
    const props = createProps();

    const { getByText, getByRole, getByLabelText } = render(
      <EmailStep {...props} value={mockEmail} alreadySet />
    );

    expect(getByText(`${labelPrefix}.title-existing`)).toBeInTheDocument();
    expect(getByText(mockEmail)).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.modifica' })).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    expect(getByLabelText(`${labelPrefix}.input-label`)).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.conferma' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'button.annulla' })).toBeInTheDocument();
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_EDITING,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
  });

  it('closes edit mode without API calls when confirming the same existing email', async () => {
    const props = createProps();

    const { getByRole, getByLabelText, queryByLabelText } = render(
      <EmailStep {...props} value={mockEmail} alreadySet />
    );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: mockEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    await waitFor(() => {
      expect(queryByLabelText(`${labelPrefix}.input-label`)).not.toBeInTheDocument();
    });

    expect(props.onChange).not.toHaveBeenCalled();
    expect(props.onVerified).not.toHaveBeenCalled();
    expect(mock.history.post).toHaveLength(0);
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_EDITING,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_CONFIRMED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(PFEventStrategyFactory.triggerEvent).not.toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED,
      expect.anything()
    );
  });

  it('verifies an edited existing email and calls onChange on success', async () => {
    const props = createProps();

    mock.onPost('/bff/v1/addresses/COURTESY/default/EMAIL').reply(200, {
      result: 'OK',
    });

    const { getByRole, getByLabelText } = render(
      <EmailStep {...props} value={mockEmail} alreadySet />
    );

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.modifica' }));
    });

    await act(async () => {
      fireEvent.change(getByLabelText(`${labelPrefix}.input-label`), {
        target: { value: updatedEmail },
      });
    });

    await act(async () => {
      fireEvent.click(getByRole('button', { name: 'button.conferma' }));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: updatedEmail,
      });
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(updatedEmail);
      expect(props.onVerified).not.toHaveBeenCalled();
    });

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_EDITING,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_CONFIRMED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_EMAIL_ACTIVATED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE, event_type: EventAction.CONFIRM }
    );
  });
});
