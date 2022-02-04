import { AppError } from '@pagopa-pn/pn-commons';
import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
interface AppStateState {
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
    setLoading: (state, action: PayloadAction<{ task: string; loading: boolean }>) => {
      if (action.payload.loading) {
        state.loading.result = true;
        state.loading.tasks[action.payload.task] = true;
      } else {
        delete state.loading.tasks[action.payload.task];
        state.loading.result = Object.keys(state.loading.tasks).length > 0;
      }
    },
    addError: (state, action: PayloadAction<AppError>) => {
      state.errors.push(action.payload);
    },
    removeError: (state, action: PayloadAction<AppError>) => {
      state.errors = state.errors.filter((e) => e.id !== action.payload.id);
    },
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
        state.errors = action.payload;
      });
  }
});

export const appStateActions = appStateSlice.actions;
export const appStateReducer = appStateSlice.reducer;

export const appStateSelectors = {
  selectLoading: (state: RootState) => state.appState.loading.result,
  selectErrors: (state: RootState) => state.appState.errors,
};
