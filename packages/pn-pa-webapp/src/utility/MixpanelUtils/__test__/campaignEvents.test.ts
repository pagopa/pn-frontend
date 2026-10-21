import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { campaignsPage1 } from '../../../__mocks__/Campaigns.mock';
import { PAEventsType } from '../../../models/PAEventsType';
import { campaignTrackingConfigs } from '../campaignEvents';

const screenViewEventTypes: Array<
  Exclude<keyof typeof campaignTrackingConfigs, PAEventsType.SEND_PA_CAMPAIGNS>
> = [
  PAEventsType.SEND_PA_CAMPAIGN_DETAIL,
  PAEventsType.SEND_PA_COMBO_DETAIL,
  PAEventsType.SEND_PA_COMBO_STATUS_DETAIL,
];

describe('campaignTrackingConfigs', () => {
  it('should build SEND_PA_CAMPAIGNS event', () => {
    const result = campaignTrackingConfigs[PAEventsType.SEND_PA_CAMPAIGNS]({
      campaigns: campaignsPage1,
      pageNumber: 0,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        page_number: 0,
        total_count: 10,
        draft_count: 2,
        in_progress_count: 2,
        concluded_count: 5,
        canceled_count: 1,
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });

  it.each(screenViewEventTypes)('should build %s screen view event', (eventType) => {
    const result = campaignTrackingConfigs[eventType](undefined);

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.SCREEN_VIEW,
      },
    });
  });
});
