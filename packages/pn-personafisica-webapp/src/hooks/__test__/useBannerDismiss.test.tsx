import { FC, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { act, renderHook } from '@pagopa-pn/pn-commons/src/test-utils';
import { EnhancedStore } from '@reduxjs/toolkit';

import { createMockedStore } from '../../__test__/test-utils';
import { closeDomicileBanner } from '../../redux/sidemenu/reducers';
import { useBannerDismiss } from '../useBannerDismiss';

const TestStoreProvider = ({ children, store }: { children: ReactNode; store: EnhancedStore }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useBannerDismiss', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('should return open from store', () => {
    const store = createMockedStore({
      generalInfoState: { domicileBannerOpened: true },
    });

    const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <TestStoreProvider store={store}>{children}</TestStoreProvider>
    );

    const { result } = renderHook(() => useBannerDismiss(), { wrapper });
    expect(result.current.open).toBe(true);
  });

  it('handleClose should dispatch closeDomicileBanner and set sessionStorage', () => {
    const store = createMockedStore({
      generalInfoState: { domicileBannerOpened: true },
    });

    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const wrapper: FC<{ children: ReactNode }> = ({ children }) => (
      <TestStoreProvider store={store}>{children}</TestStoreProvider>
    );

    const { result } = renderHook(() => useBannerDismiss(), { wrapper });

    act(() => {
      result.current.handleClose();
    });

    expect(dispatchSpy).toHaveBeenCalledWith(closeDomicileBanner());
    expect(sessionStorage.getItem('domicileBannerClosed')).toBe('true');
  });
});
