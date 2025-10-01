import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import RouteGuard from '../RouteGuard';
import { DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM } from '../routes.const';

const mockNavigateFn = vi.fn(() => {});

// mock imports
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const mockReduxState = {
  userState: {
    user: userResponse,
  },
};

const Guard = () => (
  <Routes>
    <Route path="/" element={<RouteGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('RouteGuard component', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '' },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { writable: true, value: original });
  });

  it('Logged user', async () => {
    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeTruthy();
    expect(accessDeniedComponent).toBeNull();
  });

  it('Get aar from localStorage', async () => {
    const mockQrCode = 'qr-code';
    localStorage.setItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM, mockQrCode);

    await act(async () => {
      render(<Guard />, { preloadedState: mockReduxState });
    });

    expect(mockNavigateFn).toBeCalledTimes(1);
    expect(mockNavigateFn).toBeCalledWith(
      { pathname: '/', search: '?aar=' + mockQrCode },
      {
        replace: true,
      }
    );

    expect(localStorage.getItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM)).toBeNull();
  });
});
