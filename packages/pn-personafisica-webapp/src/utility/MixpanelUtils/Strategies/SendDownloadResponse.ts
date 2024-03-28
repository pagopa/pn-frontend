import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendDownloadResponse = {
  payload: {
    url?: string;
    docType?: string;
  };
};

type SendDownloadResponseReturn = {
  doc_type: string;
  url_available: 'ready' | 'retry_after';
};

export class SendDownloadResponseStrategy implements EventStrategy {
  performComputations({
    payload: { url, docType },
  }: SendDownloadResponse): TrackedEvent<SendDownloadResponseReturn> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        doc_type: docType ? docType : '',
        url_available: url ? 'ready' : 'retry_after',
      },
    };
  }
}
