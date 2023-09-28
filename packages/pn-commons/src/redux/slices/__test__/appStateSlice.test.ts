import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';

import { appStateActions, appStateReducer } from '../appStateSlice';

function createTestStore() {
  return configureStore({
    reducer: { appState: appStateReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

let mockedActionResult;
const mockedAction = createAsyncThunk<string, void>(
  'mockedAction',
  async (_, { rejectWithValue }) => {
    try {
      if (mockedActionResult) {
        return await Promise.resolve(mockedActionResult);
      }
      return await Promise.reject('action-failed');
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

describe('App state slice tests', () => {
  let store;

  beforeAll(() => {
    store = createTestStore();
  });

  it('Initial state', () => {
    const state = store.getState();
    expect(state.appState).toEqual({
      loading: {
        result: false,
        tasks: {},
      },
      messages: {
        errors: [],
        success: [],
      },
      responseEvent: null,
      isInitialized: false,
    });
  });

  it('addError', () => {
    const payload = { title: 'mocked-title', message: 'mocked-message' };
    const action = store.dispatch(appStateActions.addError(payload));
    expect(action.type).toBe('appState/addError');
    expect(action.payload).toStrictEqual(payload);
    const state = store.getState().appState;
    expect(state.messages.errors).toEqual([
      {
        id: '1',
        title: 'mocked-title',
        message: 'mocked-message',
        blocking: false,
        toNotify: true,
        status: undefined,
        alreadyShown: false,
        action: undefined,
      },
    ]);
  });

  it('removeError', () => {
    const action = store.dispatch(appStateActions.removeError('1'));
    expect(action.type).toBe('appState/removeError');
    expect(action.payload).toStrictEqual('1');
    const state = store.getState().appState;
    expect(state.messages.errors).toEqual([]);
  });

  it('removeErrorsByAction', () => {
    const payload = { title: 'mocked-title', message: 'mocked-message', action: 'action-name' };
    let action = store.dispatch(appStateActions.addError(payload));
    let state = store.getState().appState;
    expect(state.messages.errors).toEqual([
      {
        id: '2',
        title: 'mocked-title',
        message: 'mocked-message',
        blocking: false,
        toNotify: true,
        status: undefined,
        alreadyShown: false,
        action: 'action-name',
      },
    ]);
    action = store.dispatch(appStateActions.removeErrorsByAction('action-name'));
    state = store.getState().appState;
    expect(action.type).toBe('appState/removeErrorsByAction');
    expect(state.messages.errors).toEqual([]);
  });

  it('setErrorAsAlreadyShown', () => {
    const payload = { title: 'mocked-title', message: 'mocked-message', action: 'action-name' };
    let action = store.dispatch(appStateActions.addError(payload));
    let state = store.getState().appState;
    expect(state.messages.errors).toEqual([
      {
        id: '3',
        title: 'mocked-title',
        message: 'mocked-message',
        blocking: false,
        toNotify: true,
        status: undefined,
        alreadyShown: false,
        action: 'action-name',
      },
    ]);
    action = store.dispatch(appStateActions.setErrorAsAlreadyShown('3'));
    state = store.getState().appState;
    expect(action.type).toBe('appState/setErrorAsAlreadyShown');
    expect(state.messages.errors).toEqual([
      {
        id: '3',
        title: 'mocked-title',
        message: 'mocked-message',
        blocking: false,
        toNotify: true,
        status: undefined,
        alreadyShown: true,
        action: 'action-name',
      },
    ]);
  });

  it('addSuccess', () => {
    const payload = { title: 'mocked-title', message: 'mocked-message' };
    const action = store.dispatch(appStateActions.addSuccess(payload));
    expect(action.type).toBe('appState/addSuccess');
    expect(action.payload).toStrictEqual(payload);
    const state = store.getState().appState;
    expect(state.messages.success).toEqual([
      {
        id: '4',
        title: 'mocked-title',
        message: 'mocked-message',
        blocking: false,
        toNotify: true,
        status: undefined,
        alreadyShown: false,
        action: undefined,
      },
    ]);
  });

  it('removeSuccess', () => {
    const action = store.dispatch(appStateActions.removeSuccess('4'));
    expect(action.type).toBe('appState/removeSuccess');
    expect(action.payload).toStrictEqual('4');
    const state = store.getState().appState;
    expect(state.messages.success).toEqual([]);
  });

  it('finishInitialization', () => {
    const action = store.dispatch(appStateActions.finishInitialization());
    expect(action.type).toBe('appState/finishInitialization');
    expect(action.payload).toStrictEqual(undefined);
    const state = store.getState().appState;
    expect(state.isInitialized).toBeTruthy();
  });

  it('fulfilled matcher', async () => {
    const payload = { title: 'mocked-title', message: 'mocked-message', action: 'mockedAction' };
    let action = store.dispatch(appStateActions.addError(payload));
    // dispatch async action
    mockedActionResult = 'OK';
    action = await store.dispatch(mockedAction());
    expect(action.type).toBe('mockedAction/fulfilled');
    expect(action.payload).toStrictEqual('OK');
    const state = store.getState().appState;
    expect(state.messages.errors.find((er) => er.action === mockedAction)).toBeUndefined();
    expect(state.responseEvent).toStrictEqual({
      outcome: 'success',
      name: 'mockedAction',
      response: {
        action: 'mockedAction',
      },
    });
  });

  it('rejected matcher', async () => {
    const payload = { title: 'mocked-title', message: 'mocked-message', action: 'mockedAction' };
    let action = store.dispatch(appStateActions.addError(payload));
    // dispatch async action
    mockedActionResult = undefined;
    action = await store.dispatch(mockedAction());
    expect(action.type).toBe('mockedAction/rejected');
    expect(action.payload).toStrictEqual('action-failed');
    const state = store.getState().appState;
    expect(state.messages.errors.find((er) => er.action === mockedAction)).toBeUndefined();
    expect(state.responseEvent).toStrictEqual({
      outcome: 'error',
      name: 'mockedAction',
      response: {
        action: 'mockedAction',
      },
    });
  });
});
