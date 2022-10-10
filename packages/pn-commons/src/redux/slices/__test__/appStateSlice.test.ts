import { combineReducers, createStore } from '@reduxjs/toolkit';
import { appStateReducer } from '../appStateSlice';

function createTestStore() {
  return createStore(
    combineReducers({
      appState: appStateReducer,
    })
  );
}

describe('App state slice tests', () => {
  it('Initial state', () => {
    const state = createTestStore().getState();
    expect(state.appState).toEqual({
      loading: {
        result: false,
        tasks: {},
      },
      messages: {
        errors: [],
        success: []
      },
      responseEvent: null,
      isInitialized: false,
    });
  });
});
