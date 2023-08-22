import React, { Suspense } from 'react';

import { render, waitFor } from '../../../test-utils';
import { lazyRetry } from '../../lazyRetry.utility';

describe('test lazy loading retry', () => {
  const original = window.location;

  const reloadFn = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadFn },
    });
  });

  afterEach(() => {
    reloadFn.mockRestore();
    jest.resetModules();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('test lazyRetry - component loaded at first try', async () => {
    jest.mock('../../../components/EmptyState', () => () => <>Chunk loaded</>);
    const LazyComponent = lazyRetry(() => import('../../../components/EmptyState'));
    const result = render(
      <Suspense fallback={'Loading...'}>
        <LazyComponent />
      </Suspense>
    );
    await waitFor(() => {
      const refreshFlag = sessionStorage.getItem('retry-lazy-refreshed');
      expect(result.container).toHaveTextContent('Chunk loaded');
      expect(refreshFlag).toBeNull();
    });
  });

  it('test lazyRetry - component loading fails at first try', async () => {
    jest.mock('../../../components/EmptyState', () => {
      throw new Error('Chunk loading error');
    });
    const LazyComponent = lazyRetry(() => import('../../../components/EmptyState'));
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
    jest.mock('../../../components/EmptyState', () => {
      throw new Error('Chunk loading error');
    });
    const LazyComponent = lazyRetry(() => import('../../../components/EmptyState'));
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
