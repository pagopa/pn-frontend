import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PGEventsType } from '../../../models/PGEventsType';
import { errorTrackingConfigs } from '../errorEvents';

describe('errorTrackingConfigs', () => {
  it('should build SEND_PG_TOAST_ERROR event', () => {
    const result = errorTrackingConfigs[PGEventsType.SEND_PG_TOAST_ERROR]({
      reason: 'PN_ERROR',
      traceid: 'trace-id',
      action: 'getReceivedNotification',
      httpStatusCode: 500,
      message: 'Error details',
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        reason: 'PN_ERROR',
        traceid: 'trace-id',
        action: 'getReceivedNotification',
        httpStatusCode: 500,
        message: 'Error details',
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
      },
    });
  });
});
