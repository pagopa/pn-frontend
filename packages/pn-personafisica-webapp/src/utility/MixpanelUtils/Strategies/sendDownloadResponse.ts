import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendDownloadResponse = {
  payload: {
    url: string;
    retryAfter?: number;
    docType?: string;
  };
};

type SendDownloadResponseReturn = {
  doc_type: string;
  url_available: 'ready' | 'retry_after';
};

export class SendDownloadResponseStrategy implements EventStrategy {
  performComputations({ payload }: SendDownloadResponse): TrackedEvent<SendDownloadResponseReturn> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...{
        doc_type: payload.docType ? payload.docType : '',
        url_available: payload.url ? 'ready' : 'retry_after',
      },
    };
  }
}
