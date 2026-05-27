import { MockInstance, vi } from 'vitest';

import { appStorage } from '@pagopa-pn/pn-commons';

import { fireEvent, render } from '../../../../__test__/test-utils';
import { ContactSource } from '../../../../models/contacts';
import { PFEventsType } from '../../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import DomicileBanner from '../../DomicileBanner';

describe('DomicileBanner component - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.clearAllMocks();
    appStorage.domicileBanner.enable();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_ADD_SERCQ_SEND_ENTER_FLOW when CTA is clicked on no-sercq-send banner', () => {
    const { getByText } = render(<DomicileBanner source={ContactSource.HOME_NOTIFICHE} />);
    fireEvent.click(getByText('domicile-banner.no-sercq-cta'));
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW,
      expect.objectContaining({ source: ContactSource.HOME_NOTIFICHE })
    );
  });

  it('fires SEND_VIEW_CONTACT_DETAILS when CTA is clicked on no-courtesy-no-sercq-send banner', () => {
    appStorage.domicileBanner.disable();
    const { getByText } = render(<DomicileBanner source={ContactSource.HOME_NOTIFICHE} />);
    fireEvent.click(getByText('domicile-banner.no-courtesy-no-sercq-send-cta'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_VIEW_CONTACT_DETAILS, {
      source: ContactSource.HOME_NOTIFICHE,
    });
  });
});
