import { vi } from 'vitest';

import { notificationCostDetailsMock } from '../../../../__mocks__/NotificationDetail.mock';
import { EventAction, EventPaymentRecipientType } from '../../../../models';
import { fireEvent, initLocalizationForTest, render } from '../../../../test-utils';
import NotificationCostsDetailDrawer from '../../NotificationCostsDetailDrawer';

const costDetailsAssistanceLink = 'https://www.example.com/';

describe('NotificationCostsDetailDrawer - Mixpanel events', () => {
  let handleTrackEventFn: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    initLocalizationForTest();
  });

  beforeEach(() => {
    handleTrackEventFn = vi.fn();
  });

  it('fires SEND_BANNER on mount', () => {
    render(
      <NotificationCostsDetailDrawer
        costDetails={notificationCostDetailsMock}
        costDetailsAssistanceLink={costDetailsAssistanceLink}
        handleTrackEventFn={handleTrackEventFn}
      />
    );
    expect(handleTrackEventFn).toHaveBeenCalledWith(EventPaymentRecipientType.SEND_BANNER, {
      event_type: EventAction.SCREEN_VIEW,
      banner_id: 'notification_expenses',
      banner_page: 'dettaglio_notifica',
      banner_landing: 'not_set',
    });
  });

  it('fires SEND_TAP_BANNER and SEND_NOTIFICATION_EXPENSES_DETAIL when CTA is clicked', () => {
    const { getByRole } = render(
      <NotificationCostsDetailDrawer
        costDetails={notificationCostDetailsMock}
        costDetailsAssistanceLink={costDetailsAssistanceLink}
        handleTrackEventFn={handleTrackEventFn}
      />
    );
    handleTrackEventFn.mockClear();
    fireEvent.click(getByRole('button', { name: 'notifiche - notification-alert.cta' }));
    expect(handleTrackEventFn).toHaveBeenCalledWith(EventPaymentRecipientType.SEND_TAP_BANNER, {
      event_type: EventAction.ACTION,
      banner_id: 'notification_expenses',
      banner_page: 'dettaglio_notifica',
      banner_landing: 'not_set',
    });
    expect(handleTrackEventFn).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_NOTIFICATION_EXPENSES_DETAIL,
      { status: 'display' }
    );
  });

  it('fires SEND_TAP_EXTERNAL_LINK when assistance link is clicked', () => {
    const { getByRole, getByTestId } = render(
      <NotificationCostsDetailDrawer
        costDetails={notificationCostDetailsMock}
        costDetailsAssistanceLink={costDetailsAssistanceLink}
        handleTrackEventFn={handleTrackEventFn}
      />
    );
    fireEvent.click(getByRole('button', { name: 'notifiche - notification-alert.cta' }));
    handleTrackEventFn.mockClear();
    fireEvent.click(getByTestId('cost-details-drawer-assistance-link'));
    expect(handleTrackEventFn).toHaveBeenCalledWith(
      EventPaymentRecipientType.SEND_TAP_EXTERNAL_LINK,
      { link: costDetailsAssistanceLink }
    );
  });
});
