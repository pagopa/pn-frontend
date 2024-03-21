import { EventCategory, EventPageType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendToastError = {
  reason: string;
  traceId?: string;
  page_name?: EventPageType;
  message: {
    title: string;
    content: string;
  };
  httpStatusCode?: number;
  action: string;
};

export class SendToastErrorStrategy implements EventStrategy {
  performComputations(data: SendToastError): TrackedEvent<SendToastError> {
    return {
      event_category: EventCategory.KO,
      ...data,
    };
  }
}
