import React, { Suspense } from 'react';
import { vi } from 'vitest';

import { RenderResult, act, render, waitFor } from '../../test-utils';
import { lazyRetry } from '../lazyRetry.utility';

// When passing from jest to vitest, I changed the lazy action, since it seems that vitest
// yields an error whenever a dynamic import must be solved.
// ---------------------------------
// Carlos Lombardi, 2023-11-10
// ---------------------------------
describe('test lazy loading retry', () => {
  const original = window.location;

  const reloadFn = vi.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadFn },
    });
  });

  afterEach(() => {
    reloadFn.mockRestore();
    vi.resetModules();
    sessionStorage.removeItem('retry-lazy-refreshed');
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('test lazyRetry - component loaded at first try', async () => {
    const LazyComponent = lazyRetry(() => Promise.resolve(
      {default: ({children}) => <div>{children}</div>})
    );
    let result: RenderResult;
    await act(async () => {
      result = render(
        <Suspense fallback={'Loading...'}>
          <LazyComponent>mocked-empty-message</LazyComponent>
        </Suspense>
      );
    });
    await waitFor(() => {
      const refreshFlag = sessionStorage.getItem('retry-lazy-refreshed');
      expect(result.container).toHaveTextContent('mocked-empty-message');
      expect(refreshFlag).toBeNull();
    }, { timeout: 10000, interval: 200 });
  }, 20000);

  it('test lazyRetry - component loading fails at first try', async () => {
    // vi.mock('../../components/EmptyState', () => {
    //   throw new Error('Chunk loading error');
    // });
    // const LazyComponent = lazyRetry(() => import('../../components/EmptyState'));
    const LazyComponent = lazyRetry(() => Promise.reject('Error loading component'));
    render(
      <Suspense fallback={'Loading...'}>
        <LazyComponent />
      </Suspense>
    );
    await waitFor(() => {
      const refreshFlag = sessionStorage.getItem('retry-lazy-refreshed');
      expect(refreshFlag).toBeTruthy();
      expect(reloadFn).toBeCalledTimes(1);
    });
  });

  it('test lazyRetry - component loading fails at second try', async () => {
    // vi.mock('../../components/EmptyState', () => {
    //   throw new Error('Chunk loading error');
    // });
    // const LazyComponent = lazyRetry(() => import('../../components/EmptyState'));
    const LazyComponent = lazyRetry(() => Promise.reject('Error loading component'));
    sessionStorage.setItem('retry-lazy-refreshed', 'true');
    const result = render(
      <Suspense fallback={'Loading...'}>
        <LazyComponent />
      </Suspense>
    );
    await waitFor(() => {
      const refreshFlag = sessionStorage.getItem('retry-lazy-refreshed');
      expect(refreshFlag).toBeNull();
      expect(reloadFn).toBeCalledTimes(0);
      expect(result.container).toHaveTextContent('Loading failed');
    });
  });
});
