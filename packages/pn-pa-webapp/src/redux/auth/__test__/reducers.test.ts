import MockAdapter from 'axios-mock-adapter';
import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { GET_CONSENTS, SET_CONSENTS } from '../../../api/consents/consents.routes';
import { Consent, ConsentActionType, ConsentType } from '../../../models/consents';
import { PartyRole, PNRole } from '../../../models/user';
import { store } from '../../store';
import {
    acceptPrivacy, acceptToS, getOrganizationParty, getPrivacyApproval, getToSApproval
} from '../actions';
import { User } from '../types';
import { mockLogin, mockLogout, userResponse } from './test-utils';
import { ConsentsApi } from '../../../api/consents/Consents.api';

describe('Auth redux state tests', () => {
  let mock: MockAdapter;

  afterEach(() => {
    if (mock) {
      mock.reset();
      mock.restore();
    }
  });

  it('Initial state', () => {
    const state = store.getState().userState;
    expect(state).toEqual({
      loading: false,
      user: sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user') || '')
        : {
            email: '',
            name: '',
            uid: '',
            sessionToken: '',
            family_name: '',
            fiscal_number: '',
            organization: {
              id: '',
              roles: [
                {
                  role: PNRole.ADMIN,
                  partyRole: PartyRole.MANAGER,
                },
              ],
              fiscal_code: '',
            },
            desired_exp: 0,
          },
      isUnauthorizedUser: false,
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
      messageUnauthorizedUser: { title: '', message: '' },
      isClosedSession: false,
      isForbiddenUser: false,
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
      email: '',
      name: '',
      uid: '',
      sessionToken: '',
      family_name: '',
      fiscal_number: '',
      organization: {
        id: '',
        roles: [
          {
            role: PNRole.ADMIN,
            partyRole: PartyRole.MANAGER,
          },
        ],
        fiscal_code: '',
      },
    });
  });

  it('Should be able to fetch the tos approval', async () => {
    const tosMock = {
      recipientId: 'mock-recipient-id',
      consentType: ConsentType.TOS,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };
    mockApi(apiClient, 'GET', GET_CONSENTS(ConsentType.TOS), 200, undefined, tosMock);
    const action = await store.dispatch(getToSApproval());
    const payload = action.payload as Consent;
    expect(action.type).toBe('getToSApproval/fulfilled');
    expect(payload).toEqual(tosMock);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(true);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should NOT be able to fetch the tos approval', async () => {
    const tosErrorResponse = { response: { data: 'error-tos', status: 500 } };
    mockApi(apiClient, 'GET', GET_CONSENTS(ConsentType.TOS), 500, undefined, 'error-tos');
    const action = await store.dispatch(getToSApproval());
    expect(action.type).toBe('getToSApproval/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should be able to fetch tos acceptance', async () => {
    mock = mockApi(apiClient, 'PUT', SET_CONSENTS(ConsentType.TOS, 'mock-version-1'), 200, {
      action: ConsentActionType.ACCEPT,
    }, 'success');
    const action = await store.dispatch(acceptToS('mock-version-1'));
    const payload = action.payload as string;
    expect(action.type).toBe('acceptToS/fulfilled');
    expect(payload).toEqual('success');
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(true);
  });

  it('Should NOT be able to fetch tos acceptance', async () => {
    const tosErrorResponse = { response: { data: undefined, status: 500 }};
    mock = mockApi(apiClient, 'PUT', SET_CONSENTS(ConsentType.TOS, 'mock-version-1'), 500, {
      action: ConsentActionType.ACCEPT,
    });
    const action = await store.dispatch(acceptToS('mock-version-1'));
    expect(action.type).toBe('acceptToS/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
  });

  it('Should be able to fetch the privacy approval', async () => {
    const tosMock = {
      recipientId: 'mock-recipient-id',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };
    mockApi(apiClient, 'GET', GET_CONSENTS(ConsentType.DATAPRIVACY), 200, undefined, tosMock);
    const action = await store.dispatch(getPrivacyApproval());
    const payload = action.payload as Consent;
    expect(action.type).toBe('getPrivacyApproval/fulfilled');
    expect(payload).toEqual(tosMock);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(true);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedPrivacy).toStrictEqual(true);
  });

  it('Should NOT be able to fetch the privacy approval', async () => {
    const tosErrorResponse = { response: { data: 'error-privacy-approval', status: 500 }};
    mockApi(apiClient, 'GET', GET_CONSENTS(ConsentType.DATAPRIVACY), 500, undefined, 'error-privacy-approval');
    const action = await store.dispatch(getPrivacyApproval());
    expect(action.type).toBe('getPrivacyApproval/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedPrivacy).toStrictEqual(true);
  });

  it('Should be able to fetch privacy acceptance', async () => {
    mock = mockApi(apiClient, 'PUT', SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'), 200, {
      action: ConsentActionType.ACCEPT,
    });
    const action = await store.dispatch(acceptPrivacy('mock-version-1'));
    const payload = action.payload as string;
    expect(action.type).toBe('acceptPrivacy/fulfilled');
    expect(payload).toEqual('success');
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(true);
  });

  it('Should NOT be able to fetch privacy acceptance', async () => {
    const privacyErrorResponse = { response: { data: undefined, status: 500 }};
    mock = mockApi(apiClient, 'PUT', SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'), 500, {
      action: ConsentActionType.ACCEPT,
    });
    const action = await store.dispatch(acceptPrivacy('mock-version-1'));
    expect(action.type).toBe('acceptPrivacy/rejected');
    expect(action.payload).toEqual(privacyErrorResponse);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(false);
  });
});
