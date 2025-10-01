import MockAdapter from 'axios-mock-adapter';

import { authClient } from '../api/apiClients';
import { AUTH_TOKEN_EXCHANGE } from '../api/auth/auth.routes';
import { PNRole, PartyRole, User } from '../models/user';
import { exchangeToken } from '../redux/auth/actions';
import { store } from '../redux/store';
import { resetState } from '../redux/auth/reducers';

export const mockLogin = async (body: User | string = userResponse): Promise<any> => {
  const mock = new MockAdapter(authClient);
  mock.onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: 'mocked-token' }).reply(200, body);
  const action = store.dispatch(exchangeToken('mocked-token'));
  mock.reset();
  mock.restore();
  return action;
};

export const mockLogout = async (): Promise<any> => store.dispatch(resetState());

export const mockAuthentication = () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    mock
      .onPost(AUTH_TOKEN_EXCHANGE(), { authorizationToken: 'mocked-token' })
      .reply(200, userResponse);
    store.dispatch(exchangeToken('mocked-token'));
  });

  afterAll(() => {
    mock.reset();
    mock.restore();
    mockLogout();
  });
};

function calcExpirationDate() {
  const now = new Date();
  // add 1 hour
  return now.setTime(now.getTime() + 60 * 60 * 1000);
}

// For security reasons, we had a strict validation to user object.
// This doesn't invalidate the tests, but generates some annoying logs during their execution if the mocked user doesn't respect the validation rules.
// To avoid this, I updated the mocked user so as to comply with the validation rules.
// ----------------------
// Andrea Cimini, 2023.02.17
export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'giuseppe',
  family_name: 'rossini',
  fiscal_number: 'RSSGPP80B02G273H',
  email: 'giuseppe.rossini@gmail.com',
  uid: '00000000-0000-0000-0000-000000000000',
  organization: {
    id: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
    name: 'Comune di Palermo',
    roles: [
      {
        partyRole: PartyRole.MANAGER,
        role: PNRole.ADMIN,
      },
    ],
    fiscal_code: '80016350821',
    hasGroups: false,
  },
  desired_exp: calcExpirationDate(),
};
