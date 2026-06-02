import { vi } from 'vitest';

import { DeliveryOutcomeType, EventAction } from '@pagopa-pn/pn-commons';

import { PFTriggerEventSpy, fireEvent, render } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import { NotificationCostBanner } from '../../NotificationCostBanner';

describe('NotificationCostBanner component - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_BANNER on mount', () => {
    render(<NotificationCostBanner deliveryOutcome={null} />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_BANNER,
      expect.objectContaining({ event_type: EventAction.SCREEN_VIEW })
    );
  });

  it('fires SEND_TAP_BANNER when CTA is clicked', () => {
    const deliveryOutcome = { type: DeliveryOutcomeType.ANALOG } as any;
    const { getByText } = render(<NotificationCostBanner deliveryOutcome={deliveryOutcome} />, {
      preloadedState: { contactsState: { digitalAddresses: [] } },
    });
    fireEvent.click(getByText('notification-cost-banner.enable-sercq.cta'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_TAP_BANNER,
      expect.objectContaining({ event_type: EventAction.ACTION })
    );
  });
});
