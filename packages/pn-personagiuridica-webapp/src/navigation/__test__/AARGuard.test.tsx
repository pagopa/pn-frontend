import React from 'react';
import { act, screen } from '@testing-library/react';

import {
  DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM,
  GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH,
  GET_DETTAGLIO_NOTIFICA_PATH,
} from '../routes.const';
import { render } from '../../__test__/test-utils';
import AARGuard from '../AARGuard';

const mockNavigateFn = jest.fn(() => {});

/* eslint-disable functional/no-let */
let mockQrCode: string;
/* eslint-enable functional/no-let */

const mockQrCodeQueryParam = DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM;

jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigateFn,
    useLocation: () => ({ search: `?${mockQrCodeQueryParam}=${mockQrCode}` }),
    Outlet: () => <div>Mocked Outlet</div>,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => {
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    AccessDenied: () => <div data-testid="mock-access-denied">Access Denied</div>,
  };
});

jest.mock('../../api/notifications/Notifications.api', () => {
  return {
    NotificationsApi: {
      exchangeNotificationQrCode: (qrCode: string) =>
        qrCode === 'bad-qr-code'
          ? Promise.reject({ response: { status: 500 } })
          : qrCode === 'qr-code-1'
          ? Promise.resolve({
              iun: 'mock-iun-1',
            })
          : Promise.resolve({
              iun: 'mock-iun-2',
              mandateId: 'mock-mandateId-2',
            }),
    },
  };
});

describe('Notification from QR code', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('QR code requested by a delegate', async () => {
    mockQrCode = 'qr-code-2';
    await act(async () => void render(<AARGuard />));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH('mock-iun-2', 'mock-mandateId-2'),
      { replace: true, state: { fromQrCode: true } }
    );
    const accessDeniedComponent = screen.queryByTestId('mock-access-denied');
    expect(accessDeniedComponent).not.toBeInTheDocument();
  });

  it('QR code requested by a recipient', async () => {
    mockQrCode = 'qr-code-1';
    await act(async () => void render(<AARGuard />));
    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(GET_DETTAGLIO_NOTIFICA_PATH('mock-iun-1'), {
      replace: true,
      state: { fromQrCode: true },
    });
    const accessDeniedComponent = screen.queryByTestId('mock-access-denied');
    expect(accessDeniedComponent).not.toBeInTheDocument();
  });

  it('invalid QR code', async () => {
    mockQrCode = 'bad-qr-code';
    await act(async () => void render(<AARGuard />));
    expect(mockNavigateFn).toBeCalledTimes(0);
    const accessDeniedComponent = screen.queryByTestId('mock-access-denied');
    expect(accessDeniedComponent).toBeInTheDocument();
  });

  it('no QR code', async () => {
    mockQrCode = '';
    await act(async () => void render(<AARGuard />));
    expect(mockNavigateFn).toBeCalledTimes(0);
    const outletComponent = screen.queryByText('Mocked Outlet');
    expect(outletComponent).toBeInTheDocument();
  });
});
