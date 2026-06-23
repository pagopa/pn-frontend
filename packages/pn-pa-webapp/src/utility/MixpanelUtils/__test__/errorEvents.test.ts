import {
  EventAction,
  EventCategory,
  EventPageType,
  EventPropertyType,
} from '@pagopa-pn/pn-commons';

import { PAEventsType } from '../../../models/PAEventsType';
import { errorTrackingConfigs } from '../errorEvents';

describe('errorTrackingConfigs', () => {
  it('should build SEND_PA_TOAST_ERROR event', () => {
    const result = errorTrackingConfigs[PAEventsType.SEND_PA_TOAST_ERROR]({
      error: {
        showTechnicalData: false,
        code: 'PN_ERROR',
        message: { title: 'Error title', content: 'Error details' },
      },
      response: {
        traceId: 'trace-id',
        action: 'getSentNotification',
        status: 500,
      },
      pageName: EventPageType.LISTA_NOTIFICHE,
    });

    expect(result).toStrictEqual({
      [EventPropertyType.TRACK]: {
        reason: 'PN_ERROR',
        traceid: 'trace-id',
        page_name: EventPageType.LISTA_NOTIFICHE,
        action: 'getSentNotification',
        httpStatusCode: 500,
        message: 'Error details',
        event_category: EventCategory.KO,
        event_type: EventAction.ERROR,
      },
    });
  });
});
