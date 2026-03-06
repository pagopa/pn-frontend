import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { BffCheckTPPResponse } from '../../generated-client/notifications';
import { AAR_UTM_CAMPAIGN, AAR_UTM_MEDIUM, AAR_UTM_SOURCE } from '../../utility/utm.utility';
import RapidAccessGuard from '../RapidAccessGuard';
import { GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH, GET_DETTAGLIO_NOTIFICA_PATH } from '../routes.const';

type NavigateArgs = [to: unknown, options?: unknown];
const mockNavigateFn = vi.fn<NavigateArgs, void>();

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
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
    globalThis.window.history.replaceState({}, '', '/');
  });

  afterAll(() => {
    mock.restore();
  });

  describe('Notification from QR code', async () => {
    it('QR code requested by a recipient', async () => {
      const mockQrCode = 'qr-code';
      globalThis.window.history.replaceState({}, '', `/?${AppRouteParams.AAR}=${mockQrCode}`);
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

        const [to, options] = mockNavigateFn.mock.calls[0];

        expect(to).toMatchObject({
          pathname: GET_DETTAGLIO_NOTIFICA_PATH('mock-iun'),
        });

        const sp = new URLSearchParams((to as any).search);
        expect(sp.has(AppRouteParams.AAR)).toBe(false);
        expect(sp.get('utm_source')).toBe(AAR_UTM_SOURCE);
        expect(sp.get('utm_medium')).toBe(AAR_UTM_MEDIUM);
        expect(sp.get('utm_campaign')).toBe(AAR_UTM_CAMPAIGN);

        expect(options).toEqual({
          replace: true,
          state: { source: AppRouteParams.AAR },
        });
      });
      const accessDeniedComponent = screen.queryByTestId('access-denied');
      expect(accessDeniedComponent).not.toBeInTheDocument();
    });

    it('QR code requested by a delegate', async () => {
      const mockQrCode = 'qr-code-delegate';
      globalThis.window.history.replaceState({}, '', `/?${AppRouteParams.AAR}=${mockQrCode}`);
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

        const [to, options] = mockNavigateFn.mock.calls[0];

        expect(to).toMatchObject({
          pathname: GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH('mock-iun', 'mock-mandateId'),
        });

        const sp = new URLSearchParams((to as any).search);
        expect(sp.has(AppRouteParams.AAR)).toBe(false);
        expect(sp.get('utm_source')).toBe(AAR_UTM_SOURCE);
        expect(sp.get('utm_medium')).toBe(AAR_UTM_MEDIUM);
        expect(sp.get('utm_campaign')).toBe(AAR_UTM_CAMPAIGN);

        expect(options).toEqual({
          replace: true,
          state: { source: AppRouteParams.AAR },
        });
      });
      const accessDeniedComponent = screen.queryByTestId('access-denied');
      expect(accessDeniedComponent).not.toBeInTheDocument();
    });

    it('invalid QR code', async () => {
      const mockQrCode = 'bad-qr-code';
      globalThis.window.history.replaceState({}, '', `/?${AppRouteParams.AAR}=${mockQrCode}`);
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
      globalThis.window.history.replaceState({}, '', `/?${AppRouteParams.AAR}=${mockQrCode}`);
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
      globalThis.window.history.replaceState({}, '', `/?${AppRouteParams.AAR}=${mockQrCode}`);
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
      globalThis.window.history.replaceState(
        {},
        '',
        `/?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}`
      );
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

        const [to, options] = mockNavigateFn.mock.calls[0];

        expect(to).toMatchObject({
          pathname: GET_DETTAGLIO_NOTIFICA_PATH('mock-iun'),
        });

        const sp = new URLSearchParams((to as any).search);
        expect(sp.has(AppRouteParams.RETRIEVAL_ID)).toBe(false);

        expect(options).toEqual({
          replace: true,
          state: { source: AppRouteParams.RETRIEVAL_ID },
        });
      });
      const accessDeniedComponent = screen.queryByTestId('access-denied');
      expect(accessDeniedComponent).not.toBeInTheDocument();
    });
  });
});
