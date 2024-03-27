import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { act, render, screen, waitFor } from '../../__test__/test-utils';
import { apiClient } from '../../api/apiClients';
import { NOTIFICATION_ID_FROM_QRCODE } from '../../api/notifications/notifications.routes';
import AARGuard from '../AARGuard';
import {
  DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM,
  GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH,
  GET_DETTAGLIO_NOTIFICA_PATH,
} from '../routes.const';

const mockNavigateFn = jest.fn(() => {});

// mock imports
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigateFn,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const Guard = () => (
  <Routes>
    <Route path="/" element={<AARGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('Notification from QR code', () => {
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
    jest.clearAllMocks();
  });

  afterAll(() => {
    mock.restore();
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  it('QR code requested by a recipient', async () => {
    const mockQrCode = 'qr-code';
    window.location.search = `?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`;
    mock.onPost(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: mockQrCode }).reply(
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
    expect(mock.history.post[0].url).toBe(NOTIFICATION_ID_FROM_QRCODE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      aarQrCodeValue: mockQrCode,
    });
    const loadingComponent = screen.queryByTestId('loading-skeleton');
    expect(loadingComponent).toBeInTheDocument();
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(GET_DETTAGLIO_NOTIFICA_PATH('mock-iun'), {
        replace: true,
        state: { fromQrCode: true },
      });
    });
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(accessDeniedComponent).not.toBeInTheDocument();
  });

  it('QR code requested by a delegate', async () => {
    const mockQrCode = 'qr-code-delegate';
    window.location.search = `?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`;
    mock
      .onPost(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: mockQrCode })
      .reply(200, { iun: 'mock-iun', mandateId: 'mock-mandateId' });
    await act(async () => {
      render(<Guard />);
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(NOTIFICATION_ID_FROM_QRCODE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      aarQrCodeValue: mockQrCode,
    });
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(1);
      expect(mockNavigateFn).toBeCalledWith(
        GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH('mock-iun', 'mock-mandateId'),
        { replace: true, state: { fromQrCode: true } }
      );
    });
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(accessDeniedComponent).not.toBeInTheDocument();
  });

  it('invalid QR code', async () => {
    const mockQrCode = 'bad-qr-code';
    window.location.search = `?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`;
    mock.onPost(NOTIFICATION_ID_FROM_QRCODE(), { aarQrCodeValue: mockQrCode }).reply(500);
    await act(async () => {
      render(<Guard />);
    });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.post[0].url).toBe(NOTIFICATION_ID_FROM_QRCODE());
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      aarQrCodeValue: mockQrCode,
    });
    await waitFor(() => {
      expect(mockNavigateFn).toBeCalledTimes(0);
    });
    const accessDeniedComponent = screen.getByTestId('access-denied');
    expect(accessDeniedComponent).toBeInTheDocument();
    expect(accessDeniedComponent).toHaveTextContent('from-qrcode.not-found');
  });

  it('no QR code', async () => {
    const mockQrCode = '';
    window.location.search = `?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`;
    await act(async () => {
      render(<Guard />);
    });
    expect(mock.history.post).toHaveLength(0);
    expect(mockNavigateFn).toBeCalledTimes(0);
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });
});
