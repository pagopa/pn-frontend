import MockAdapter from 'axios-mock-adapter';

import {
  mockLogin,
  mockLogout,
  oneIdentityUserResponse,
  userResponse,
} from '../../../__mocks__/Auth.mock';
import {
  acceptTosPrivacyConsentBodyMock,
  privacyConsentMock,
  tosConsentMock,
  tosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { apiClient, authClient } from '../../../api/apiClients';
import { FIMS_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from '../../../api/auth/auth.routes';
import { LoginProvider, SourceChannel } from '../../../models/User';
import { store } from '../../store';
import { acceptTosPrivacy, exchangeFimsToken, exchangeOneIdentityCode, getTosPrivacyApproval } from '../actions';

describe('Auth redux state tests', () => {
  let apiMock: MockAdapter;
  let authMock: MockAdapter;

  beforeAll(() => {
    apiMock = new MockAdapter(apiClient);
    authMock = new MockAdapter(authClient);
  });

  afterEach(() => {
    apiMock.reset();
    authMock.reset();
  });

  afterAll(() => {
    apiMock.restore();
    authMock.restore();
  });

  it('Initial state', () => {
    const state = store.getState().userState;
    expect(state).toEqual({
      loading: false,
      user: {
        sessionToken: '',
        name: '',
        family_name: '',
        fiscal_number: '',
        email: '',
        from_aa: false,
        uid: '',
        level: '',
        iat: 0,
        exp: 0,
        iss: '',
        jti: '',
        aud: '',
      },
      fetchedTos: false,
      fetchedPrivacy: false,
      tosConsent: {
        accepted: false,
        isFirstAccept: false,
        consentVersion: '',
      },
      privacyConsent: {
        accepted: false,
        isFirstAccept: false,
        consentVersion: '',
      },
      tosPrivacyApiError: false,
      loginProvider: LoginProvider.SPIDHUB,
      isFreshLogin: false,
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(action.payload).toEqual(userResponse);
    expect(store.getState().userState.loginProvider).toBe(LoginProvider.SPIDHUB);
  });

  it('Should be able to exchange FIMS token', async () => {
    const fimsToken = 'mocked-fims-token';
    const fimsUserResponse = {
      ...userResponse,
      source: {
        channel: SourceChannel.WEB,
        details: 'FIMS',
      },
    };

    authMock
      .onPost(FIMS_TOKEN_EXCHANGE(), { authorizationToken: fimsToken })
      .reply(200, fimsUserResponse);
    const action = await store.dispatch(exchangeFimsToken({ fimsToken }));

    expect(action.type).toBe('exchangeFimsToken/fulfilled');
    expect(action.payload).toEqual(fimsUserResponse);
    expect(store.getState().userState.loginProvider).toBe(LoginProvider.FIMS);
  });

  it('Should be able to exchange code with One Identity', async () => {
    authMock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, oneIdentityUserResponse);
    const action = await store.dispatch(
      exchangeOneIdentityCode({
        code: 'mocked-code',
        state: 'mocked-state',
      })
    );

    expect(action.type).toBe('exchangeOneIdentityCode/fulfilled');
    expect(action.payload).toEqual(oneIdentityUserResponse);
    expect(store.getState().userState.loginProvider).toBe(LoginProvider.ONEIDENTITY);
  });

  it('Should strip idp, aar and retrievalId before saving One Identity user to redux and sessionStorage', async () => {
    authMock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, oneIdentityUserResponse);
    await store.dispatch(exchangeOneIdentityCode({ code: 'mocked-code', state: 'mocked-state' }));

    const userFromStorage = JSON.parse(sessionStorage.getItem('user')!);
    expect(userFromStorage.idp).toBeUndefined();
    expect(userFromStorage.aar).toBeUndefined();
    expect(userFromStorage.retrievalId).toBeUndefined();
    expect(userFromStorage).toEqual(userResponse);

    const userFromStore = store.getState().userState.user;
    expect((userFromStore as any).idp).toBeUndefined();
    expect((userFromStore as any).aar).toBeUndefined();
    expect((userFromStore as any).retrievalId).toBeUndefined();
    expect(userFromStore).toEqual(userResponse);
  });

  it('Should be able to logout', async () => {
    const action = await mockLogout();
    expect(action.type).toBe('userSlice/resetState');
    expect(store.getState().userState.user).toEqual({
      sessionToken: '',
      name: '',
      family_name: '',
      fiscal_number: '',
      email: '',
      from_aa: false,
      uid: '',
      level: '',
      iat: 0,
      exp: 0,
      iss: '',
      jti: '',
      aud: '',
    });
  });

  it('Should fetch ToS and Privacy approved', async () => {
    apiMock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));

    const action = await store.dispatch(getTosPrivacyApproval());
    expect(action.type).toBe('getTosPrivacyApproval/fulfilled');
    expect(action.payload).toEqual(tosPrivacyConsentMock(true, true));
    expect(store.getState().userState.tosConsent).toEqual(tosConsentMock(true));
    expect(store.getState().userState.privacyConsent).toEqual(privacyConsentMock(true));
  });

  it('Should NOT be able to fetch ToS and Privacy approved', async () => {
    const tosPrivacyErrorResponse = {
      response: errorMock,
    };
    apiMock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(getTosPrivacyApproval());
    expect(action.type).toBe('getTosPrivacyApproval/rejected');
    expect(action.payload).toEqual(tosPrivacyErrorResponse);

    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);

    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toBe(true);
    expect(store.getState().userState.fetchedPrivacy).toBe(true);
  });

  it('Should be able to fetch tos and privacy acceptance', async () => {
    apiMock.onPut('/bff/v2/tos-privacy').reply(200);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock()));

    expect(action.type).toBe('acceptTosPrivacy/fulfilled');
    expect(store.getState().userState.tosConsent.accepted).toBe(true);
    expect(store.getState().userState.privacyConsent.accepted).toBe(true);
  });

  it('Should NOT be able to fetch tos and privacy acceptance', async () => {
    apiMock.onPut('/bff/v2/tos-privacy').reply(errorMock.status, errorMock.data);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock()));

    expect(action.type).toBe('acceptTosPrivacy/rejected');
    expect(action.payload).toEqual({
      response: errorMock,
    });

    expect(store.getState().userState.tosConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
  });
});
