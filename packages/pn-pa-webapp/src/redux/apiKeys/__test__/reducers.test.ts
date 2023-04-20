import { ApiKeysApi } from '../../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { ApiKey } from '../../../models/ApiKeys';
import { GroupStatus, UserGroup } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { getApiKeyUserGroups, getApiKeys } from '../actions';
import { resetState } from  '../reducers';
import { mockApiKeysForFE } from './test-utils';

const initialState = {
  loading: false,
  apiKeys: [] as Array<ApiKey>,
  groups: [] as Array<UserGroup>,
};

describe('api keys page redux state test', () => {
  mockAuthentication();
  it('initial state', () => {
    const state = store.getState().apiKeysState;
    expect(state).toEqual({
      loading: false,
      apiKeys: [] as Array<ApiKey>,
      groups: [] as Array<UserGroup>,
    });
  });

  it('Should be able to fetch the api keys list', async () => {
    const apiSpy = jest.spyOn(ApiKeysApi, 'getApiKeys');
    apiSpy.mockResolvedValue(mockApiKeysForFE);
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

  it('Should be able to get user groups', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'getUserGroups');
    apiSpy.mockResolvedValue([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' as GroupStatus },
    ]);
    const action = await store.dispatch(getApiKeyUserGroups());
    const payload = action.payload;
    expect(action.type).toBe('getApiKeyUserGroups/fulfilled');
    expect(payload).toEqual([
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' },
    ]);
  });

});