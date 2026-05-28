import { MockInstance, vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor } from '../../../../../../__test__/test-utils';
import { OnboardingAvailableFlows, OnboardingScreen } from '../../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../../models/PFEventsType';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../../../models/contacts';
import PFEventStrategyFactory from '../../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import OnboardingCourtesyWizard from '../../OnboardingCourtesyWizard';

describe('OnboardingCourtesyWizard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  const basePayload = { onboarding_selected_flow: OnboardingAvailableFlows.COURTESY };

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

  const enabledIoWithEmailState = {
    contactsState: {
      digitalAddresses: [
        {
          addressType: AddressType.COURTESY,
          senderId: 'default',
          channelType: ChannelType.IOMSG,
          value: IOAllowedValues.ENABLED,
        },
        {
          addressType: AddressType.COURTESY,
          senderId: 'default',
          channelType: ChannelType.EMAIL,
          value: 'test@mock.pagopa.it',
        },
      ],
    },
  };

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.clearAllMocks();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_ONBOARDING_EXIT_SELECTED with IO screen when exit is clicked on the IO step', () => {
    const { getByTestId } = render(<OnboardingCourtesyWizard />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });

    fireEvent.click(getByTestId('exit-button'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EXIT_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.IO,
    });
  });

  it('fires SEND_ONBOARDING_CONTINUE_SELECTED and SEND_ONBOARDING_IO_DOWNLOAD_DECLINED when "proceed without IO" is clicked', () => {
    const { getByRole } = render(<OnboardingCourtesyWizard />, {
      preloadedState: disabledIoState,
    });

    fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.proceed-without-io' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_CONTINUE_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.IO,
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_IO_DOWNLOAD_DECLINED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_CONTINUE_SELECTED and SEND_ONBOARDING_IO_CONFIRMED when IO is enabled and continue is clicked', () => {
    const { getByRole } = render(<OnboardingCourtesyWizard />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
          ],
        },
      },
    });

    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_CONTINUE_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.IO,
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_IO_CONFIRMED,
      basePayload
    );
  });

  it('fires SEND_ONBOARDING_BACK_SELECTED when back is clicked on the email/sms step', () => {
    const { getByRole, getByTestId } = render(<OnboardingCourtesyWizard />, {
      preloadedState: disabledIoState,
    });

    fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.proceed-without-io' }));

    triggerEventSpy.mockClear();

    fireEvent.click(getByTestId('prev-button'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_BACK_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.EMAIL_SMS,
    });
  });

  it('fires SEND_ONBOARDING_EXIT_SELECTED with EMAIL_SMS screen when exit is clicked on the email/sms step', () => {
    const { getByRole, getByTestId } = render(<OnboardingCourtesyWizard />, {
      preloadedState: disabledIoState,
    });

    fireEvent.click(getByRole('button', { name: 'onboarding.courtesy.proceed-without-io' }));

    triggerEventSpy.mockClear();

    fireEvent.click(getByTestId('exit-button'));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_EXIT_SELECTED, {
      ...basePayload,
      screen: OnboardingScreen.EMAIL_SMS,
    });
  });

  it('fires SEND_ONBOARDING_UX_SUCCESS when the feedback step is reached', async () => {
    const { getByRole, getByTestId } = render(<OnboardingCourtesyWizard />, {
      preloadedState: enabledIoWithEmailState,
    });

    // IO step → continue (IO is enabled)
    fireEvent.click(getByRole('button', { name: 'button.continue' }));

    // Email/SMS step → confirm (email already set)
    await waitFor(() => {
      fireEvent.click(getByTestId('next-button'));
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_UX_SUCCESS, {
        ...basePayload,
        event_type: EventAction.SCREEN_VIEW,
      });
    });
  });
});
