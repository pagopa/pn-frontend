import MockAdapter from 'axios-mock-adapter';

import { authClient } from '../../../api/axios';
import { UserRole } from '../../../models/user';
import { store } from '../../store';
import { exchangeToken, logout } from '../actions';
import { User } from '../types';

const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  organization: {
    id: 'mocked-id',
    role: UserRole.REFERENTE_AMMINISTRATIVO,
  },
};

export const loginInit = () => {
  let axiosMock: MockAdapter;

  const mockLoginResponse = () => {
    axiosMock = new MockAdapter(authClient);
    axiosMock.onGet(`/beta/session-token`).reply(200, userResponse);
  };

  beforeAll(() => {
    mockLoginResponse();
  });

  afterAll(() => {
    axiosMock.reset();
    axiosMock.restore();
  });
};

loginInit();

describe('Auth redux state tests', () => {
  it('Initial state', () => {
    const state = store.getState().userState;
    expect(state).toEqual({
      loading: false,
      user: localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user') || '')
        : {
            sessionToken: '',
            family_name: '',
            fiscal_number: '',
            organization: {
              id: '',
              role: '',
            },
          },
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await store.dispatch(exchangeToken('mocked-token'));
    const payload = action.payload as User;

    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(payload).toEqual(userResponse);
  });

  it('Should be able to logout', async () => {
    const action = await store.dispatch(logout());
    const payload = action.payload;

    expect(action.type).toBe('logout/fulfilled');
    expect(payload).toEqual({
      sessionToken: '',
      family_name: '',
      fiscal_number: '',
      organization: {
        id: '',
        role: '',
      },
    });
  });
});
