import React from 'react';
import { act, screen } from '@testing-library/react';
import {
  AppResponseMessage,
  DowntimeStatus,
  formatDate,
  KnownFunctionality,
  ResponseEventDispatcher,
} from '@pagopa-pn/pn-commons';
import { render } from '../../__test__/test-utils';
import AppStatus from '../AppStatus.page';
import { APP_STATUS_ACTIONS } from '../../redux/appStatus/actions';

const fakePalette = { success: { main: '#00FF00' }, error: { main: '#FF0000' } };

jest.mock('@mui/material', () => {
  const original = jest.requireActual('@mui/material');
  return {
    ...original,
    useTheme: () => ({ ...original.useTheme(), palette: fakePalette }),
  };
});

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, data: any) => `${str} - ${JSON.stringify(data)}`,
  }),
  Trans: () => 'mocked verify description',
}));

/* eslint-disable functional/no-let */
let mockAppStatusApiFail: boolean;
let mockDowntimeLogApiFail: boolean;
let mockIsFullyOperative: boolean;
/* eslint-enable functional/no-let */

const mockNotificationCreate = KnownFunctionality.NotificationCreate;
const mockDowntimeStatusOK = DowntimeStatus.OK;
const mockLastCheckTimestamp = '2022-11-01T14:15:28Z';

jest.mock('../../api/appStatus/AppStatus.api', () => {
  const original = jest.requireActual('../../api/appStatus/AppStatus.api');
  return {
    ...original,
    AppStatusApi: {
      getCurrentStatus: () =>
        mockAppStatusApiFail
          ? Promise.reject({ response: { status: 500 } })
          : Promise.resolve({
              appIsFullyOperative: mockIsFullyOperative,
              statusByFunctionality: [],
              lastCheckTimestamp: mockLastCheckTimestamp,
            }),
      getDowntimeLogPage: () =>
        mockDowntimeLogApiFail
          ? Promise.reject({ response: { status: 500 } })
          : Promise.resolve({
              downtimes: [
                {
                  rawFunctionality: mockNotificationCreate,
                  knownFunctionality: mockNotificationCreate,
                  status: mockDowntimeStatusOK,
                  startDate: '2022-10-24T08:15:21Z',
                  endDate: '2022-10-28T08:18:29Z',
                  legalFactId: 'some-legal-fact-id',
                  fileAvailable: true,
                },
              ],
              statusByFunctionality: [],
            }),
    },
  };
});

const AppStatusWithErrorHandling = () => (
  <>
    <ResponseEventDispatcher />
    <AppResponseMessage />
    <AppStatus />
  </>
);

describe('AppStatus page', () => {
  beforeEach(() => {
    mockAppStatusApiFail = false;
    mockDowntimeLogApiFail = false;
  });

  /*
   * The intent of the "OK" test is to verify somehow that the result of the API calls
   * is rendered.
   * We perform a minimal check of two facts:
   * (1) the "green" variant of the status bar is rendered, instead of the "red" one.
   * (2) the downtime log list includes a datum from the mocked API response.
   */
  it('OK', async () => {
    mockIsFullyOperative = true;
    await act(async () => void render(<AppStatusWithErrorHandling />));
    const appStatusBarComponent = screen.queryByTestId('app-status-bar');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(appStatusBarComponent).toHaveStyle({ 'border-color': fakePalette.success.main });
    const startDateComponent = screen.queryByText(new RegExp(formatDate('2022-10-24T08:15:21Z')));
    expect(startDateComponent).toBeInTheDocument();
  });

  /*
   * In the "not OK" test, we just check that the "red" variant of the status bar is rendered.
   */
  it('not OK', async () => {
    mockIsFullyOperative = false;
    await act(async () => void render(<AppStatusWithErrorHandling />));
    const appStatusBarComponent = screen.queryByTestId('app-status-bar');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(appStatusBarComponent).toHaveStyle({ 'border-color': fakePalette.error.main });
  });

  it('Desktop - error in app status API', async () => {
    mockAppStatusApiFail = true;
    await act(async () => void render(<AppStatusWithErrorHandling />));
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_CURRENT_STATUS}`
    );
    const downtimeApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_DOWNTIME_LOG_PAGE}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
    expect(downtimeApiErrorComponent).not.toBeInTheDocument();
  });

  it('Desktop - error in downtime log API', async () => {
    mockDowntimeLogApiFail = true;
    await act(async () => void render(<AppStatusWithErrorHandling />));
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_CURRENT_STATUS}`
    );
    const downtimeApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_DOWNTIME_LOG_PAGE}`
    );
    expect(statusApiErrorComponent).not.toBeInTheDocument();
    expect(downtimeApiErrorComponent).toBeInTheDocument();
  });
});
