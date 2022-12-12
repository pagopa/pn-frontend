import { appStateReducer } from '@pagopa-pn/pn-commons';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { LOG_REDUX_ACTIONS } from '../utils/constants';
import { trackingMiddleware } from '../utils/mixpanel';
import appStatusSlice from './appStatus/reducers';
import userSlice from './auth/reducers';
import dashboardSlice from './dashboard/reducers';
import newApiKeySlice from './NewApiKey/reducers';
import newNotificationSlice from './newNotification/reducers';
import notificationSlice from './notification/reducers';
import apiKeysSlice from './apiKeys/reducers';
import statisticsSlice from "./statistics/reducers";

const additionalMiddlewares = [LOG_REDUX_ACTIONS ? logger : undefined, trackingMiddleware];

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
};

export const createStore = () =>
  configureStore({
    reducer: appReducers,
    middleware: (getDefaultMiddleware) =>
      additionalMiddlewares.reduce(
        (array, middleware) => (middleware ? array.concat(middleware) : array),
        getDefaultMiddleware({ serializableCheck: false })
      ),
  });

export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
