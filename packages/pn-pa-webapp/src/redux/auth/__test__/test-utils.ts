import { AuthApi } from '../../../api/auth/Auth.api';
import { PartyRole, PNRole } from '../../../models/user';
import { store } from '../../store';
import { exchangeToken, logout } from '../actions';
import { User } from '../types';

export const mockLogin = async (): Promise<any> => {
  const apiSpy = jest.spyOn(AuthApi, 'exchangeToken');
  apiSpy.mockResolvedValue(userResponse);
  return store.dispatch(exchangeToken('mocked-token'));
};

export const mockLogout = async (): Promise<any> => store.dispatch(logout());

export const mockAuthentication = () => {
  beforeAll(() => {
    mockLogin();
  });

  afterAll(() => {
    mockLogout();
    jest.resetAllMocks();
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
