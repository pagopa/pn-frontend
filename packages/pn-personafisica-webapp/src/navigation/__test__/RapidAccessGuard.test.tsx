import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { BffCheckTPPResponse } from '../../generated-client/notifications';
import RapidAccessGuard from '../RapidAccessGuard';
import { GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH, GET_DETTAGLIO_NOTIFICA_PATH } from '../routes.const';

const mockNavigateFn = vi.fn(() => {});

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const Guard = () => (
  <Routes>
    <Route path="/" element={<RapidAccessGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('Rapid access Guard', async () => {
  const original = window.location;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '' },
    });
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  describe('Notification from QR code', async () => {
    it('QR code requested by a recipient', async () => {
      const mockQrCode = 'qr-code';
      window.location.search = `?${AppRouteParams.AAR}=${mockQrCode}`;
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
        render(<Guard />);
      });
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe('/bff/v1/notifications/received/check-aar-qr-code');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        aarQrCodeValue: mockQrCode,
      });
      const loadingComponent = screen.queryByTestId('loading-skeleton');
      expect(loadingComponent).toBeInTheDocument();
      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledTimes(1);
        expect(mockNavigateFn).toHaveBeenCalledWith(GET_DETTAGLIO_NOTIFICA_PATH('mock-iun'), {
          replace: true,
          state: { source: AppRouteParams.AAR },
        });
      });
      const accessDeniedComponent = screen.queryByTestId('access-denied');
      expect(accessDeniedComponent).not.toBeInTheDocument();
    });

    it('QR code requested by a delegate', async () => {
      const mockQrCode = 'qr-code-delegate';
      window.location.search = `?${AppRouteParams.AAR}=${mockQrCode}`;
      mock
        .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
        .reply(200, { iun: 'mock-iun', mandateId: 'mock-mandateId' });
      await act(async () => {
        render(<Guard />);
      });
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe('/bff/v1/notifications/received/check-aar-qr-code');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        aarQrCodeValue: mockQrCode,
      });
      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledTimes(1);
        expect(mockNavigateFn).toHaveBeenCalledWith(
          GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH('mock-iun', 'mock-mandateId'),
          { replace: true, state: { source: AppRouteParams.AAR } }
        );
      });
      const accessDeniedComponent = screen.queryByTestId('access-denied');
      expect(accessDeniedComponent).not.toBeInTheDocument();
    });

    it('invalid QR code', async () => {
      const mockQrCode = 'bad-qr-code';
      window.location.search = `?${AppRouteParams.AAR}=${mockQrCode}`;
      mock
        .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
        .reply(500);
      await act(async () => {
        render(<Guard />);
      });
      expect(mock.history.post).toHaveLength(1);
      expect(mock.history.post[0].url).toBe('/bff/v1/notifications/received/check-aar-qr-code');
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        aarQrCodeValue: mockQrCode,
      });
      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledTimes(0);
      });
      const accessDeniedComponent = screen.getByTestId('access-denied');
      expect(accessDeniedComponent).toBeInTheDocument();
      expect(accessDeniedComponent).toHaveTextContent('from-qrcode.not-found');
    });

    it('invalid recipient accesses to QR code', async () => {
      const mockQrCode = 'bad-qr-code';
      window.location.search = `?${AppRouteParams.AAR}=${mockQrCode}`;
      mock
        .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
        .reply(404);
      await act(async () => {
        render(<Guard />);
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
      window.location.search = `?${AppRouteParams.AAR}=${mockQrCode}`;
      await act(async () => {
        render(<Guard />);
      });
      expect(mock.history.post).toHaveLength(0);
      expect(mockNavigateFn).toHaveBeenCalledTimes(0);
      const pageComponent = screen.queryByText('Generic Page');
      expect(pageComponent).toBeTruthy();
    });
  });

  describe('Notification from retrievalId', async () => {
    it('retrievalId requested by a recipient', async () => {
      const mockRetrievalId = 'retrieval-id';
      const url = `/bff/v1/notifications/received/check-tpp?retrievalId=${mockRetrievalId}`;
      window.location.search = `?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`;
      mock.onGet(url).reply(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve([
                200,
                { originId: 'mock-iun', retrievalId: mockRetrievalId } as BffCheckTPPResponse,
              ]);
            }, 200);
          })
      );
      await act(async () => {
        render(<Guard />);
      });
      expect(mock.history.get).toHaveLength(1);
      expect(mock.history.get[0].url).toBe(url);
      const loadingComponent = screen.queryByTestId('loading-skeleton');
      expect(loadingComponent).toBeInTheDocument();
      await waitFor(() => {
        expect(mockNavigateFn).toHaveBeenCalledTimes(1);
        expect(mockNavigateFn).toHaveBeenCalledWith(GET_DETTAGLIO_NOTIFICA_PATH('mock-iun'), {
          replace: true,
          state: { source: AppRouteParams.RETRIEVAL_ID },
        });
      });
      const accessDeniedComponent = screen.queryByTestId('access-denied');
      expect(accessDeniedComponent).not.toBeInTheDocument();
    });
  });
});
