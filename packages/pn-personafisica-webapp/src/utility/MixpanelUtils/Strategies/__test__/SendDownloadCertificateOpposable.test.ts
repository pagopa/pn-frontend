import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { SendDownloadCertificateOpposable } from '../SendDownloadCertificateOpposable';

describe('Mixpanel - Download Certificate Opposable Strategy', () => {
  it('should return download certificate opposable event', () => {
    const source = 'dettaglio_notifica';
    const strategy = new SendDownloadCertificateOpposable();

    const downloadCertificateEvent = strategy.performComputations({
      source,
    });
    expect(downloadCertificateEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      source,
    });
  });
});
