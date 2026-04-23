import { vi } from 'vitest';

import { EventAction } from '@pagopa-pn/pn-commons';

import { fireEvent, render } from '../../../../__test__/test-utils';
import { OnboardingAvailableFlows } from '../../../../models/Onboarding';
import { PFEventsType } from '../../../../models/PFEventsType';
import { AddressType, ChannelType, IOContactStatus } from '../../../../models/contacts';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import OnboardingHome from '../OnboardingHome';

vi.mock('../../../../utility/MixpanelUtils/PFEventStrategyFactory', () => ({
  default: { triggerEvent: vi.fn() },
}));

describe('OnboardingHome - Mixpanel events', () => {
  const preloadedState = {
    contactsState: { digitalAddresses: [] },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fires SEND_ONBOARDING_START_FLOW on mount', () => {
    render(<OnboardingHome />, { preloadedState });

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_START_FLOW,
      { event_type: EventAction.SCREEN_VIEW }
    );
  });

  it('fires SEND_ONBOARDING_FLOW_SELECTED with DIGITAL_DOMICILE when clicking the SEND card', () => {
    const { getByRole } = render(<OnboardingHome />, { preloadedState });
    vi.clearAllMocks();

    fireEvent.click(getByRole('button', { name: 'onboarding.cards.send.cta' }));

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_FLOW_SELECTED,
      { onboarding_selected_flow: OnboardingAvailableFlows.DIGITAL_DOMICILE }
    );
  });

  it('fires SEND_ONBOARDING_FLOW_SELECTED with COURTESY when clicking the contacts card', () => {
    const { getByRole } = render(<OnboardingHome />, { preloadedState });
    vi.clearAllMocks();

    fireEvent.click(getByRole('button', { name: 'onboarding.cards.contacts.cta' }));

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_FLOW_SELECTED,
      { onboarding_selected_flow: OnboardingAvailableFlows.COURTESY }
    );
  });

  it('fires SEND_ONBOARDING_FLOW_SELECTED with IO when clicking the IO card', () => {
    const { getByRole } = render(<OnboardingHome />, { preloadedState });
    vi.clearAllMocks();

    fireEvent.click(getByRole('button', { name: 'onboarding.cards.io.cta' }));

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_FLOW_SELECTED,
      { onboarding_selected_flow: OnboardingAvailableFlows.IO }
    );
  });

  it('fires SEND_ONBOARDING_DECLINED when clicking the exit flow button', () => {
    const { getByRole } = render(<OnboardingHome />, { preloadedState });
    vi.clearAllMocks();

    fireEvent.click(getByRole('button', { name: 'onboarding.exit-flow' }));

    expect(PFEventStrategyFactory.triggerEvent).toHaveBeenCalledWith(
      PFEventsType.SEND_ONBOARDING_DECLINED,
      { event_type: EventAction.EXIT }
    );
  });

  it('does not show the IO card when IO is already enabled', () => {
    const { queryByRole } = render(<OnboardingHome />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOContactStatus.ENABLED,
            },
          ],
        },
      },
    });

    expect(queryByRole('button', { name: 'onboarding.cards.io.cta' })).not.toBeInTheDocument();
  });
});
