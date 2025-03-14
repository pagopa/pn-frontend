import logger from 'redux-logger';

import { IS_DEVELOP, appStateReducer } from '@pagopa-pn/pn-commons';
import { Middleware, MiddlewareArray, configureStore } from '@reduxjs/toolkit';

import apiKeysSlice from './apiKeys/reducers';
import appStatusSlice from './appStatus/reducers';
import userSlice from './auth/reducers';
import dashboardSlice from './dashboard/reducers';
import newNotificationSlice from './newNotification/reducers';
import notificationSlice from './notification/reducers';
import statisticsSlice from './statistics/reducers';

export const appReducers = {
  appState: appStateReducer,
  userState: userSlice.reducer,
  appStatus: appStatusSlice.reducer,
  dashboardState: dashboardSlice.reducer,
  notificationState: notificationSlice.reducer,
  newNotificationState: newNotificationSlice.reducer,
  apiKeysState: apiKeysSlice.reducer,
  statisticsState: statisticsSlice.reducer,
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
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;

// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
