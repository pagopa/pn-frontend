import { vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';

import { PFTriggerEventSpy, fireEvent, render } from '../../../../../__test__/test-utils';
import { OnboardingAvailableFlows } from '../../../../../models/Onboarding';
import { PFEventsType } from '../../../../../models/PFEventsType';
import { AddressType, ChannelType, IOAllowedValues } from '../../../../../models/contacts';
import PFEventStrategyFactory from '../../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import OnboardingHome from '../../OnboardingHome';

describe('OnboardingHome - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  const emptyContactsState = { contactsState: { digitalAddresses: [] } };

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_ONBOARDING_START_FLOW on mount', () => {
    render(<OnboardingHome />, { preloadedState: emptyContactsState });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_START_FLOW, {
      event_type: EventAction.SCREEN_VIEW,
    });
  });

  it('fires SEND_ONBOARDING_FLOW_SELECTED with DIGITAL_DOMICILE when that card CTA is clicked', () => {
    const { getByTestId } = render(<OnboardingHome />, { preloadedState: emptyContactsState });

    fireEvent.click(
      getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.DIGITAL_DOMICILE}`)
    );

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_FLOW_SELECTED, {
      onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE,
    });
  });

  it('fires SEND_ONBOARDING_FLOW_SELECTED with COURTESY when that card CTA is clicked', () => {
    const { getByTestId } = render(<OnboardingHome />, { preloadedState: emptyContactsState });

    fireEvent.click(getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.COURTESY}`));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_FLOW_SELECTED, {
      onboarding_selected_flow: OnboardingAvailableFlows.COURTESY,
    });
  });

  it('fires SEND_ONBOARDING_FLOW_SELECTED with IO when that card CTA is clicked', () => {
    const { getByTestId } = render(<OnboardingHome />, { preloadedState: emptyContactsState });

    fireEvent.click(getByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.IO}`));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_FLOW_SELECTED, {
      onboarding_selected_flow: OnboardingAvailableFlows.IO,
    });
  });

  it('does not fire SEND_ONBOARDING_FLOW_SELECTED with IO when IO is already enabled', () => {
    const { queryByTestId } = render(<OnboardingHome />, {
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

    expect(
      queryByTestId(`onboarding-card-cta-${OnboardingAvailableFlows.IO}`)
    ).not.toBeInTheDocument();
  });

  it('fires SEND_ONBOARDING_DECLINED when the exit button is clicked', () => {
    const { getByRole } = render(<OnboardingHome />, { preloadedState: emptyContactsState });

    fireEvent.click(getByRole('button', { name: 'onboarding.exit-flow' }));

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_ONBOARDING_DECLINED, {
      event_type: EventAction.EXIT,
    });
  });
});
