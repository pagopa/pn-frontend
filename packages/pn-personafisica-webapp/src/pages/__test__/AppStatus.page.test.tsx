import { act, screen } from '@testing-library/react';
import { DowntimeStatus, formatDate, formatTimeHHMM, KnownFunctionality } from "@pagopa-pn/pn-commons";
import { render } from '../../__test__/test-utils';
import AppStatus from '../AppStatus.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, data: any) => `${str} - ${JSON.stringify(data)}`,
  }),
  Trans: () => 'mocked verify description',
}));


/* eslint-disable-next-line functional/no-let */
let mockIsMobile: boolean;

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => mockIsMobile,
    EmptyState: () => <div data-testid="mock-empty-state">Empty state</div>,
    AppStatusBar: () => <div data-testid="mock-app-status-bar">AppStatus bar</div>, 
    DesktopDowntimeLog: () => <div data-testid="mock-desktop-downtime-log">Desktop downtime log</div>, 
    MobileDowntimeLog: () => <div data-testid="mock-mobile-downtime-log">Mobile downtime log</div>,
  };
});


/* eslint-disable functional/no-let */
let mockIncludeDowntimes: boolean;
let mockAppStatusApiFail: boolean;
let mockDowntimeLogApiFail: boolean;
/* eslint-enable functional/no-let */

const mockNotificationCreate = KnownFunctionality.NotificationCreate;
const mockDowntimeStatusOK = DowntimeStatus.OK;
const mockLastCheckTimestamp = '2022-11-01T14:15:28Z';

jest.mock('../../api/appStatus/AppStatus.api', () => {
  const original = jest.requireActual('../../api/consents/Consents.api');
  return {
    ...original,
    AppStatusApi: {
      getCurrentStatus: () => mockAppStatusApiFail 
        ? Promise.reject({ response: { status: 500 } })
        : Promise.resolve({
            appIsFullyOperative: true,
            statusByFunctionality: [],  
            lastCheckTimestamp: mockLastCheckTimestamp,
          }),
      getDowntimeLogPage: () => mockDowntimeLogApiFail 
      ? Promise.reject({ response: { status: 500 } })
      : Promise.resolve({
          downtimes: mockIncludeDowntimes
            ? [{
                rawFunctionality: mockNotificationCreate,
                knownFunctionality: mockNotificationCreate,
                status: mockDowntimeStatusOK,
                startDate: '2022-10-24T08:15:21Z',
                endDate: '2022-10-24T08:15:29Z',
                legalFactId: "some-legal-fact-id",
                fileAvailable: true,    
              }]
            : [],
          statusByFunctionality: [],     
        }),
    },
  };
});


describe('AppStatus page', () => {
  beforeEach(() => {
    mockAppStatusApiFail = false;
    mockDowntimeLogApiFail = false;
  });

  it("Desktop - with downtimes", async () => {
    mockIncludeDowntimes = true;
    mockIsMobile = false;
    await act(async () => void render(<AppStatus />));
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it("Mobile - with downtimes", async () => {
    mockIncludeDowntimes = true;
    mockIsMobile = true;
    await act(async () => void render(<AppStatus />));
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it("Desktop - no downtimes", async () => {
    mockIncludeDowntimes = false;
    mockIsMobile = false;
    await act(async () => void render(<AppStatus />));
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).toBeInTheDocument();
  });

  it("Desktop - error in app status API", async () => {
    mockIncludeDowntimes = true;
    mockIsMobile = false;
    mockAppStatusApiFail = true;
    await act(async () => void render(<AppStatus />));
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).not.toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it("Desktop - error in downtime log API", async () => {
    mockIncludeDowntimes = true;
    mockIsMobile = false;
    mockDowntimeLogApiFail = true;
    await act(async () => void render(<AppStatus />));
    const appStatusBarComponent = screen.queryByTestId('mock-app-status-bar');
    const desktopDonwtimeLogComponent = screen.queryByTestId('mock-desktop-downtime-log');
    const mobileDonwtimeLogComponent = screen.queryByTestId('mock-mobile-downtime-log');
    const emptyStateComponent = screen.queryByTestId('mock-empty-state');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(desktopDonwtimeLogComponent).not.toBeInTheDocument();
    expect(mobileDonwtimeLogComponent).not.toBeInTheDocument();
    expect(emptyStateComponent).not.toBeInTheDocument();
  });

  it("Last check message, must include date and time of last check timestamp", async () => {
    mockIncludeDowntimes = true;
    mockIsMobile = false;
    await act(async () => void render(<AppStatus />));
    const lastCheckLegend = screen.queryByText(new RegExp('appStatus.lastCheckLegend'));
    const lastCheckDate = screen.queryByText(new RegExp(formatDate(mockLastCheckTimestamp)));
    const lastCheckTime = screen.queryByText(new RegExp(formatTimeHHMM(mockLastCheckTimestamp)));
    expect(lastCheckLegend).toBeInTheDocument();
    expect(lastCheckDate).toBeInTheDocument();
    expect(lastCheckTime).toBeInTheDocument();
    expect(lastCheckLegend).toBe(lastCheckDate);
    expect(lastCheckLegend).toBe(lastCheckTime);
  });
});
