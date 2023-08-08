import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { mockApiKeysDTO, mockApiKeysForFE, mockGroups } from '../../../__mocks__/apiKeys.mock';
import { apiClient } from '../../../api/apiClients';
import { APIKEY_LIST } from '../../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../../api/notifications/notifications.routes';
import { ApiKeys } from '../../../models/ApiKeys';
import { UserGroup } from '../../../models/user';
import { store } from '../../store';
import { getApiKeys } from '../actions';
import { resetState, setPagination } from '../reducers';

const initialState = {
  loading: false,
  apiKeys: {
    items: [],
    total: 0,
  } as ApiKeys<UserGroup>,
  pagination: {
    nextPagesKey: [] as Array<{
      lastKey: string;
      lastUpdate: string;
    }>,
    size: 10,
    page: 0,
  },
};

describe('api keys page redux state test', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('initial state', () => {
    const state = store.getState().apiKeysState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the api keys list', async () => {
    mock.onGet(APIKEY_LIST()).reply(200, mockApiKeysDTO);
    mock.onGet(GET_USER_GROUPS()).reply(200, mockGroups);
    const action = await store.dispatch(getApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getApiKeys/fulfilled');
    expect(payload).toEqual(mockApiKeysForFE);
    expect(store.getState().apiKeysState.apiKeys).toStrictEqual(mockApiKeysForFE);
    expect(store.getState().apiKeysState.pagination).toEqual({
      page: 0,
      size: 10,
      nextPagesKey: [
        { lastKey: mockApiKeysForFE.lastKey, lastUpdate: mockApiKeysForFE.lastUpdate },
      ],
    });
  });

  it('Should be able to change page', () => {
    const action = store.dispatch(setPagination({ page: 2, size: 20 }));
    const payload = action.payload;
    expect(action.type).toBe('apiKeysSlice/setPagination');
    expect(payload).toEqual({ page: 2, size: 20 });
    const state = store.getState().apiKeysState;
    expect(state.pagination).toEqual({ page: 2, size: 20, nextPagesKey: [] });
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('apiKeysSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().apiKeysState;
    expect(state).toEqual(initialState);
  });
});
