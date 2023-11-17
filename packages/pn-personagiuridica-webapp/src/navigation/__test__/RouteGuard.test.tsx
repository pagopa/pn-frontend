import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { userResponse } from '../../__mocks__/Auth.mock';
import { act, render, screen } from '../../__test__/test-utils';
import RouteGuard from '../RouteGuard';
import { DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM } from '../routes.const';

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

  it('No user logged', async () => {
    await act(async () => {
      render(<Guard />);
    });
    const pageComponent = screen.queryByText('Generic Page');
    const accessDeniedComponent = screen.queryByTestId('access-denied');
    expect(pageComponent).toBeNull();
    expect(accessDeniedComponent).toBeTruthy();
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

  it('Store aar in localStorage', async () => {
    const mockQrCode = 'qr-code';
    window.location.search = `?${DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM}=${mockQrCode}`;
    await act(async () => {
      render(<Guard />);
    });
    expect(localStorage.getItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM)).toBe(mockQrCode);
  });
});
