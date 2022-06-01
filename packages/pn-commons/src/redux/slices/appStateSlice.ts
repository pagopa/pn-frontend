import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppError, createAppMessage } from '../../services/message.service';
import { IAppMessage } from '../../types/AppMessage';

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

/* eslint-disable functional/immutable-data */
export const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    removeError(state, action: PayloadAction<string>) {
      state.messages.errors = state.messages.errors.filter((e) => e.id !== action.payload);
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
      .addMatcher(isFulfilled, (state) => {
        state.loading.result = false;
      })
      .addMatcher(handleError, (state, action) => {
        state.loading.result = false;
        if (!action.payload || !action.payload.blockNotification) {
          let error = createAppError(action.payload);
          state.messages.errors.push(error);
        }
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
