import { EventCategory, EventPageType } from '@pagopa-pn/pn-commons';

import { SendToastErrorStrategy } from '../SendToastErrorStrategy';

describe('Mixpanel - Toast error Strategy', () => {
  it('should return toast error event', () => {
    const strategy = new SendToastErrorStrategy();

    const error = {
      reason: 'exception',
      traceId: 'traceId',
      page_name: EventPageType.LISTA_DELEGHE,
      message: {
        title: 'title',
        content: 'content',
      },
      httpStatusCode: 500,
      action: 'action',
    };

    const toastErrorEvent = strategy.performComputations(error);
    expect(toastErrorEvent).toEqual({
      event_category: EventCategory.KO,
      reason: error.reason,
      traceId: error.traceId,
      page_name: error.page_name,
      message: error.message,
      httpStatusCode: error.httpStatusCode,
      action: error.action,
    });
  });
});
