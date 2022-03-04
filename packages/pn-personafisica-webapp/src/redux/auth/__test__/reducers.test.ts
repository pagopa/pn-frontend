import MockAdapter from 'axios-mock-adapter';

import { authClient } from '../../../api/axios';
import { store } from '../../store';
import { exchangeToken, logout } from '../actions';
import { User } from '../types';

const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'info@agid.gov.it',
  mobile_phone: '333333334',
  from_aa: false,
  uid: 'mocked-uid',
  level: 'L2',
  iat: 1646394256,
  exp: 1646397856,
  iss: 'spid-hub-test.dev.pn.pagopa.it',
  jti: 'mocked-jti',
};

export const loginInit = () => {
  let axiosMock: MockAdapter;

  const mockLoginResponse = () => {
    axiosMock = new MockAdapter(authClient);
    axiosMock.onGet(`/token-exchange`).reply(200, userResponse);
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
      user: sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user') || '')
        : {
            sessionToken: '',
            name: '',
            family_name: '',
            fiscal_number: '',
            email: '',
            mobile_phone: '',
            from_aa: false,
            uid: '',
            level: '',
            iat: 0,
            exp: 0,
            iss: '',
            jti: '',
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
      name: '',
      family_name: '',
      fiscal_number: '',
      email: '',
      mobile_phone: '',
      from_aa: false,
      uid: '',
      level: '',
      iat: 0,
      exp: 0,
      iss: '',
      jti: '',
    });
  });
});
