import MockAdapter from 'axios-mock-adapter';
import { MockInstance, vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';

import { act, fireEvent, render, waitFor } from '../../../../../__test__/test-utils';
import { apiClient } from '../../../../../api/apiClients';
import { OnboardingAvailableFlows, OnboardingScreen } from '../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../models/PFEventsType';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../../models/contacts';
import PFEventStrategyFactory from '../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import IoActivationWizard from '../../IoActivationWizard';

describe('IoActivationWizard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  const basePayload = { onboarding_selected_flow: OnboardingAvailableFlows.IO };

  const disabledIoState = {
    contactsState: {
      digitalAddresses: [
        {
          addressType: AddressType.COURTESY,
          senderId: 'default',
          channelType: ChannelType.IOMSG,
          value: IOAllowedValues.DISABLED,
        },
      ],
    },
  };

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_ONBOARDING_IO_DOWNLOAD on mount when IO is not installed', () => {
    render(<IoActivationWizard />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.IO,
    });
  });

  it('fires SEND_ONBOARDING_IO_ACTIVATION on mount when IO is installed but disabled', () => {
    render(<IoActivationWizard />, { preloadedState: disabledIoState });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_IO_ACTIVATION, {
      event_type: EventAction.SCREEN_VIEW,
      onboarding_selected_flow: OnboardingAvailableFlows.IO,
    });
  });

  it('fires SEND_ONBOARDING_UX_SUCCESS when IO is enabled and the feedback step is reached', async () => {
    mock.onPost('/bff/v1/addresses/COURTESY/default/APPIO').reply(200, { result: 'OK' });

    const { getByTestId, findByText } = render(<IoActivationWizard />, {
      preloadedState: disabledIoState,
    });

    await act(async () => {
      fireEvent.click(getByTestId('io-primary-button'));
    });

    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
    });

    await findByText('onboarding.io-activation.feedback.title');

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_UX_SUCCESS, {
      ...basePayload,
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_EXIT_SELECTED with IO screen when the exit button is clicked', () => {
    const { getByTestId } = render(<IoActivationWizard />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });

    fireEvent.click(getByTestId('exit-button'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EXIT_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.IO,
    });
  });
});
