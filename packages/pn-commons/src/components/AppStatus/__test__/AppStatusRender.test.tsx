import React from 'react';

import { DowntimeStatus, KnownFunctionality } from '../../../models';
import {
  RenderResult,
  act,
  createMatchMedia,
  initLocalizationForTest,
  render,
} from '../../../test-utils';
import { AppStatusData } from '../../../types';
import { apiOutcomeTestHelper } from '../../../utils';
import { formatDate, formatTime } from '../../../utils/date.utility';
import { AppStatusRender } from '../AppStatusRender';

const mockActionIds = {
  GET_CURRENT_STATUS: 'mock-get-current-status',
  GET_DOWNTIME_LOG_PAGE: 'mock-get-downtime-log-page',
};

const mockAppStatus: AppStatusData = {
  pagination: { page: 0, size: 10, resultPages: ['0'] },
  currentStatus: {
    appIsFullyOperative: true,
    lastCheckTimestamp: '2022-12-28T15:43:19.190Z',
    statusByFunctionality: [],
  },
  downtimeLogPage: {
    downtimes: [
      {
        rawFunctionality: KnownFunctionality.NotificationWorkflow,
        knownFunctionality: KnownFunctionality.NotificationWorkflow,
        status: DowntimeStatus.OK,
        startDate: '2022-10-28T10:11:09Z',
        endDate: '2022-10-28T10:18:14Z',
        fileAvailable: false,
      },
      {
        rawFunctionality: KnownFunctionality.NotificationCreate,
        knownFunctionality: KnownFunctionality.NotificationCreate,
        status: DowntimeStatus.OK,
        startDate: '2022-10-23T15:50:04Z',
        endDate: '2022-10-23T15:51:12Z',
        legalFactId: 'some-legal-fact-id',
        fileAvailable: true,
      },
    ],
  },
};
describe('AppStatusRender component', () => {
  let result: RenderResult | undefined;
  const original = window.matchMedia;

  beforeAll(() => {
    initLocalizationForTest();
  });

  afterEach(() => {
    result = undefined;
    window.matchMedia = original;
  });

  it('with downtime - desktop', async () => {
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={mockAppStatus}
          clearLegalFactDocument={() => {}}
          clearPagination={() => {}}
          fetchCurrentStatus={() => {}}
          fetchDowntimeLegalFactDocumentDetails={() => {
            return undefined;
          }}
          fetchDowntimeLogPage={() => {}}
          setPagination={() => {}}
        />
      );
    });
    const appStatusBarComponent = result?.getByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result?.getByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result?.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result?.queryByTestId('emptyState');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it('with downtime - mobile', async () => {
    window.matchMedia = createMatchMedia(800);

    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={mockAppStatus}
          clearLegalFactDocument={() => {}}
          clearPagination={() => {}}
          fetchCurrentStatus={() => {}}
          fetchDowntimeLegalFactDocumentDetails={() => {
            return undefined;
          }}
          fetchDowntimeLogPage={() => {}}
          setPagination={() => {}}
        />
      );
    });
    const appStatusBarComponent = result?.getByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result?.queryByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result?.getByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result?.queryByTestId('emptyState');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it('empty downtime list', async () => {
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={{ ...mockAppStatus, downtimeLogPage: { downtimes: [] } }}
          clearLegalFactDocument={() => {}}
          clearPagination={() => {}}
          fetchCurrentStatus={() => {}}
          fetchDowntimeLegalFactDocumentDetails={() => {
            return undefined;
          }}
          fetchDowntimeLogPage={() => {}}
          setPagination={() => {}}
        />
      );
    });
    const appStatusBarComponent = result?.getByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result?.queryByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result?.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result?.getByTestId('emptyState');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).toBeInTheDocument();
    expect(emptyStateComponent).toHaveTextContent(/downtimeList.emptyMessage/i);
  });

  it('error in status API', async () => {
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={mockAppStatus}
          clearLegalFactDocument={() => {}}
          clearPagination={() => {}}
          fetchCurrentStatus={() => {}}
          fetchDowntimeLegalFactDocumentDetails={() => {
            return undefined;
          }}
          fetchDowntimeLogPage={() => {}}
          setPagination={() => {}}
        />,
        {
          preloadedState: {
            appState: apiOutcomeTestHelper.appStateWithMessageForAction(
              mockActionIds.GET_CURRENT_STATUS
            ),
          },
        }
      );
    });

    const appStatusBarComponent = result?.queryByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result?.getByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result?.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result?.queryByTestId('emptyState');
    const errorStatusComponent = result?.getByTestId(
      `api-error-${mockActionIds.GET_CURRENT_STATUS}`
    );
    const errorDowntimeComponent = result?.queryByTestId(
      `api-error-${mockActionIds.GET_DOWNTIME_LOG_PAGE}`
    );
    expect(appStatusBarComponent).not.toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
    expect(errorStatusComponent).toBeInTheDocument();
    expect(errorDowntimeComponent).not.toBeInTheDocument();
  });

  it('error in both status and downtime API', async () => {
    const mockAppState = apiOutcomeTestHelper.appStateWithMessageForAction(
      mockActionIds.GET_CURRENT_STATUS
    );
    mockAppState.messages.errors.push(
      apiOutcomeTestHelper.errorMessageForAction(mockActionIds.GET_DOWNTIME_LOG_PAGE)
    );

    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={mockAppStatus}
          clearLegalFactDocument={() => {}}
          clearPagination={() => {}}
          fetchCurrentStatus={() => {}}
          fetchDowntimeLegalFactDocumentDetails={() => {
            return undefined;
          }}
          fetchDowntimeLogPage={() => {}}
          setPagination={() => {}}
        />,
        { preloadedState: { appState: mockAppState } }
      );
    });

    const appStatusBarComponent = result?.queryByTestId('app-status-bar');
    const desktopDonwtimeLogComponent = result?.queryByTestId('tableDowntimeLog');
    const mobileDonwtimeLogComponent = result?.queryByTestId('mobileTableDowntimeLog');
    const emptyStateComponent = result?.queryByTestId('emptyState');
    const errorStatusComponent = result?.getByTestId(
      `api-error-${mockActionIds.GET_CURRENT_STATUS}`
    );
    const errorDowntimeComponent = result?.getByTestId(
      `api-error-${mockActionIds.GET_DOWNTIME_LOG_PAGE}`
    );
    expect(appStatusBarComponent).not.toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
    expect(errorStatusComponent).toBeInTheDocument();
    expect(errorDowntimeComponent).toBeInTheDocument();
  });

  it('Last check message, must include date and time of last check timestamp', async () => {
    await act(async () => {
      result = render(
        <AppStatusRender
          actionIds={mockActionIds}
          appStatus={mockAppStatus}
          clearLegalFactDocument={() => {}}
          clearPagination={() => {}}
          fetchCurrentStatus={() => {}}
          fetchDowntimeLegalFactDocumentDetails={() => {
            return undefined;
          }}
          fetchDowntimeLogPage={() => {}}
          setPagination={() => {}}
        />
      );
    });
    const lastCheckLegend = result?.getByText(new RegExp('appStatus.lastCheckLegend'));
    const lastCheckDate = result?.getByText(new RegExp(formatDate('2022-12-28T15:43:19.190Z')));
    const lastCheckTime = result?.getByText(new RegExp(formatTime('2022-12-28T15:43:19.190Z')));
    expect(lastCheckLegend).toBeInTheDocument();
    expect(lastCheckDate).toBeInTheDocument();
    expect(lastCheckTime).toBeInTheDocument();
    expect(lastCheckLegend).toBe(lastCheckDate);
    expect(lastCheckLegend).toBe(lastCheckTime);
  });
});
