import { MockInstance, vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { act, fireEvent, render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import TppLanding from '../../TppLanding.page';

describe('TppLanding.page - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  const mockRetrievalId = '123456';
  const mockRoute = `${routes.TPP_LANDING}?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`;

  beforeEach(() => {
    vi.stubGlobal('open', vi.fn());
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_LANDING_PAGE on mount', () => {
    render(<TppLanding />, { route: mockRoute });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_LANDING_PAGE);
  });

  it('fires SEND_LANDING_PAGE_FAQ_OPEN when an FAQ accordion is expanded', async () => {
    const { getByTestId } = render(<TppLanding />, { route: mockRoute });

    await act(async () => {
      fireEvent.click(getByTestId('notificationsAccordionSummary'));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_LANDING_PAGE_FAQ_OPEN, {
      faq_name: 'faq.what-are-notifications.question',
    });
  });

  it('fires SEND_LANDING_PAGE_CLICK_ACCESS when the access button is clicked', async () => {
    const { getByTestId } = render(<TppLanding />, { route: mockRoute });

    await act(async () => {
      fireEvent.click(getByTestId('accessButton'));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_LANDING_PAGE_CLICK_ACCESS);
  });
});
