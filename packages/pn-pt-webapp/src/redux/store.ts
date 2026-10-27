import logger from 'redux-logger';

import { IS_DEVELOP, appStateReducer } from '@pagopa-pn/pn-commons';
import { Middleware, MiddlewareArray, configureStore } from '@reduxjs/toolkit';

import userSlice from './auth/reducers';

export const appReducers = {
  appState: appStateReducer,
  userState: userSlice.reducer,
};

const createStore = (logReduxActions?: boolean) => {
  const mustLogActions = logReduxActions ?? IS_DEVELOP;
  const additionalMiddlewares = [mustLogActions ? logger : undefined];
  return configureStore({
    reducer: appReducers,
    middleware: (getDefaultMiddleware) =>
      additionalMiddlewares.reduce(
        (array, middleware) =>
          (middleware ? array.concat(middleware) : array) as MiddlewareArray<[Middleware]>,
        getDefaultMiddleware({ serializableCheck: false })
      ),
  });
};

// eslint-disable-next-line functional/no-let
export let store: ReturnType<typeof createStore>;

export function initStore(logReduxActions?: boolean): void {
  // eslint-disable-next-line prefer-const
  store = createStore(logReduxActions);
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;

export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
