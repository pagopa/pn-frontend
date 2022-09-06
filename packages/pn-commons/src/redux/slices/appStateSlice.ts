import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppError, createAppMessage } from '../../services/message.service';
import { IAppMessage } from '../../types';

export interface AppStateState {
  loading: {
    result: boolean;
    tasks: { [taskId: string]: boolean };
  };
  messages: {
    errors: Array<IAppMessage>;
    success: Array<IAppMessage>;
  };
}

const initialState: AppStateState = {
  loading: {
    result: false,
    tasks: {},
  },
  messages: {
    errors: [],
    success: [],
  },
};

const isLoading = (action: AnyAction) => action.type.endsWith('/pending');

const isFulfilled = (action: AnyAction) => action.type.endsWith('/fulfilled');

const handleError = (action: AnyAction) => action.type.endsWith('/rejected');

function doRemoveErrorsByAction(action: string, errors: IAppMessage[]) {
  return errors.filter((e) => e.action !== action);
}

function actionProperType(action: AnyAction): string {
  return action.type.slice(0, action.type.indexOf("/"));
}

/* eslint-disable functional/immutable-data */
export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    removeError(state, action: PayloadAction<string>) {
      state.messages.errors = state.messages.errors.filter((e) => e.id !== action.payload);
    },
    removeErrorsByAction(state, action: PayloadAction<string>) {
      state.messages.errors = doRemoveErrorsByAction(action.payload, state.messages.errors);
    },
    setErrorAsAlreadyShown(state, action: PayloadAction<string>) {
      const theError = state.messages.errors.find((e) => e.id === action.payload);
      if (theError) {
        theError.alreadyShown = true;
      }
    },
    addSuccess(
      state,
      action: PayloadAction<{ title: string; message: string; status?: number }>
    ) {
      const message = createAppMessage(
        action.payload.title,
        action.payload.message,
        action.payload.status
      );
      state.messages.success.push(message);
    },
    removeSuccess(state, action: PayloadAction<string>) {
      state.messages.success = state.messages.success.filter((e) => e.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isLoading, (state, action) => {
        if (!action.payload || !action.payload.blockLoading) {
          state.loading.result = true;
        }
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.loading.result = false;
        state.messages.errors = doRemoveErrorsByAction(actionProperType(action), state.messages.errors);
      })
      .addMatcher(handleError, (state, action) => {
        state.loading.result = false;
        const actionBeingRejected = actionProperType(action);
        state.messages.errors = doRemoveErrorsByAction(actionBeingRejected, state.messages.errors);
        const error = createAppError(
          {...action.payload, action: actionBeingRejected}, { show: !action.payload.blockNotification });
        state.messages.errors.push(error);
      });
  },
});

export const appStateActions = appStateSlice.actions;
export const appStateReducer = appStateSlice.reducer;

export const appStateSelectors = {
  selectLoading: (state: any) => state.appState.loading.result,
  selectErrors: (state: any) => state.appState.messages.errors,
  selectSuccess: (state: any) => state.appState.messages.success,
};
