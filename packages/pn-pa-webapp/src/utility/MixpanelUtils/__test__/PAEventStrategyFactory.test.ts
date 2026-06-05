import { notificationsDTO } from '../../../__mocks__/Notifications.mock';
import type { PAEventPayloads } from '../../../models/PAEventPayloads';
import { PAEventsType } from '../../../models/PAEventsType';
import PAEventStrategyFactory from '../PAEventStrategyFactory';
import { getPATrackingConfig } from '../trackingRegistry';

describe('PAEventStrategyFactory', () => {
  it('should build a tracking event with payload through the strategy adapter', () => {
    const eventType = PAEventsType.SEND_PA_NOTIFICATIONS;
    const payload: PAEventPayloads[PAEventsType.SEND_PA_NOTIFICATIONS] = {
      notifications: notificationsDTO.resultsPage,
      pageNumber: 0,
    };

    const strategy = PAEventStrategyFactory.getStrategy(eventType);
    const trackingConfig = getPATrackingConfig(eventType);

    expect(strategy).not.toBeNull();
    expect(trackingConfig).toBeDefined();
    expect(strategy?.performComputations(payload)).toStrictEqual(trackingConfig?.(payload));
  });

  it('should build a tracking event without payload through the strategy adapter', () => {
    const eventType = PAEventsType.SEND_PA_ADD_API_START;

    const strategy = PAEventStrategyFactory.getStrategy(eventType);
    const trackingConfig = getPATrackingConfig(eventType);

    expect(strategy).not.toBeNull();
    expect(trackingConfig).toBeDefined();
    expect(strategy?.performComputations(undefined)).toStrictEqual(trackingConfig?.(undefined));
  });

  it('should return null when the event type is not configured', () => {
    const strategy = PAEventStrategyFactory.getStrategy('UNKNOWN_EVENT' as PAEventsType);

    expect(strategy).toBeNull();
  });
});
