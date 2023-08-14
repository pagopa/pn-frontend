import MockAdapter from 'axios-mock-adapter';
import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { GET_USER_GROUPS } from '../../../api/notifications/notifications.routes';
import { GroupStatus, UserGroup } from '../../../models/user';
import { getUserGroups } from '../../newNotification/actions';
import { store } from '../../store';
import { saveNewApiKey } from '../actions';
import { resetState } from '../reducers';
import { CREATE_APIKEY } from '../../../api/apiKeys/apiKeys.routes';
import { mockAuthentication } from '../../../__mocks__/Auth.mock';

const initialState = {
  loading: false,
  apiKey: '',
  groups: [] as Array<UserGroup>,
};

describe('api keys page redux state test', () => {
  mockAuthentication();

  let mock: MockAdapter;

  afterEach(() => {
    if (mock) {
      mock.reset();
      mock.restore();
    }
  });

  it('Initial state', () => {
    const state = store.getState().newApiKeyState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to get user groups', async () => {
    const mockResponse = [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' as GroupStatus },
    ];
    mock = mockApi(apiClient, 'GET', GET_USER_GROUPS(), 200, undefined, mockResponse);
    const action = await store.dispatch(getUserGroups());
    const payload = action.payload;
    expect(action.type).toBe('getUserGroups/fulfilled');
    expect(payload).toEqual(mockResponse);
    expect(store.getState().newNotificationState.groups).toStrictEqual(mockResponse);
    mock.reset();
    mock.restore();
  });

  it('Should be able to create new API Key', async () => {
    mock = mockApi(apiClient, 'POST', CREATE_APIKEY(), 200, newApiKeyForBE, newApiKeyFromBE);
    const action = await store.dispatch(saveNewApiKey(newApiKeyForBE));
    const payload = action.payload;
    expect(action.type).toBe('saveNewApiKey/fulfilled');
    expect(payload).toEqual(newApiKeyFromBE.apiKey);
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
