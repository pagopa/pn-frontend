import MockAdapter from 'axios-mock-adapter';

import { authClient } from '../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../api/auth/auth.routes';
import { PNRole, PartyRole, User } from '../models/User';
import { exchangeToken } from '../redux/auth/actions';
import { store } from '../redux/store';
import { resetState } from '../redux/auth/reducers';

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

export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'info@agid.gov.it',
  from_aa: false,
  uid: 'a6c1350d-1d69-4209-8bf8-31de58c79d6f',
  aud: 'portale-pg.dev.pn.pagopa.it',
  level: 'L2',
  iat: 1646394256,
  exp: 1646397856,
  iss: 'https://spid-hub-test.dev.pn.pagopa.it',
  jti: 'mockedJTI004',
  desired_exp: 0,
  organization: {
    id: 'mocked-id',
    name: 'mocked-organizzation',
    roles: [
      {
        partyRole: PartyRole.MANAGER,
        role: PNRole.ADMIN,
      },
    ],
    fiscal_code: '12345678910',
  },
  hasGroup: false,
};

export const userResponseWithSource: User = {
  ...userResponse,
  source: {
    channel: 'WEB',
    details: 'QR_CODE',
  },
};
