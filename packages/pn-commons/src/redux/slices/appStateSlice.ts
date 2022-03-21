import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppError } from '../../services/error.service';
import { AppError } from '../../types/AppError';

export interface AppStateState {
  loading: {
    result: boolean;
    tasks: { [taskId: string]: boolean };
  };
  errors: Array<AppError>;
}

const initialState: AppStateState = {
  loading: {
    result: false,
    tasks: {},
  },
  errors: [],
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
      state.errors = state.errors.filter(e => e.id !== action.payload); 
    }
  },
  extraReducers: builder => {
    builder
      .addMatcher(isLoading, (state) => {
        state.loading.result = true;
      })
      .addMatcher(isFulfilled, (state) => {
        state.loading.result = false;
      })
      .addMatcher(handleError, (state, action) => {
        state.loading.result = false;
        let error = createAppError(action.payload);
        state.errors.push(error);
      });
  }
});

export const appStateActions = appStateSlice.actions;
export const appStateReducer = appStateSlice.reducer;

export const appStateSelectors = {
  selectLoading: (state: any) => state.appState.loading.result,
  selectErrors: (state: any) => state.appState.errors,
};
