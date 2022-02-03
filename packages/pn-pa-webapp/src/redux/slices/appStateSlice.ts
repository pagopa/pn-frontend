import { AppError } from '@pagopa-pn/pn-commons';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from '../auth/actions';
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
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state) => {
      state.loading.result = false;
    });
    builder.addCase(login.pending, (state) => {
      state.loading.result = true;
    });
  }
});

export const appStateActions = appStateSlice.actions;
export const appStateReducer = appStateSlice.reducer;

export const appStateSelectors = {
  selectLoading: (state: RootState) => state.appState.loading.result,
  selectErrors: (state: RootState) => state.appState.errors,
};
