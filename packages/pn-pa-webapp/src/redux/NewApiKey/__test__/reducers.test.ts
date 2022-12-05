import { ApiKeysApi } from '../../../api/apiKeys/ApiKeys.api';
import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { GroupStatus, UserGroup } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { getApiKeyUserGroups, saveNewApiKey } from '../actions';
import { resetState } from  '../reducers';
import { newApiKeyForBE } from './test-utils';

const initialState = {
  loading: false,
  apiKey: '',
  groups: [] as Array<UserGroup>,
};

describe('api keys page redux state test', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newApiKeyState;
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

  it('Should be able to create new API Key', async () => {
    const apiSpy = jest.spyOn(ApiKeysApi, 'createNewApiKey');
    apiSpy.mockResolvedValue('mocked-api-key');
    const action = await store.dispatch(saveNewApiKey(newApiKeyForBE));
    const payload = action.payload;
    expect(action.type).toBe('saveNewApiKey/fulfilled');
    expect(payload).toEqual('mocked-api-key');
  });
  
  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('newApiKeySlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().newApiKeyState;
    expect(state).toEqual(initialState);
  });
});