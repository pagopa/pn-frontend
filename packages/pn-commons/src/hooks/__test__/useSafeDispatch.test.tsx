import { Provider } from 'react-redux';
import { beforeEach, describe, expect, it } from 'vitest';

import { AnyAction, Middleware, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

import { act, renderHook } from '../../test-utils';
import { AbortablePromise, useSafeDispatch } from '../useSafeDispatch';

// --- MOCK ASYNC THUNKS ---
// Async thunks with a small real delay so we can abort them before they finish
const mockFetchUsers = createAsyncThunk<string, string>(
  'mock/fetchUsers',
  async (query: string, { signal }) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve(`Users for: ${query}`), 50);
      // RTK propagates the abort via the native AbortSignal
      signal.addEventListener('abort', () => {
        clearTimeout(timer);
        reject(new Error('Aborted by signal'));
      });
    });
  }
);

const mockFetchPosts = createAsyncThunk<string, number>('mock/fetchPosts', async (page: number) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Page: ${page}`), 50);
  });
});

describe('test useSafeDispatch hook', () => {
  let store: ReturnType<typeof configureStore>;
  let dispatchedActions: AnyAction[] = [];

  // Custom middleware to record the action history like a "log tape"
  const actionTrackerMiddleware: Middleware = () => (next) => (action) => {
    dispatchedActions.push(action as AnyAction);
    return next(action);
  };

  const setupStore = () => {
    return configureStore({
      reducer: { mock: (state = {}) => state },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionTrackerMiddleware),
    });
  };

  beforeEach(() => {
    dispatchedActions = [];
    store = setupStore();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it('should dispatch standard synchronous actions to the store', () => {
    const { result } = renderHook(() => useSafeDispatch(), { wrapper });
    const standardAction = { type: 'TEST_SYNC_ACTION', payload: 123 };

    act(() => {
      result.current(standardAction);
    });

    // Check the array of recorded actions
    expect(dispatchedActions).toContainEqual(standardAction);
  });

  it('should process already invoked thunk actions normally (fallback)', async () => {
    const { result } = renderHook(() => useSafeDispatch(), { wrapper });

    let promise: AbortablePromise<unknown> | undefined;

    act(() => {
      // Pass the already invoked thunk (classic RTK usage)
      promise = result.current(mockFetchUsers('mario'));
    });

    await act(async () => {
      await promise;
    });

    // RTK natively emits pending and then fulfilled
    const actionTypes = dispatchedActions.map((a) => a.type);
    expect(actionTypes).toEqual(['mock/fetchUsers/pending', 'mock/fetchUsers/fulfilled']);
  });

  it('should reject the first promise and dispatch an aborted action on rapid consecutive calls', async () => {
    const { result } = renderHook(() => useSafeDispatch(), { wrapper });

    let promise1: AbortablePromise<unknown> | undefined;
    let promise2: AbortablePromise<unknown> | undefined;

    act(() => {
      // First click
      promise1 = result.current(mockFetchUsers, 'first-click');
      // Immediate second click
      promise2 = result.current(mockFetchUsers, 'second-click');
    });

    await act(async () => {
      // We must catch the first promise because the abort causes a rejection
      try {
        await promise1;
      } catch {
        /* ignored */
      }
      await promise2;
    });

    // Verify the exact payloads of the actions in the store
    const rejectedAction = dispatchedActions.find((a) => a.type === 'mock/fetchUsers/rejected');
    const fulfilledAction = dispatchedActions.find((a) => a.type === 'mock/fetchUsers/fulfilled');

    // The first call MUST be marked as aborted by Redux Toolkit
    expect(rejectedAction).toBeDefined();
    expect(rejectedAction?.meta.aborted).toBe(true);
    expect(rejectedAction?.meta.arg).toBe('first-click'); // The parameter of the first call

    // The second call MUST have succeeded
    expect(fulfilledAction).toBeDefined();
    expect(fulfilledAction?.meta.arg).toBe('second-click');
  });

  it('should handle parallel requests from different thunks without interference', async () => {
    const { result } = renderHook(() => useSafeDispatch(), { wrapper });

    let usersPromise: AbortablePromise<unknown> | undefined;
    let postsPromise: AbortablePromise<unknown> | undefined;

    act(() => {
      usersPromise = result.current(mockFetchUsers, 'mario');
      postsPromise = result.current(mockFetchPosts, 1);
    });

    await act(async () => {
      await Promise.all([usersPromise, postsPromise]);
    });

    const actionTypes = dispatchedActions.map((a) => a.type);

    // Both must have finished the cycle with "fulfilled" without any "rejected"
    expect(actionTypes).toContain('mock/fetchUsers/fulfilled');
    expect(actionTypes).toContain('mock/fetchPosts/fulfilled');
    expect(actionTypes).not.toContain('mock/fetchUsers/rejected');
    expect(actionTypes).not.toContain('mock/fetchPosts/rejected');
  });

  it('should abort pending requests when the component unmounts', async () => {
    const { result, unmount } = renderHook(() => useSafeDispatch(), { wrapper });

    let promise: AbortablePromise<unknown> | undefined;

    act(() => {
      promise = result.current(mockFetchUsers, 'mario');
    });

    act(() => {
      // Unmount the component while the request is still pending
      unmount();
    });

    await act(async () => {
      try {
        await promise;
      } catch {
        /* ignored */
      }
    });

    const rejectedAction = dispatchedActions.find((a) => a.type === 'mock/fetchUsers/rejected');

    // Here too, the action must be "rejected" and marked as aborted
    expect(rejectedAction).toBeDefined();
    expect(rejectedAction?.meta.aborted).toBe(true);

    // Verify that the abort reason has reached the native store
    expect(rejectedAction?.error.message).toBe('Aborted');
  });
});
