import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendDownloadCertificateSource = {
  source: 'dettaglio_notifica' | 'stato_piattaforma';
};

export class SendDownloadCertificateOpposable implements EventStrategy {
  performComputations(
    data: SendDownloadCertificateSource
  ): TrackedEvent<SendDownloadCertificateSource> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      ...data,
    };
  }
}
