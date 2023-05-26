import { ApiKeysApi } from '../../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { ApiKey, ApiKeySetStatus } from '../../../models/ApiKeys';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { deleteApiKey, getApiKeys, setApiKeyStatus } from '../actions';
import { resetState } from  '../reducers';
import { mockApiKeysForFE, mockApiKeysFromBE, mockGroups } from './test-utils';

const initialState = {
  loading: false,
  apiKeys: [] as Array<ApiKey>,
};

describe('api keys page redux state test', () => {
  mockAuthentication();
  it('initial state', () => {
    const state = store.getState().apiKeysState;
    expect(state).toEqual({
      loading: false,
      apiKeys: [] as Array<ApiKey>,
    });
  });

  it('Should be able to fetch the api keys list', async () => {
    const apiSpyApiKey = jest.spyOn(ApiKeysApi, 'getApiKeys');
    const apiSpyNotification = jest.spyOn(NotificationsApi, 'getUserGroups')
    apiSpyApiKey.mockResolvedValue(mockApiKeysFromBE.items);
    apiSpyNotification.mockResolvedValue(mockGroups);
    const action = await store.dispatch(getApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getApiKeys/fulfilled');
    expect(payload).toEqual(mockApiKeysForFE);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('apiKeysSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().apiKeysState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set a status apikey', async () => {
    const apiSpyApiKey = jest.spyOn(ApiKeysApi, 'setApiKeyStatus');
    apiSpyApiKey.mockResolvedValue('mock-status');
    const action = await store.dispatch(setApiKeyStatus({apiKey: 'mocked-api-key', status: ApiKeySetStatus.BLOCK}));
    const payload = action.payload;
    expect(payload).toBe('mock-status');
  });

  it('Should be able to delete apikey', async () => {
    const apiSpyApiKey = jest.spyOn(ApiKeysApi, 'deleteApiKey');
    apiSpyApiKey.mockResolvedValue('mock-deleted-status');
    const action = await store.dispatch(deleteApiKey('mocked-api-key'));
    const payload = action.payload;
    expect(payload).toBe('mock-deleted-status');
  });
});