import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';

import { RenderResult, act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import AARGuard from '../AARGuard';
import {
  DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM,
  GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH,
  GET_DETTAGLIO_NOTIFICA_PATH,
} from '../routes.const';

const Guard = () => (
  <Routes>
    <Route element={<AARGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('Notification from QR code', async () => {
  let mock: MockAdapter;
  let result: RenderResult;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('QR code requested by a recipient', async () => {
    const mockQrCode = 'qr-code';
    mock
      .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
      .reply(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve([200, { iun: 'mock-iun' }]);
            }, 200);
          })
      );
    await act(async () => {
      result = render(<Guard />, {
        route: `/?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`,
      });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe('/bff/v1/notifications/received/check-aar-qr-code');
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      aarQrCodeValue: mockQrCode,
    });
    const loadingComponent = screen.queryByTestId('loading-skeleton');
    expect(loadingComponent).toBeInTheDocument();
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(GET_DETTAGLIO_NOTIFICA_PATH('mock-iun'));
      expect(result.router.state.historyAction).toBe('REPLACE');
      expect(result.router.state.location.state).toEqual({ fromQrCode: true });
    });
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(accessDeniedComponent).not.toBeInTheDocument();
  });

  it('QR code requested by a delegate', async () => {
    const mockQrCode = 'qr-code-delegate';
    mock
      .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
      .reply(200, { iun: 'mock-iun', mandateId: 'mock-mandateId' });
    await act(async () => {
      result = render(<Guard />, {
        route: `/?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`,
      });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe('/bff/v1/notifications/received/check-aar-qr-code');
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      aarQrCodeValue: mockQrCode,
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe(
        GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH('mock-iun', 'mock-mandateId')
      );
      expect(result.router.state.historyAction).toBe('REPLACE');
      expect(result.router.state.location.state).toEqual({ fromQrCode: true });
    });
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(accessDeniedComponent).not.toBeInTheDocument();
  });

  it('invalid QR code', async () => {
    const mockQrCode = 'bad-qr-code';
    mock
      .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
      .reply(500);
    await act(async () => {
      result = render(<Guard />, {
        route: `/?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`,
      });
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe('/bff/v1/notifications/received/check-aar-qr-code');
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      aarQrCodeValue: mockQrCode,
    });
    await waitFor(() => {
      expect(result.router.state.location.pathname).toBe('/');
    });
    const accessDeniedComponent = screen.getByTestId('access-denied');
    expect(accessDeniedComponent).toBeInTheDocument();
    expect(accessDeniedComponent).toHaveTextContent('from-qrcode.not-found');
  });

  it('invalid recipient accesses to QR code', async () => {
    const mockQrCode = 'bad-qr-code';
    mock
      .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
      .reply(404);
    await act(async () => {
      result = render(<Guard />, {
        route: `/?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`,
      });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    const titleAccessDeniedComponent = await screen.findByText('from-qrcode.not-found');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
    expect(titleAccessDeniedComponent).toBeInTheDocument();
  });

  it('no QR code', async () => {
    const mockQrCode = '';
    await act(async () => {
      result = render(<Guard />, {
        route: `/?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`,
      });
    });
    expect(mock.history.post).toHaveLength(0);
    expect(result.router.state.location.pathname).toBe('/');

    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });
});
