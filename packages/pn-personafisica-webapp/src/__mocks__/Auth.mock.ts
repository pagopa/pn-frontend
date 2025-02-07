import MockAdapter from 'axios-mock-adapter';

import { authClient } from '../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../api/auth/auth.routes';
import { exchangeToken, logout } from '../redux/auth/actions';
import { User } from '../redux/auth/types';
import { store } from '../redux/store';

export const mockLogin = async (): Promise<any> => {
  const mock = new MockAdapter(authClient);
  mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);
  const action = store.dispatch(exchangeToken({ spidToken: 'mocked-token' }));
  mock.reset();
  mock.restore();
  return action;
};

export const mockLogout = async (): Promise<any> => store.dispatch(logout());

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

export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'info@agid.gov.it',
  from_aa: false,
  uid: 'a6c1350d-1d69-4209-8bf8-31de58c79d6f',
  aud: 'portale.dev.pn.pagopa.it',
  level: 'L2',
  iat: 1646394256,
  exp: 4850004251,
  iss: 'https://spid-hub-test.dev.pn.pagopa.it',
  jti: 'mockedJTI004',
};

export const userResponseWithRetrievalId: User = {
  ...userResponse,
  source: {
    channel: 'TPP', 
    details: 'mock-tpp-id',
  }
};