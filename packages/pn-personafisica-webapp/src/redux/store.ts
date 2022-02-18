import { appStateReducer } from '@pagopa-pn/pn-commons/src/redux/slices/appStateSlice';
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { LOG_REDUX_ACTIONS } from '../utils/constants';
import userSlice from './auth/reducers';

const additionalMiddlewares = [LOG_REDUX_ACTIONS ? logger : undefined];

export const createStore = () =>
  configureStore({
    reducer: {
      appState: appStateReducer,
      userState: userSlice.reducer,
    },
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
