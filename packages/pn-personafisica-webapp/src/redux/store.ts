import { appStateReducer } from '@pagopa-pn/pn-commons';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { trackingMiddleware } from "../utils/mixpanel";
import { getConfiguration } from "../services/configuration.service";
import userSlice from './auth/reducers';
import appStatusSlice from './appStatus/reducers';
import dashboardSlice from './dashboard/reducers';
import notificationSlice from './notification/reducers';
import delegationsSlice from './delegation/reducers';
import newDelegationSlice from './newDelegation/reducers';
import contactsSlice from './contact/reducers';
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
  generalInfoState: generalInfoSlice.reducer
};

const createStore = (logReduxActions?: boolean) => {
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
