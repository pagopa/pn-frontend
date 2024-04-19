import MockAdapter from 'axios-mock-adapter';

import { mockApiKeysDTO, newApiKeyDTO, newApiKeyResponse } from '../../../__mocks__/ApiKeys.mock';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../../api/apiClients';
import { GET_USER_GROUPS } from '../../../api/notifications/notifications.routes';
import { ApiKeys, NewApiKeyResponse } from '../../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../../models/user';
import { getUserGroups } from '../../newNotification/actions';
import { store } from '../../store';
import { getApiKeys, newApiKey } from '../actions';
import { resetState, setPagination } from '../reducers';

const initialState = {
  loading: false,
  apiKeys: {
    items: [],
    total: 0,
  } as ApiKeys,
  pagination: {
    nextPagesKey: [] as Array<{
      lastKey: string;
      lastUpdate: string;
    }>,
    size: 10,
    page: 0,
  },
  apiKey: {} as NewApiKeyResponse,
  groups: [] as Array<UserGroup>,
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
    mock.onGet('/bff/v1/api-keys?showVirtualKey=true').reply(200, mockApiKeysDTO);
    const action = await store.dispatch(getApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getApiKeys/fulfilled');
    expect(payload).toEqual(mockApiKeysDTO);
    expect(store.getState().apiKeysState.apiKeys).toStrictEqual(mockApiKeysDTO);
    expect(store.getState().apiKeysState.pagination).toEqual({
      page: 0,
      size: 10,
      nextPagesKey: [{ lastKey: mockApiKeysDTO.lastKey, lastUpdate: mockApiKeysDTO.lastUpdate }],
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

  it('Should be able to get user groups', async () => {
    const mockResponse = [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: GroupStatus.ACTIVE },
    ];
    mock.onGet(GET_USER_GROUPS()).reply(200, mockResponse);
    const action = await store.dispatch(getUserGroups());
    const payload = action.payload;
    expect(action.type).toBe('getUserGroups/fulfilled');
    expect(payload).toEqual(mockResponse);
    expect(store.getState().newNotificationState.groups).toStrictEqual(mockResponse);
  });

  it('Should be able to create new API Key', async () => {
    mock.onPost('/bff/v1/api-keys', newApiKeyDTO).reply(200, newApiKeyResponse);
    const action = await store.dispatch(newApiKey(newApiKeyDTO));
    const payload = action.payload;
    expect(action.type).toBe('newApiKey/fulfilled');
    expect(payload).toEqual(newApiKeyResponse);
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
