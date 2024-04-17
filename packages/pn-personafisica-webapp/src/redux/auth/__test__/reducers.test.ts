import MockAdapter from 'axios-mock-adapter';

import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import { acceptTosPrivacyConsentBodyMock } from '../../../__mocks__/Consents.mock';
import { apiClient } from '../../../api/apiClients';
import { ConsentType } from '../../../models/consents';
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
        mobile_phone: '',
        from_aa: false,
        uid: '',
        level: '',
        iat: 0,
        exp: 0,
        iss: '',
        jti: '',
        aud: '',
      },
      isClosedSession: false,
      isUnauthorizedUser: false,
      messageUnauthorizedUser: { title: '', message: '' },
      isForbiddenUser: false,
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
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(action.payload).toEqual(userResponse);
  });

  it('Should be able to logout', async () => {
    const action = await mockLogout();
    expect(action.type).toBe('logout/fulfilled');
    expect(action.payload).toEqual({
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
      aud: '',
    });
  });

  it('Should fetch ToS and Privacy approved', async () => {
    const tosMock = {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };

    const privacyMock = {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };

    const tosPrivacyMock = {
      tos: tosMock,
      privacy: privacyMock,
    };

    mock.onGet('/bff/v1/tos-privacy').reply(200, tosPrivacyMock);

    const action = await store.dispatch(getTosPrivacyApproval());
    expect(action.type).toBe('getTosPrivacyApproval/fulfilled');
    expect(action.payload).toEqual(tosPrivacyMock);
    expect(store.getState().userState.tosConsent).toEqual(tosMock);
  });

  it('Should NOT be able to fetch ToS and Privacy approved', async () => {
    const tosPrivacyErrorResponse = {
      response: { data: 'error-tos-privacy-approval', status: 500 },
    };
    mock.onGet('/bff/v1/tos-privacy').reply(500, 'error-tos-privacy-approval');
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
    mock.onPut('/bff/v1/tos-privacy').reply(200);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock));

    expect(action.type).toBe('acceptTosPrivacy/fulfilled');
    expect(store.getState().userState.tosConsent.accepted).toBe(true);
    expect(store.getState().userState.privacyConsent.accepted).toBe(true);
  });

  it('Should NOT be able to fetch tos and privacy acceptance', async () => {
    mock.onPut('/bff/v1/tos-privacy').reply(500, 'error-accept-tos-privacy');

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock));

    expect(action.type).toBe('acceptTosPrivacy/rejected');
    expect(action.payload).toEqual({
      response: { data: 'error-accept-tos-privacy', status: 500 },
    });

    expect(store.getState().userState.tosConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
  });
});
