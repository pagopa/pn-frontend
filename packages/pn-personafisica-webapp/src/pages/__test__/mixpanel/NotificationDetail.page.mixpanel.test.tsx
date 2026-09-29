import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import {
  NotificationStatus,
  PaymentStatus,
  TimelineCategory,
  populatePaymentsPagoPaF24,
} from '@pagopa-pn/pn-commons';

import { downtimesDTO } from '../../../__mocks__/AppStatus.mock';
import { paymentInfo } from '../../../__mocks__/ExternalRegistry.mock';
import {
  notificationDTO,
  notificationToFe,
  paymentsData,
} from '../../../__mocks__/NotificationDetail.mock';
import {
  PFTriggerEventSpy,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { PFEventsType } from '../../../models/PFEventsType';
import * as routes from '../../../navigation/routes.const';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import NotificationDetail from '../../NotificationDetail.page';

const mockAssignFn = vi.fn();

const Component = () => (
  <Routes>
    <Route path={routes.DETTAGLIO_NOTIFICA} element={<NotificationDetail />} />
    <Route path={routes.DETTAGLIO_NOTIFICA_DELEGATO} element={<NotificationDetail />} />
  </Routes>
);

const paymentHistory = populatePaymentsPagoPaF24(
  notificationToFe.timeline,
  paymentsData.pagoPaF24,
  paymentInfo
);
const requiredPaymentIndex = paymentHistory.findIndex(
  (payment) => payment.pagoPa?.status === PaymentStatus.REQUIRED
);

describe('NotificationDetail.page - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;
  const original = globalThis.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      value: { href: '', assign: mockAssignFn },
    });
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    mockAssignFn.mockClear();
    triggerEventSpy.mockRestore();
    vi.useRealTimers();
    sessionStorage.clear();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(globalThis, 'location', { configurable: true, value: original });
  });

  const setupMocks = () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, notificationDTO);
    mock.onPost('/bff/v1/payments/info').reply(200, paymentInfo);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
  };

  const baseState = {
    userState: { user: { fiscal_number: notificationDTO.recipients[2].taxId } },
  };

  it('fires SEND_NOTIFICATION_DETAIL and SEND_NOTIFICATIONS_COUNT on page load', async () => {
    setupMocks();

    await act(async () => {
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(
        PFEventsType.SEND_NOTIFICATION_DETAIL,
        expect.objectContaining({
          notificationStatus: expect.any(String),
          timeline: expect.any(Array),
          notificationStatusHistory: expect.any(Array),
          flow: expect.any(String),
          delivery_mode: expect.any(String),
        })
      );
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_NOTIFICATIONS_COUNT,
      expect.objectContaining({
        timeline: expect.any(Array),
      })
    );
  });

  it('fires SEND_DOWNLOAD_ATTACHMENT when an attachment button is clicked', async () => {
    setupMocks();

    const { getAllByTestId } = await act(async () =>
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      })
    );

    await waitFor(() => getAllByTestId('documentButton'));
    fireEvent.click(getAllByTestId('documentButton')[0]);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_DOWNLOAD_ATTACHMENT, {
      notification_type: 'notifica',
    });
  });

  it('fires SEND_DOWNLOAD_RECEIPT_NOTICE when the AAR document is clicked', async () => {
    setupMocks();

    const { container } = await act(async () =>
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      })
    );

    await waitFor(() => {
      const aarButtons = container.querySelectorAll('[data-testid="aarBox"] button');
      expect(aarButtons.length).toBeGreaterThan(0);
    });
    const aarButton = container.querySelectorAll('[data-testid="aarBox"] button')[0];
    fireEvent.click(aarButton);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_DOWNLOAD_RECEIPT_NOTICE);
  });

  // NB: skipped because the timeline is migrated in another page
  // -> restore it when FE unit test debt is done
  it.skip('fires SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES when a legal fact is clicked', async () => {
    setupMocks();

    const { getAllByTestId } = await act(async () =>
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      })
    );

    await waitFor(() => getAllByTestId('download-legalfact'));
    fireEvent.click(getAllByTestId('download-legalfact')[0]);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DOWNLOAD_CERTIFICATE_OPPOSABLE_TO_THIRD_PARTIES,
      { source: 'dettaglio_notifica' }
    );
  });

  // NB: skipped because the timeline is migrated in another page
  // -> restore it when FE unit test debt is done
  it.skip('fires SEND_NOTIFICATION_STATUS_DETAIL when the timeline accordion is toggled', async () => {
    setupMocks();

    const { getAllByTestId } = await act(async () =>
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      })
    );

    await waitFor(() => getAllByTestId('more-less-timeline-step'));
    fireEvent.click(getAllByTestId('more-less-timeline-step')[0]);

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_NOTIFICATION_STATUS_DETAIL, {
      accordion: 'expanded',
    });
  });

  // trackEventPaymentRecipient events (SEND_PAYMENT_OUTCOME, SEND_F24_DOWNLOAD,
  // SEND_PAYMENT_LIST_CHANGE_PAGE, etc.) are not covered here — they fire through
  // a callback passed down to NotificationPaymentRecipient (pn-commons), requiring
  // deep payment UI interaction to trigger.

  it('fires SEND_START_PAYMENT when the pay button is clicked', async () => {
    setupMocks();
    mock.onPost('/bff/v1/payments/cart').reply(500);

    const { getByTestId, queryAllByTestId } = await act(async () =>
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      })
    );

    await waitFor(() => getByTestId('pay-button'));

    vi.useFakeTimers();

    const item = queryAllByTestId('pagopa-item')[requiredPaymentIndex];
    const radioButton = item?.querySelector('[data-testid="radio-button"] input');
    fireEvent.click(radioButton!);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      fireEvent.click(getByTestId('pay-button'));
    });

    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_START_PAYMENT, {
      psp: 'pagopa',
      notification_type: 'notifica',
    });

    vi.useRealTimers();
  });

  it('fires SEND_CANCELLED_NOTIFICATION_REFOUND_INFO when the cancelled alert CTA is clicked', async () => {
    mock.onGet(`/bff/v1/notifications/received/${notificationDTO.iun}`).reply(200, {
      ...notificationDTO,
      notificationStatus: NotificationStatus.CANCELLED,
      notificationStatusHistory: [
        ...notificationDTO.notificationStatusHistory,
        {
          status: NotificationStatus.CANCELLED,
          activeFrom: '2033-08-14T13:42:54.17675939Z',
          relatedTimelineElements: [],
        },
      ],
      timeline: [
        ...notificationDTO.timeline,
        {
          elementId: 'NOTIFICATION_CANCELLATION_REQUEST.HYTD-ERPH-WDUE-202308-H-1',
          timestamp: '2033-08-14T13:42:54.17675939Z',
          legalFactsIds: [],
          category: TimelineCategory.NOTIFICATION_CANCELLATION_REQUEST,
          details: {},
        },
      ],
    });
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);

    const { getByTestId } = await act(async () =>
      render(<Component />, {
        preloadedState: baseState,
        route: routes.GET_DETTAGLIO_NOTIFICA_PATH(notificationDTO.iun),
      })
    );

    await waitFor(() => getByTestId('cancelledAlertText'));
    triggerEventSpy.mockClear();

    const ctaLink = within(getByTestId('cancelledAlertText')).getByRole('button', {
      name: 'detail.cancelled.cta',
    });
    fireEvent.click(ctaLink);

    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_CANCELLED_NOTIFICATION_REFOUND_INFO
    );
  });
});
