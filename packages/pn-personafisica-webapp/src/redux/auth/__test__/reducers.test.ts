import { AuthApi } from '../../../api/auth/Auth.api';
import { ConsentsApi } from '../../../api/consents/Consents.api';
import { ConsentType } from '../../../models/consents';
import { store } from '../../store';
import {
  acceptToS,
  getToSApproval,
  exchangeToken,
  logout
} from '../actions';
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
    jest.clearAllMocks();
  });
};

describe('Auth redux state tests', () => {
  const getConsentsApiSpy = jest.spyOn(ConsentsApi, 'getConsentByType');
  const setConsentsApiSpy = jest.spyOn(ConsentsApi, 'setConsentByType');
  
  afterAll(() => {
    getConsentsApiSpy.mockRestore();
    setConsentsApiSpy.mockRestore();
  });

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
      tos: false,
      fetchedTos: false,
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

  it('Should fetch ToS approved', async () => {
    getConsentsApiSpy.mockResolvedValue({
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
    });

    const stateBefore = store.getState().userState;
    expect(stateBefore.tos).toBe(false);
    expect(stateBefore.fetchedTos).toBe(false);

    const action = await store.dispatch(getToSApproval());

    expect(action.type).toBe('getToSApproval/fulfilled');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(true);
    expect(stateAfter.fetchedTos).toBe(true);
  });

  it('Should fetch ToS not approved', async () => {
    getConsentsApiSpy.mockRejectedValue({
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: false,
    });

    // const stateBefore = store.getState().userState;
    // expect(stateBefore.tos).toBe(false);
    // expect(stateBefore.fetchedTos).toBe(false);

    const action = await store.dispatch(getToSApproval());

    expect(action.type).toBe('getToSApproval/rejected');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(false);
    expect(stateAfter.fetchedTos).toBe(true);
  });

  it('Should accept ToS', async () => {
    setConsentsApiSpy.mockResolvedValueOnce('success');

    // const stateBefore = store.getState().userState;
    // expect(stateBefore.tos).toBe(false);

    const action = await store.dispatch(acceptToS());

    expect(action.type).toBe('acceptToS/fulfilled');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(true);
  });

  it('Should reject ToS', async () => {
    setConsentsApiSpy.mockRejectedValueOnce('error');

    // const stateBefore = store.getState().userState;
    // expect(stateBefore.tos).toBe(false);

    const action = await store.dispatch(acceptToS());

    expect(action.type).toBe('acceptToS/rejected');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(false);
  });
});
