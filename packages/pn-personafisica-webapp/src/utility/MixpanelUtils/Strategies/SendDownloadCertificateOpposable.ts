import { EventAction, EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendDownloadCertificateSource = {
  source: 'dettaglio_notifica' | 'stato_piattaforma';
};

export class SendDownloadCertificateOpposable implements EventStrategy {
  performComputations({
    source,
  }: SendDownloadCertificateSource): TrackedEvent<SendDownloadCertificateSource> {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      source,
    };
  }
}
