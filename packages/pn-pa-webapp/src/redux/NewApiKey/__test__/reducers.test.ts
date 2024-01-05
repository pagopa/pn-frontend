import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { newApiKeyDTO, newApiKeyResponse } from '../../../__mocks__/NewApiKey.mock';
import { apiClient } from '../../../api/apiClients';
import { CREATE_APIKEY } from '../../../api/apiKeys/apiKeys.routes';
import { GET_USER_GROUPS } from '../../../api/notifications/notifications.routes';
import { GroupStatus, UserGroup } from '../../../models/user';
import { getUserGroups } from '../../newNotification/actions';
import { store } from '../../store';
import { saveNewApiKey } from '../actions';
import { resetState } from '../reducers';

const initialState = {
  loading: false,
  apiKey: '',
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

  it('Initial state', () => {
    const state = store.getState().newApiKeyState;
    expect(state).toEqual(initialState);
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
    mock.onPost(CREATE_APIKEY(), newApiKeyDTO).reply(200, newApiKeyResponse);
    const action = await store.dispatch(saveNewApiKey(newApiKeyDTO));
    const payload = action.payload;
    expect(action.type).toBe('saveNewApiKey/fulfilled');
    expect(payload).toEqual(newApiKeyResponse.apiKey);
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
