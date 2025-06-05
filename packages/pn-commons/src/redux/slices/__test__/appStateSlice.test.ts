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

let mockedActionResult: string | undefined;
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
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
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
        info: [],
      },
      responseEvent: null,
      isInitialized: false,
    });
  });

  it('addError', () => {
    const payload = {
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
      traceId: 'Root=trace-id',
      errorCode: 'error-code',
    };
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
        showTechnicalData: false,
        traceId: 'trace-id',
        errorCode: 'error-code',
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
    const payload = {
      title: 'mocked-title',
      message: 'mocked-message',
      action: 'action-name',
      showTechnicalData: true,
      traceId: 'Root=trace-id',
      errorCode: 'error-code',
    };
    store.dispatch(appStateActions.addError(payload));
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
        showTechnicalData: true,
        traceId: 'trace-id',
        errorCode: 'error-code',
      },
    ]);
    const action = store.dispatch(appStateActions.removeErrorsByAction('action-name'));
    state = store.getState().appState;
    expect(action.type).toBe('appState/removeErrorsByAction');
    expect(state.messages.errors).toEqual([]);
  });

  it('setErrorAsAlreadyShown', () => {
    const payload = {
      title: 'mocked-title',
      message: 'mocked-message',
      action: 'action-name',
      showTechnicalData: false,
      traceId: 'Root=trace-id',
      errorCode: 'error-code',
    };
    store.dispatch(appStateActions.addError(payload));
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
        showTechnicalData: false,
        traceId: 'trace-id',
        errorCode: 'error-code',
      },
    ]);
    const action = store.dispatch(appStateActions.setErrorAsAlreadyShown('3'));
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
        showTechnicalData: false,
        traceId: 'trace-id',
        errorCode: 'error-code',
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
        showTechnicalData: false,
        traceId: undefined,
        errorCode: undefined,
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

  it('addInfo', () => {
    const payload = { title: 'mocked-title', message: 'mocked-message' };
    const action = store.dispatch(appStateActions.addInfo(payload));
    expect(action.type).toBe('appState/addInfo');
    expect(action.payload).toStrictEqual(payload);
    const state = store.getState().appState;
    expect(state.messages.info).toEqual([
      {
        id: '5',
        title: 'mocked-title',
        message: 'mocked-message',
        blocking: false,
        toNotify: true,
        status: undefined,
        alreadyShown: false,
        action: undefined,
        showTechnicalData: false,
        traceId: undefined,
        errorCode: undefined,
      },
    ]);
  });

  it('removeInfo', () => {
    const action = store.dispatch(appStateActions.removeInfo('5'));
    expect(action.type).toBe('appState/removeInfo');
    expect(action.payload).toStrictEqual('5');
    const state = store.getState().appState;
    expect(state.messages.info).toEqual([]);
  });

  it('finishInitialization', () => {
    const action = store.dispatch(appStateActions.finishInitialization());
    expect(action.type).toBe('appState/finishInitialization');
    expect(action.payload).toStrictEqual(undefined);
    const state = store.getState().appState;
    expect(state.isInitialized).toBeTruthy();
  });

  it('fulfilled matcher', async () => {
    const payload = {
      title: 'mocked-title',
      message: 'mocked-message',
      action: 'mockedAction',
      showTechnicalData: false,
      traceId: 'trace-id',
      errorCode: 'error-code',
    };
    store.dispatch(appStateActions.addError(payload));
    // dispatch async action
    mockedActionResult = 'OK';
    const action = await store.dispatch(mockedAction());
    expect(action.type).toBe('mockedAction/fulfilled');
    expect(action.payload).toStrictEqual('OK');
    const state = store.getState().appState;
    expect(state.messages.errors.find((er) => er.action === mockedAction.name)).toBeUndefined();
    expect(state.responseEvent).toStrictEqual({
      outcome: 'success',
      name: 'mockedAction',
      response: {
        action: 'mockedAction',
      },
    });
  });

  it('rejected matcher', async () => {
    const payload = {
      title: 'mocked-title',
      message: 'mocked-message',
      action: 'mockedAction',
      showTechnicalData: false,
      traceId: 'trace-id',
      errorCode: 'error-code',
    };
    store.dispatch(appStateActions.addError(payload));
    // dispatch async action
    mockedActionResult = undefined;
    const action = await store.dispatch(mockedAction());
    expect(action.type).toBe('mockedAction/rejected');
    expect(action.payload).toStrictEqual('action-failed');
    const state = store.getState().appState;
    expect(state.messages.errors.find((er) => er.action === mockedAction.name)).toBeUndefined();
    expect(state.responseEvent).toStrictEqual({
      outcome: 'error',
      name: 'mockedAction',
      response: {
        action: 'mockedAction',
      },
    });
  });

  it('addError sets lastError when showTechnicalData is true', () => {
    const payload = {
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: true,
      traceId: 'Root=trace-id',
      errorCode: 'ERR_CODE',
    };
    store.dispatch(appStateActions.addError(payload));
    const state = store.getState().appState;

    expect(state.messages.errors).toHaveLength(1);
    expect(state.lastError).toEqual({
      traceId: 'trace-id',
      errorCode: 'ERR_CODE',
    });
  });

  it('addError resets lastError when showTechnicalData is false', () => {
    // dispatch first error with technical data
    store.dispatch(
      appStateActions.addError({
        title: 'Error 1',
        message: 'With technical data',
        showTechnicalData: true,
        traceId: 'Root=trace-id',
        errorCode: 'ERR_CODE_ONE',
      })
    );

    // verify lastError has been set
    let state = store.getState().appState;
    expect(state.lastError).toEqual({
      traceId: 'trace-id',
      errorCode: 'ERR_CODE_ONE',
    });

    // dispatch second error without technical data
    store.dispatch(
      appStateActions.addError({
        title: 'Error 2',
        message: 'Without technical data',
        showTechnicalData: false,
        traceId: 'Root=trace-id',
        errorCode: 'ERR_CODE_TWO',
      })
    );

    // verify lastError has been reset properly
    state = store.getState().appState;
    expect(state.lastError).toBeUndefined();
  });
});
