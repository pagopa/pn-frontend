import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { SendDownloadResponseStrategy } from '../SendDownloadResponse';

describe('Mixpanel - Download Response Strategy', () => {
  it('should return ready if url is available', () => {
    const strategy = new SendDownloadResponseStrategy();

    const downloadCertificate = strategy.performComputations({
      url: 'url',
      docType: 'docType',
    });
    expect(downloadCertificate).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      doc_type: 'docType',
      url_available: 'ready',
    });
  });

  it('should return retry_after if url is not available and empty docType if is not present', () => {
    const strategy = new SendDownloadResponseStrategy();

    const downloadResponseEvent = strategy.performComputations({});
    expect(downloadResponseEvent).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.ACTION,
      doc_type: '',
      url_available: 'retry_after',
    });
  });
});
