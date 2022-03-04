import { AuthApi } from '../../../api/auth/Auth.api';
import { UserRole } from '../../../models/user';
import { store } from '../../store';
import { exchangeToken, logout } from '../actions';
import { User } from '../types';
import { userResponse } from './test-utils';


const mockLogin = async (): Promise<any> => {
  const apiSpy = jest.spyOn(AuthApi, 'exchangeToken');
  apiSpy.mockResolvedValue(userResponse);
  return store.dispatch(exchangeToken('mocked-token'));
};

const mockLogout = async (): Promise<any> => store.dispatch(logout());

export const mockAuthentication = () => {
  beforeAll(() => {
    mockLogin();
  });

  afterAll(() => {
    mockLogout();
    jest.resetAllMocks();
  });
};

describe('Auth redux state tests', () => {
  it('Initial state', () => {
    const state = store.getState().userState;
    expect(state).toEqual({
      loading: false,
      user: sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user') || '')
        : {
            sessionToken: '',
            family_name: '',
            fiscal_number: '',
            organization: {
              id: '',
              role: UserRole.REFERENTE_AMMINISTRATIVO,
            },
          },
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    const payload = action.payload as User;

    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(payload).toEqual(userResponse);
  });

  it('Should be able to logout', async () => {
    const action = await mockLogout();
    const payload = action.payload;

    expect(action.type).toBe('logout/fulfilled');
    expect(payload).toEqual({
      sessionToken: '',
      family_name: '',
      fiscal_number: '',
      organization: {
        id: '',
        role: UserRole.REFERENTE_AMMINISTRATIVO,
      },
    });
  });
});
