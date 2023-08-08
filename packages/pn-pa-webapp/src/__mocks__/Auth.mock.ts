import { AUTH_TOKEN_EXCHANGE } from '../api/auth/auth.routes';
import { PNRole, PartyRole } from '../models/user';
import { exchangeToken, logout } from '../redux/auth/actions';
import { User } from '../redux/auth/types';
import { store } from '../redux/store';
import { authClient } from '../api/apiClients';
import MockAdapter from 'axios-mock-adapter';

export const mockLogin = async (): Promise<any> => {
  const mock = new MockAdapter(authClient);
  mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);
  const action = store.dispatch(exchangeToken('mocked-token'));
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
    store.dispatch(exchangeToken('mocked-token'));
  });

  afterAll(() => {
    mock.reset();
    mock.restore();
    mockLogout();
  });
};

// For security reasons, we had a strict validation to user object.
// This doesn't invalidate the tests, but generates some annoying logs during their execution if the mocked user doesn't respect the validation rules.
// To avoid this, I updated the mocked user so as to comply with the validation rules.
// ----------------------
// Andrea Cimini, 2023.02.17
export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'mocked-email@mail.com',
  uid: '00000000-0000-0000-0000-000000000000',
  organization: {
    id: 'mocked-id',
    name: 'Mocked Organization',
    roles: [
      {
        partyRole: PartyRole.MANAGER,
        role: PNRole.ADMIN,
      },
    ],
    fiscal_code: '12345678910',
  },
  desired_exp: 0,
};
