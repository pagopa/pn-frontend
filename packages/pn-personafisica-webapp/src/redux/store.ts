import logger from 'redux-logger';

import { appStateReducer } from '@pagopa-pn/pn-commons';
import { configureStore } from '@reduxjs/toolkit';

import { getConfiguration } from '../services/configuration.service';
import { trackingMiddleware } from '../utility/mixpanel';
import appStatusSlice from './appStatus/reducers';
import userSlice from './auth/reducers';
import contactsSlice from './contact/reducers';
import dashboardSlice from './dashboard/reducers';
import delegationsSlice from './delegation/reducers';
import newDelegationSlice from './newDelegation/reducers';
import notificationSlice from './notification/reducers';
import generalInfoSlice from './sidemenu/reducers';

export const appReducers = {
  appState: appStateReducer,
  userState: userSlice.reducer,
  appStatus: appStatusSlice.reducer,
  dashboardState: dashboardSlice.reducer,
  notificationState: notificationSlice.reducer,
  delegationsState: delegationsSlice.reducer,
  newDelegationState: newDelegationSlice.reducer,
  contactsState: contactsSlice.reducer,
  generalInfoState: generalInfoSlice.reducer,
};

const createStore = (logReduxActions?: boolean) => {
  const mustLogActions = logReduxActions ?? getConfiguration().LOG_REDUX_ACTIONS;
  const additionalMiddlewares = [mustLogActions ? logger : undefined, trackingMiddleware];
  return configureStore({
    reducer: appReducers,
    middleware: (getDefaultMiddleware) =>
      additionalMiddlewares.reduce(
        (array, middleware) => (middleware ? array.concat(middleware) : array) as any,
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

export function getStore() {
  return store;
}

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
export type RootState = ReturnType<ReturnType<typeof createStore>['getState']>;

// export type AppDispatch = typeof store.dispatch;
export type AppDispatch = ReturnType<typeof createStore>['dispatch'];
