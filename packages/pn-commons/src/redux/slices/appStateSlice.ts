import { AnyAction, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppResponse, IAppMessage } from '../../models';
import { AppResponseOutcome, HTTPStatusCode } from '../../models/AppResponse';
import { createAppResponseError, createAppResponseSuccess } from '../../utility/AppResponse';
import { createAppMessage } from '../../utility/message.utility';

export interface AppStateState {
  loading: {
    result: boolean;
    tasks: { [taskId: string]: boolean };
  };
  messages: {
    errors: Array<IAppMessage>;
    success: Array<IAppMessage>;
    info: Array<IAppMessage>;
  };
  responseEvent: {
    outcome: AppResponseOutcome;
    name: string;
    response: AppResponse;
  } | null;
  isInitialized: boolean;
}

const initialState: AppStateState = {
  loading: {
    result: false,
    tasks: {},
  },
  messages: {
    errors: [],
    success: [],
    info: [],
  },
  responseEvent: null,
  isInitialized: false,
};

const isLoading = (action: AnyAction) => action.type.endsWith('/pending');

const isFulfilled = (action: AnyAction) => action.type.endsWith('/fulfilled');

const handleError = (action: AnyAction) => action.type.endsWith('/rejected');

function doRemoveErrorsByAction(action: string, errors: Array<IAppMessage>) {
  return errors.filter((e) => e.action !== action);
}

/* eslint-disable functional/immutable-data */
export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    addError(
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        permanent: boolean;
        status?: HTTPStatusCode;
        action?: string;
      }>
    ) {
      const message = createAppMessage(
        action.payload.title,
        action.payload.message,
        action.payload.permanent,
        action.payload.status,
        action.payload.action
      );
      state.messages.errors.push(message);
    },
    removeError(state, action: PayloadAction<string>) {
      state.messages.errors = state.messages.errors.filter((e) => e.id !== action.payload);
    },
    removeErrorsByAction(state, action: PayloadAction<string>) {
      state.messages.errors = doRemoveErrorsByAction(action.payload, state.messages.errors);
    },
    setErrorAsAlreadyShown(state, action: PayloadAction<string>) {
      const error = state.messages.errors.find((e) => e.id === action.payload);
      if (error) {
        error.alreadyShown = true;
      }
    },
    addSuccess(state, action: PayloadAction<{ title: string; message: string; status?: number }>) {
      const message = createAppMessage(
        action.payload.title,
        action.payload.message,
        false,
        action.payload.status
      );
      state.messages.success.push(message);
    },
    removeSuccess(state, action: PayloadAction<string>) {
      state.messages.success = state.messages.success.filter((e) => e.id !== action.payload);
    },
    addInfo(
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        status?: number;
      }>
    ) {
      const message = createAppMessage(
        action.payload.title,
        action.payload.message,
        false,
        action.payload.status
      );
      state.messages.info.push(message);
    },
    removeInfo(state, action: PayloadAction<string>) {
      state.messages.info = state.messages.info.filter((e) => e.id !== action.payload);
    },
    finishInitialization(state) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isLoading, (state, action) => {
        if (!action.meta || !action.meta.blockLoading) {
          state.loading.result = true;
        }
      })
      .addMatcher(isFulfilled, (state, action) => {
        state.loading.result = false;
        const actionBeingFulfilled = action.type.slice(0, action.type.indexOf('/'));
        state.messages.errors = doRemoveErrorsByAction(actionBeingFulfilled, state.messages.errors);
        const response = createAppResponseSuccess(actionBeingFulfilled, action.payload?.response);
        state.responseEvent = {
          outcome: AppResponseOutcome.SUCCESS,
          name: actionBeingFulfilled,
          response,
        };
      })
      .addMatcher(handleError, (state, action) => {
        state.loading.result = false;
        const actionBeingRejected = action.type.slice(0, action.type.indexOf('/'));
        state.messages.errors = doRemoveErrorsByAction(actionBeingRejected, state.messages.errors);
        const response = createAppResponseError(actionBeingRejected, action.payload.response);
        state.responseEvent = {
          outcome: AppResponseOutcome.ERROR,
          name: actionBeingRejected,
          response,
        };
      });
  },
});

export const appStateActions = appStateSlice.actions;
export const appStateReducer = appStateSlice.reducer;

export const appStateSelectors = {
  selectLoading: (state: any) => state.appState.loading.result,
  selectErrors: (state: any) => state.appState.messages.errors,
  selectSuccess: (state: any) => state.appState.messages.success,
  selectInfo: (state: any) => state.appState.messages.info,
  selectIsInitialized: (state: any) => state.appState.isInitialized,
};
