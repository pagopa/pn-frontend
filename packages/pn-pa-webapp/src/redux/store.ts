import { appStateReducer } from '@pagopa-pn/pn-commons';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { trackingMiddleware } from '../utils/mixpanel';
import { getConfiguration } from '../services/configuration.service';
import appStatusSlice from './appStatus/reducers';
import userSlice from './auth/reducers';
import dashboardSlice from './dashboard/reducers';
import newApiKeySlice from './NewApiKey/reducers';
import newNotificationSlice from './newNotification/reducers';
import notificationSlice from './notification/reducers';
import apiKeysSlice from './apiKeys/reducers';
import statisticsSlice from "./statistics/reducers";
import profilingSlice from "./profiling/reducers";
import usageEstimateSlice from "./usageEstimation/reducers";


export const appReducers = {
  appState: appStateReducer,
  userState: userSlice.reducer,
  appStatus: appStatusSlice.reducer,
  dashboardState: dashboardSlice.reducer,
  notificationState: notificationSlice.reducer,
  newNotificationState: newNotificationSlice.reducer,
  apiKeysState: apiKeysSlice.reducer,
  newApiKeyState: newApiKeySlice.reducer,
  statisticsState: statisticsSlice.reducer,
  profilingState: profilingSlice.reducer,
  usageEstimateState: usageEstimateSlice.reducer
};

const createStore = (logReduxActions?: boolean) =>{
  const mustLogActions = logReduxActions ?? getConfiguration().LOG_REDUX_ACTIONS;
  const additionalMiddlewares = [mustLogActions ? logger : undefined, trackingMiddleware];
  return configureStore({
    reducer: appReducers,
    middleware: (getDefaultMiddleware) =>
      additionalMiddlewares.reduce(
        (array, middleware) => (middleware ? array.concat(middleware) : array),
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
