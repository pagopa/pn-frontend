import MockAdapter from 'axios-mock-adapter';

import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import {
  acceptTosPrivacyConsentBodyMock,
  privacyConsentMock,
  tosConsentMock,
  tosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { acceptTosPrivacy, getTosPrivacyApproval } from '../actions';

describe('Auth redux state tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
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
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(action.payload).toEqual(userResponse);
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
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));

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
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(errorMock.status, errorMock.data);
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
    mock.onPut('/bff/v2/tos-privacy').reply(200);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock()));

    expect(action.type).toBe('acceptTosPrivacy/fulfilled');
    expect(store.getState().userState.tosConsent.accepted).toBe(true);
    expect(store.getState().userState.privacyConsent.accepted).toBe(true);
  });

  it('Should NOT be able to fetch tos and privacy acceptance', async () => {
    mock.onPut('/bff/v2/tos-privacy').reply(errorMock.status, errorMock.data);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock()));

    expect(action.type).toBe('acceptTosPrivacy/rejected');
    expect(action.payload).toEqual({
      response: errorMock,
    });

    expect(store.getState().userState.tosConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
  });
});
