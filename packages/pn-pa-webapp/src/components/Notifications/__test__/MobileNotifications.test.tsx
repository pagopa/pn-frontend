import { vi } from 'vitest';

import { formatToTimezoneString, tenYearsAgo, today } from '@pagopa-pn/pn-commons';
import { createMatchMedia } from '@pagopa-pn/pn-commons/src/test-utils';

import { notificationsToFe } from '../../../__mocks__/Notifications.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { GET_DETTAGLIO_NOTIFICA_PATH } from '../../../navigation/routes.const';
import MobileNotifications from '../MobileNotifications';

const mockNavigateFn = vi.fn();

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('MobileNotifications Component', () => {
  const original = window.matchMedia;

  beforeAll(() => {
    window.matchMedia = createMatchMedia(800);
  });

  afterAll(() => {
    window.matchMedia = original;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders MobileNotifications - no notifications', async () => {
    // render component
    let result: RenderResult;
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={[]}
          onChangeSorting={() => {}}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });
    const filtersToggle = result!.queryByTestId('dialogToggle');
    expect(filtersToggle).toBeInTheDocument();
    const notificationCards = result!.queryAllByTestId('mobileCards');
    expect(notificationCards).toHaveLength(0);
    expect(result!.container).toHaveTextContent(/empty-state.no-notifications/i);
  });

  it('renders MobileNotifications - notifications', async () => {
    // render component
    let result: RenderResult;
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={notificationsToFe.resultsPage}
          onChangeSorting={() => {}}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });
    const filters = result!.queryByTestId('dialogToggle');
    expect(filters).toBeInTheDocument();
    const norificationCards = result!.queryAllByTestId('mobileCards');
    expect(norificationCards).toHaveLength(notificationsToFe.resultsPage.length);
  });

  it('renders component - no notification after filter', async () => {
    // render component
    let result: RenderResult;
    await act(async () => {
      result = render(
        <MobileNotifications notifications={[]} onManualSend={() => {}} onApiKeys={() => {}} />,
        {
          preloadedState: {
            dashboardState: {
              filters: {
                startDate: formatToTimezoneString(tenYearsAgo),
                endDate: formatToTimezoneString(today),
                iunMatch: 'ABCD-EFGH-ILMN-123456-A-1',
              },
            },
          },
        }
      );
    });
    // the rerendering must be done to take the useRef updates
    result!.rerender(
      <MobileNotifications notifications={[]} onManualSend={() => {}} onApiKeys={() => {}} />
    );
    const filters = await waitFor(() => result!.queryByTestId('dialogToggle'));
    expect(filters).toBeInTheDocument();
    expect(result!.container).toHaveTextContent(/empty-state.filtered/i);
  });

  it('clicks on go to detail action', async () => {
    // render component
    let result: RenderResult;
    await act(async () => {
      result = render(
        <MobileNotifications
          notifications={notificationsToFe.resultsPage}
          onManualSend={() => {}}
          onApiKeys={() => {}}
        />
      );
    });
    const norificationCards = result!.getAllByTestId('mobileCards');
    const notificationsCardButton = norificationCards[0].querySelector('button');
    fireEvent.click(notificationsCardButton!);
    await waitFor(() => {
      expect(mockNavigateFn).toHaveBeenCalledTimes(1);
      expect(mockNavigateFn).toHaveBeenCalledWith(
        GET_DETTAGLIO_NOTIFICA_PATH(notificationsToFe.resultsPage[0].iun)
      );
    });
  });
});
