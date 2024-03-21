import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendDownloadResponse = {
  url: string;
  docType?: string;
};

type SendDownloadResponseReturn = {
  doc_type: string;
  url_available: 'ready' | 'retry_after';
};

export class SendDownloadResponseStrategy implements EventStrategy {
  performComputations({
    url,
    docType,
  }: SendDownloadResponse): TrackedEvent<SendDownloadResponseReturn> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...{
        doc_type: docType ? docType : '',
        url_available: url ? 'ready' : 'retry_after',
      },
    };
  }
}
