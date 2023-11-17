import MockAdapter from 'axios-mock-adapter';

import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import { getApiClient } from '../../../api/apiClients';
import { GET_CONSENTS, SET_CONSENTS } from '../../../api/consents/consents.routes';
import { ConsentActionType, ConsentType } from '../../../models/consents';
import { getStore } from '../../store';
import { acceptPrivacy, acceptToS, getPrivacyApproval, getToSApproval } from '../actions';
import { PNRole, PartyRole } from '../types';

describe('Auth redux state tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(getApiClient());
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = getStore().getState().userState;
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
        desired_exp: 0,
        hasGroup: false,
        organization: {
          fiscal_code: '',
          id: '',
          roles: [
            {
              partyRole: PartyRole.MANAGER,
              role: PNRole.ADMIN,
            },
          ],
        },
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
      isClosedSession: false,
      isUnauthorizedUser: false,
      messageUnauthorizedUser: { title: '', message: '' },
      isForbiddenUser: false,
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
      from_aa: false,
      uid: '',
      level: '',
      iat: 0,
      exp: 0,
      iss: '',
      jti: '',
      aud: '',
      desired_exp: 0,
      organization: {
        fiscal_code: '',
        id: '',
        roles: [
          {
            partyRole: PartyRole.MANAGER,
            role: PNRole.ADMIN,
          },
        ],
      },
    });
  });

  it('Should fetch ToS approved', async () => {
    const tosMock = {
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, tosMock);
    const action = await getStore().dispatch(getToSApproval());
    expect(action.type).toBe('getToSApproval/fulfilled');
    expect(action.payload).toEqual(tosMock);
    expect(getStore().getState().userState.tosConsent.accepted).toStrictEqual(true);
    expect(getStore().getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(getStore().getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should NOT be able to fetch the tos approval', async () => {
    const tosErrorResponse = { response: { data: 'error-tos', status: 500 } };
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500, 'error-tos');
    const action = await getStore().dispatch(getToSApproval());
    expect(action.type).toBe('getToSApproval/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(getStore().getState().userState.tosConsent.accepted).toStrictEqual(false);
    expect(getStore().getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(getStore().getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should be able to fetch tos acceptance', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const action = await getStore().dispatch(acceptToS('mocked-version-1'));
    expect(action.type).toBe('acceptToS/fulfilled');
    expect(action.payload).toEqual('success');
    expect(getStore().getState().userState.tosConsent.accepted).toStrictEqual(true);
  });

  it('Should NOT be able to fetch tos acceptance', async () => {
    const tosErrorResponse = { response: { data: undefined, status: 500 } };
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(500);
    const action = await getStore().dispatch(acceptToS('mocked-version-1'));
    expect(action.type).toBe('acceptToS/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(getStore().getState().userState.tosConsent.accepted).toStrictEqual(false);
  });

  it('Should be able to fetch the privacy approval', async () => {
    const tosMock = {
      recipientId: 'mock-recipient-id',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, tosMock);
    const action = await getStore().dispatch(getPrivacyApproval());
    expect(action.type).toBe('getPrivacyApproval/fulfilled');
    expect(action.payload).toEqual(tosMock);
    expect(getStore().getState().userState.privacyConsent.accepted).toBe(true);
    expect(getStore().getState().userState.privacyConsent.isFirstAccept).toBe(true);
    expect(getStore().getState().userState.privacyConsent.consentVersion).toBe('mocked-version');
    expect(getStore().getState().userState.fetchedPrivacy).toBe(true);
  });

  it('Should NOT be able to fetch the privacy approval', async () => {
    const tosErrorResponse = { response: { data: 'error-privacy-approval', status: 500 } };
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(500, 'error-privacy-approval');
    const action = await getStore().dispatch(getPrivacyApproval());
    expect(action.type).toBe('getPrivacyApproval/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(getStore().getState().userState.privacyConsent.accepted).toBe(false);
    expect(getStore().getState().userState.privacyConsent.isFirstAccept).toBe(true);
    expect(getStore().getState().userState.fetchedPrivacy).toBe(true);
  });

  it('Should be able to fetch privacy acceptance', async () => {
    const tosAcceptanceMock = 'success';
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const action = await getStore().dispatch(acceptPrivacy('mock-version-1'));
    expect(action.type).toBe('acceptPrivacy/fulfilled');
    expect(action.payload).toEqual(tosAcceptanceMock);
    expect(getStore().getState().userState.privacyConsent.accepted).toBe(true);
  });

  it('Should NOT be able to fetch privacy acceptance', async () => {
    const privacyErrorResponse = { response: { data: 'error-privacy-approval', status: 500 } };
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'))
      .reply(500, 'error-privacy-approval');
    const action = await getStore().dispatch(acceptPrivacy('mock-version-1'));
    expect(action.type).toBe('acceptPrivacy/rejected');
    expect(action.payload).toEqual(privacyErrorResponse);
    expect(action.payload).toEqual(privacyErrorResponse);
    expect(getStore().getState().userState.privacyConsent.accepted).toStrictEqual(false);
  });
});
