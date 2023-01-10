import React from 'react';
import { act, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import { DowntimeStatus, KnownFunctionality } from '../../../models';
import { render } from '../../../test-utils';
import { AppStatusData, KnownSentiment } from '../../../types';
import { AppStatusRender } from '../AppStatusRender';
import { apiOutcomeTestHelper } from '../../../utils';
import { formatDate, formatTime } from '../../../utils/date.utility';

/* eslint-disable-next-line functional/no-let */
let mockIsMobile: boolean;

jest.mock('../../../hooks', () => {
  const original = jest.requireActual('../../../hooks');
  return {
    ...original,
    useIsMobile: () => mockIsMobile,
  };
});

jest.mock('../../../services/localization.service', () => {
  const original = jest.requireActual('../../../services/localization.service');
  return {
    ...original,
    getLocalizedOrDefaultLabel: (_1: string, key: string, _2: string, data: any) => (
      <span>
        {key} - {JSON.stringify(data)}
      </span>
    ),
  };
});

jest.mock('../AppStatusBar', () => {
  const original = jest.requireActual('../AppStatusBar');
  return {
    ...original,
    AppStatusBar: () => <div data-testid="mock-app-status-bar">Status bar</div>,
  };
});

jest.mock('../MobileDowntimeLog', () => () => (
  <div data-testid="mock-mobile-downtime-log">Mobile downtime log</div>
));

jest.mock('../DesktopDowntimeLog', () => () => (
  <div data-testid="mock-desktop-downtime-log">Desktop downtime log</div>
));

jest.mock('../../EmptyState', () => (props: any) => (
  <div data-testid="mock-empty-state">{String(props.sentimentIcon)}</div>
));

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
  it('with downtime - desktop', async () => {
    mockIsMobile = false;

    await act(
      async () =>
        void render(
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
        )
    );
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it('with downtime - mobile', async () => {
    mockIsMobile = true;

    await act(
      async () =>
        void render(
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
        )
    );
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it('empty downtime list', async () => {
    mockIsMobile = false;

    await act(
      async () =>
        void render(
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
        )
    );
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).toBeInTheDocument();
    const satisfied =
      emptyStateComponent &&
      within(emptyStateComponent).queryByText(String(KnownSentiment.SATISFIED));
    const dissatisfied =
      emptyStateComponent &&
      within(emptyStateComponent).queryByText(String(KnownSentiment.DISSATISFIED));
    expect(satisfied).toBeInTheDocument();
    expect(dissatisfied).not.toBeInTheDocument();
  });

  it('error in status API', async () => {
    mockIsMobile = false;

    await act(
      async () =>
        void render(
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
        )
    );

    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    const errorStatusComponent = screen.queryByTestId(
      `api-error-${mockActionIds.GET_CURRENT_STATUS}`
    );
    const errorDowntimeComponent = screen.queryByTestId(
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
    mockIsMobile = false;

    const mockAppState = apiOutcomeTestHelper.appStateWithMessageForAction(
      mockActionIds.GET_CURRENT_STATUS
    );
    mockAppState.messages.errors.push(
      apiOutcomeTestHelper.errorMessageForAction(mockActionIds.GET_DOWNTIME_LOG_PAGE)
    );

    await act(
      async () =>
        void render(
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
        )
    );

    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    const errorStatusComponent = screen.queryByTestId(
      `api-error-${mockActionIds.GET_CURRENT_STATUS}`
    );
    const errorDowntimeComponent = screen.queryByTestId(
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
    mockIsMobile = false;
    await act(
      async () =>
        void render(
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
        )
    );
    const lastCheckLegend = screen.queryByText(new RegExp('appStatus.lastCheckLegend'));
    const lastCheckDate = screen.queryByText(new RegExp(formatDate('2022-12-28T15:43:19.190Z')));
    const lastCheckTime = screen.queryByText(new RegExp(formatTime('2022-12-28T15:43:19.190Z')));
    expect(lastCheckLegend).toBeInTheDocument();
    expect(lastCheckDate).toBeInTheDocument();
    expect(lastCheckTime).toBeInTheDocument();
    expect(lastCheckLegend).toBe(lastCheckDate);
    expect(lastCheckLegend).toBe(lastCheckTime);
  });
});
