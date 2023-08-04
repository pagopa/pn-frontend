import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { APIKEY_LIST } from '../../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../../api/notifications/notifications.routes';
import { ApiKeys } from '../../../models/ApiKeys';
import { UserGroup } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { getApiKeys } from '../actions';
import { resetState } from '../reducers';
import { mockApiKeysForFE, mockApiKeysFromBE, mockGroups } from './test-utils';

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
  mockAuthentication();
  it('initial state', () => {
    const state = store.getState().apiKeysState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the api keys list', async () => {
    const mock = mockApi(apiClient, 'GET', APIKEY_LIST(), 200, undefined, mockApiKeysFromBE);
    const mock2 = mockApi(mock, 'GET', GET_USER_GROUPS(), 200, undefined, mockGroups);
    const action = await store.dispatch(getApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getApiKeys/fulfilled');
    expect(payload).toEqual(mockApiKeysForFE);
    expect(store.getState().apiKeysState.apiKeys).toStrictEqual(mockApiKeysForFE);
    mock.reset();
    mock.restore();
    mock2.reset();
    mock2.restore();
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
