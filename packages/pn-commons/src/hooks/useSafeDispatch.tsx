import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { AnyAction, AsyncThunk, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';

// Define the structure of the Promise
export interface AbortablePromise<T = unknown> extends Promise<T> {
  abort: (reason?: string) => void;
}

type SafeDispatch<TDispatch extends ThunkDispatch<any, any, AnyAction>> = TDispatch &
  (<R, A>(
    actionCreator: AsyncThunk<R, A, any>,
    ...args: Parameters<AsyncThunk<R, A, any>>
  ) => AbortablePromise);

const isAsyncThunkCreator = <R, A>(item: unknown): item is AsyncThunk<R, A, any> =>
  typeof item === 'function' && 'typePrefix' in item;

const isAbortable = (promise: unknown): promise is AbortablePromise =>
  !!promise &&
  typeof promise === 'object' &&
  'abort' in promise &&
  typeof (promise as Record<string, unknown>).abort === 'function';

export const useSafeDispatch = <TDispatch extends ThunkDispatch<any, any, AnyAction>>() => {
  const dispatch = useDispatch<TDispatch>();

  // Use Ref to store the api calls
  const activeRequests = useRef(new Map<string, AbortablePromise>());

  // UNMOUNT: When the component is unmounted, we abort all the api
  useEffect(
    () => () => {
      activeRequests.current.forEach((promise) => promise.abort());
      activeRequests.current.clear();
    },
    []
  );

  // This function replaces the standard dispatch to manage mduplicated api call
  const safeDispatch = useCallback(
    (actionOrCreator: AnyAction | ThunkAction<unknown, any, any, AnyAction>, payload?: unknown) => {
      // Check if we are in the Overload 1
      if (isAsyncThunkCreator(actionOrCreator)) {
        // We use the name of the action (es. 'data/fetchData') as key to understand
        // if we are calling a duplicate
        const actionKey = actionOrCreator.typePrefix;

        // If same api call exists, we kill it!
        if (activeRequests.current.has(actionKey)) {
          activeRequests.current.get(actionKey)?.abort();
        }

        // Call the new api
        const promise = dispatch(actionOrCreator(payload));

        if (isAbortable(promise)) {
          // Store the new api in the map
          activeRequests.current.set(actionKey, promise);

          // Automatic cleaning when the api call finishes (success, error or abort)
          void promise.finally(() => {
            if (activeRequests.current.get(actionKey) === promise) {
              activeRequests.current.delete(actionKey);
            }
          });
        }
        return promise;
      }
      return dispatch(actionOrCreator);
    },
    [dispatch]
  );

  return safeDispatch as SafeDispatch<TDispatch>;
};
