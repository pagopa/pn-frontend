import { EventPageType } from '@pagopa-pn/pn-commons';

import { mapToastErrorToEventPayload } from '../errorPayloadMappers';

describe('errorPayloadMappers', () => {
  it('should map toast error data to event payload', () => {
    const payload = mapToastErrorToEventPayload({
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

    expect(payload).toStrictEqual({
      reason: 'PN_ERROR',
      traceid: 'trace-id',
      page_name: EventPageType.LISTA_NOTIFICHE,
      action: 'getSentNotification',
      httpStatusCode: 500,
      message: 'Error details',
    });
  });
});
