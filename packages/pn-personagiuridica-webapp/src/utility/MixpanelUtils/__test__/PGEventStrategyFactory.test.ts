import { PGEventPayloads } from '../../../models/PGEventPayloads';
import { PGEventsType } from '../../../models/PGEventsType';
import { ChannelType } from '../../../models/contacts';
import PGEventStrategyFactory from '../PGEventStrategyFactory';
import { getPGTrackingConfig } from '../trackingRegistry';

describe('PGEventStrategyFactory', () => {
  it('should build a tracking event with payload through the strategy adapter', () => {
    const eventType = PGEventsType.SEND_PG_YOUR_NOTIFICATION;
    const payload: PGEventPayloads[PGEventsType.SEND_PG_YOUR_NOTIFICATION] = {
      page_number: 1,
      unread_count: 2,
      total_count: 10,
      delivered_count: 3,
      opened_count: 4,
      expired_count: 1,
      not_found_count: 0,
      cancelled_count: 0,
      effective_date_count: 5,
      banner: ChannelType.SERCQ_SEND,
    };

    const strategy = PGEventStrategyFactory.getStrategy(eventType);
    const trackingConfig = getPGTrackingConfig(eventType);

    expect(strategy).not.toBeNull();
    expect(trackingConfig).toBeDefined();
    expect(strategy?.performComputations(payload)).toStrictEqual(trackingConfig?.(payload));
  });

  it('should build a tracking event without payload through the strategy adapter', () => {
    const eventType = PGEventsType.SEND_PG_ADD_MANDATE_START;

    const strategy = PGEventStrategyFactory.getStrategy(eventType);
    const trackingConfig = getPGTrackingConfig(eventType);

    expect(strategy).not.toBeNull();
    expect(trackingConfig).toBeDefined();
    expect(strategy?.performComputations(undefined)).toStrictEqual(trackingConfig?.(undefined));
  });

  it('should return null when the event type is not configured', () => {
    const strategy = PGEventStrategyFactory.getStrategy('UNKNOWN_EVENT' as PGEventsType);

    expect(strategy).toBeNull();
  });
});
