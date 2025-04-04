import MockAdapter from 'axios-mock-adapter';

import { ThemeProvider } from '@mui/material';
import { AppResponseMessage, ResponseEventDispatcher, formatDate } from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import { currentStatusDTO, downtimesDTO } from '../../__mocks__/AppStatus.mock';
import { errorMock } from '../../__mocks__/Errors.mock';
import { act, fireEvent, render, screen, waitFor, within } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { APP_STATUS_ACTIONS } from '../../redux/appStatus/actions';
import AppStatus from '../AppStatus.page';

const AppStatusWithErrorHandling = () => (
  <ThemeProvider theme={theme}>
    <ResponseEventDispatcher />
    <AppResponseMessage />
    <AppStatus />
  </ThemeProvider>
);

describe('AppStatus page', async () => {
  let mock: MockAdapter;
  const original = window.location;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '' },
    });
  });

  afterEach(() => {
    mock.reset();
    window.location.href = '';
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });
  /*
   * The intent of the "OK" test is to verify somehow that the result of the API calls
   * is rendered.
   * We perform a minimal check of two facts:
   * (1) the "green" variant of the status bar is rendered, instead of the "red" one.
   * (2) the downtime log list includes a datum from the mocked API response.
   */
  it('Desktop - OK', async () => {
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      render(<AppStatusWithErrorHandling />);
    });
    expect(mock.history.get).toHaveLength(2);
    const appStatusBarComponent = screen.queryByTestId('app-status-bar');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(appStatusBarComponent).toHaveStyle({ 'border-color': theme.palette.success.main });
    const downtimeLogTable = screen.queryByTestId('tableDowntimeLog');
    expect(downtimeLogTable).toBeInTheDocument();
    const downtimeLogTableRows = screen.queryAllByTestId('tableDowntimeLog.row');
    expect(downtimeLogTableRows).toHaveLength(downtimesDTO.result.length);
  });

  /*
   * In the "not OK" test, we just check that the "red" variant of the status bar is rendered.
   */
  it('Desktop - not OK', async () => {
    mock
      .onGet('/bff/v1/downtime/status')
      .reply(200, { ...currentStatusDTO, appIsFullyOperative: false });
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      render(<AppStatusWithErrorHandling />);
    });
    expect(mock.history.get).toHaveLength(2);
    const appStatusBarComponent = screen.queryByTestId('app-status-bar');
    expect(appStatusBarComponent).toBeInTheDocument();
    expect(appStatusBarComponent).toHaveStyle({ 'border-color': theme.palette.error.main });
    const downtimeLogTable = screen.queryByTestId('tableDowntimeLog');
    expect(downtimeLogTable).toBeInTheDocument();
    const downtimeLogTableRows = screen.queryAllByTestId('tableDowntimeLog.row');
    expect(downtimeLogTableRows).toHaveLength(downtimesDTO.result.length);
  });

  it('Desktop - error in app status API', async () => {
    mock.onGet('/bff/v1/downtime/status').reply(errorMock.status, errorMock.data);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    await act(async () => {
      render(<AppStatusWithErrorHandling />);
    });
    expect(mock.history.get).toHaveLength(2);
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_CURRENT_STATUS}`
    );
    const downtimeApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_DOWNTIME_HISTORY}`
    );
    expect(statusApiErrorComponent).toBeInTheDocument();
    expect(downtimeApiErrorComponent).not.toBeInTheDocument();
  });

  it('Desktop - error in downtime log API', async () => {
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(errorMock.status, errorMock.data);
    await act(async () => {
      render(<AppStatusWithErrorHandling />);
    });
    expect(mock.history.get).toHaveLength(2);
    const statusApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_CURRENT_STATUS}`
    );
    const downtimeApiErrorComponent = screen.queryByTestId(
      `api-error-${APP_STATUS_ACTIONS.GET_DOWNTIME_HISTORY}`
    );
    expect(statusApiErrorComponent).not.toBeInTheDocument();
    expect(downtimeApiErrorComponent).toBeInTheDocument();
  });

  it('Desktop dowload legal fact', async () => {
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(200, downtimesDTO);
    mock.onGet(`/bff/v1/downtime/legal-facts/${downtimesDTO.result[0].legalFactId}`).reply(200, {
      filename: 'mocked-file',
      contentLength: 999,
      url: 'https://www.mocked-url.com',
    });
    await act(async () => {
      render(<AppStatusWithErrorHandling />);
    });
    const downtimeLogTableRows = screen.queryAllByTestId('tableDowntimeLog.row');
    const dowloadButton = within(downtimeLogTableRows[0]).queryByTestId('download-legal-fact');
    fireEvent.click(dowloadButton!);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(3);
    });
    await waitFor(() => {
      expect(window.location.href).toBe('https://www.mocked-url.com');
    });
  });

  it('Desktop - change pagination and size', async () => {
    mock.onGet('/bff/v1/downtime/status').reply(200, currentStatusDTO);
    mock.onGet(/\/bff\/v1\/downtime\/history.*/).reply(function (config) {
      if (config.url?.includes('size=10') && config.url?.includes('page=1')) {
        return [200, { ...downtimesDTO, result: downtimesDTO.result.slice(1) }];
      } else if (config.url?.includes('size=20')) {
        return [200, downtimesDTO];
      }
      return [200, { ...downtimesDTO, result: downtimesDTO.result.slice(0, 1) }];
    });
    await act(async () => {
      render(<AppStatusWithErrorHandling />);
    });
    let rows = screen.queryAllByTestId('tableDowntimeLog.row');
    expect(rows).toHaveLength(1);
    rows.forEach((row, index) => {
      expect(row).toHaveTextContent(formatDate(downtimesDTO.result[index].startDate));
    });
    expect(mock.history.get).toHaveLength(2);
    // change page
    const pageSelector = screen.getByTestId('pageSelector');
    const pageButtons = pageSelector?.querySelectorAll('button');
    // the buttons are < 1 >
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(4);
    });
    await waitFor(() => {
      rows = screen.getAllByTestId('tableDowntimeLog.row');
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveTextContent(formatDate(downtimesDTO.result[1].startDate));
    });
    // change size
    const itemsPerPageSelector = screen.getByTestId('itemsPerPageSelector');
    const button = itemsPerPageSelector?.querySelector('button');
    fireEvent.click(button!);
    const itemsPerPageList = screen.getAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]);
    await waitFor(() => {
      expect(mock.history.get).toHaveLength(6);
    });
    await waitFor(() => {
      rows = screen.getAllByTestId('tableDowntimeLog.row');
      expect(rows).toHaveLength(2);
      rows.forEach((row, index) => {
        expect(row).toHaveTextContent(formatDate(downtimesDTO.result[index].startDate));
      });
    });
  });
});
