import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../../models/PAEventsType';
import { newNotificationTrackingConfigs } from '../newNotificationEvents';

const screenViewEventTypes: Array<keyof typeof newNotificationTrackingConfigs> = [
  PAEventsType.SEND_PA_PRELIMINARY_INFORMATION,
  PAEventsType.SEND_PA_RECIPIENTS,
  PAEventsType.SEND_PA_DEBT_POSITION,
  PAEventsType.SEND_PA_DEBT_POSITION_DETAIL,
  PAEventsType.SEND_PA_DOCUMENTATION,
  PAEventsType.SEND_PA_NEW_NOTIFICATION_UX_SUCCESS,
];

describe('newNotificationTrackingConfigs', () => {
  it('should build SEND_PA_NEW_NOTIFICATION event', () => {
    const result = newNotificationTrackingConfigs[PAEventsType.SEND_PA_NEW_NOTIFICATION](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
      },
    });
  });

  it.each(screenViewEventTypes)('should build %s screen view event', (eventType) => {
    const result = newNotificationTrackingConfigs[eventType](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
