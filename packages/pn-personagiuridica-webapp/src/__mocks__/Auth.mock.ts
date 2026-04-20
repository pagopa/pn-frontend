import MockAdapter from 'axios-mock-adapter';

import { authClient } from '../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../api/auth/auth.routes';
import { User } from '../models/User';
import { exchangeToken } from '../redux/auth/actions';
import { resetState } from '../redux/auth/reducers';
import { store } from '../redux/store';
import { adminUser } from './User.mock';

export const mockLogin = async (body: User | string = userResponse): Promise<any> => {
  const mock = new MockAdapter(authClient);
  mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: 'mocked-token' }).reply(200, body);
  const action = store.dispatch(exchangeToken({ spidToken: 'mocked-token' }));
  mock.reset();
  mock.restore();
  return action;
};

export const mockLogout = async (): Promise<any> => store.dispatch(resetState());

export const mockAuthentication = () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);
    store.dispatch(exchangeToken({ spidToken: 'mocked-token' }));
  });

  afterAll(() => {
    mock.reset();
    mock.restore();
    mockLogout();
  });
};

export const userResponse = adminUser;

export const userResponseWithSource: User = {
  ...userResponse,
  source: {
    channel: 'WEB',
    details: 'QR_CODE',
  },
};
