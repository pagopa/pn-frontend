import MockAdapter from 'axios-mock-adapter';

import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import { getApiClient } from '../../../api/apiClients';
import { GET_CONSENTS, SET_CONSENTS } from '../../../api/consents/consents.routes';
import { ConsentActionType, ConsentType } from '../../../models/consents';
import { PNRole, PartyRole } from '../../../models/user';
import { store } from '../../store';
import { acceptPrivacy, acceptToS, getInstitutions, getPrivacyApproval, getProductsOfInstitution, getToSApproval } from '../actions';
import { GET_INSTITUTIONS, GET_INSTITUTION_PRODUCTS } from '../../../api/external-registries/external-registries-routes';
import { institutionsDTO, institutionsList, productsDTO, productsList } from '../../../__mocks__/User.mock';

describe('Auth redux state tests', () => {
  // eslint-disable-next-line functional/no-let
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
      institutions: [],
      productsOfInstitution: []
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(action.payload).toEqual(userResponse);
  });

  it('Should be able to exchange token - invalid json', async () => {
    const action = await mockLogin('invalid-json');
    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(action.payload).toStrictEqual({
      email: undefined,
      name: undefined,
      organization: undefined,
      uid: undefined,
      sessionToken: undefined,
      family_name: undefined,
      fiscal_number: undefined,
      desired_exp: undefined,
    });
  });

  it('Should be able to exchange token - fail validation', async () => {
    const action = await mockLogin({ ...userResponse, uid: 'not an uid' });
    expect(action.type).toBe('exchangeToken/fulfilled');
    const state = store.getState();
    expect(state.userState.isUnauthorizedUser).toBeTruthy();
  });

  it('Should be able to logout', async () => {
    const action = await mockLogout();
    expect(action.type).toBe('logout/fulfilled');
    expect(action.payload).toEqual({
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
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(200, tosMock);
    const action = await store.dispatch(getToSApproval());
    expect(action.type).toBe('getToSApproval/fulfilled');
    expect(action.payload).toEqual(tosMock);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(true);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should NOT be able to fetch the tos approval', async () => {
    const tosErrorResponse = { response: { data: 'error-tos', status: 500 } };
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500, 'error-tos');
    const action = await store.dispatch(getToSApproval());
    expect(action.type).toBe('getToSApproval/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should be able to fetch tos acceptance', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mock-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const action = await store.dispatch(acceptToS('mock-version-1'));
    expect(action.type).toBe('acceptToS/fulfilled');
    expect(action.payload).toEqual('success');
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(true);
  });

  it('Should NOT be able to fetch tos acceptance', async () => {
    const tosErrorResponse = { response: { data: undefined, status: 500 } };
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mock-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(500);
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
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, tosMock);
    const action = await store.dispatch(getPrivacyApproval());
    expect(action.type).toBe('getPrivacyApproval/fulfilled');
    expect(action.payload).toEqual(tosMock);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(true);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedPrivacy).toStrictEqual(true);
  });

  it('Should NOT be able to fetch the privacy approval', async () => {
    const tosErrorResponse = { response: { data: 'error-privacy-approval', status: 500 } };
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(500, 'error-privacy-approval');
    const action = await store.dispatch(getPrivacyApproval());
    expect(action.type).toBe('getPrivacyApproval/rejected');
    expect(action.payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedPrivacy).toStrictEqual(true);
  });

  it('Should be able to fetch privacy acceptance', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const action = await store.dispatch(acceptPrivacy('mock-version-1'));
    expect(action.type).toBe('acceptPrivacy/fulfilled');
    expect(action.payload).toEqual('success');
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(true);
  });

  it('Should NOT be able to fetch privacy acceptance', async () => {
    const privacyErrorResponse = { response: { data: 'error-privacy-approval', status: 500 } };
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(500, 'error-privacy-approval');
    const action = await store.dispatch(acceptPrivacy('mock-version-1'));
    expect(action.type).toBe('acceptPrivacy/rejected');
    expect(action.payload).toEqual(privacyErrorResponse);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(false);
  });

  it('Should be able to fetch institutions', async () => {
    mock
      .onGet(GET_INSTITUTIONS())
      .reply(200, institutionsDTO);
    const action = await store.dispatch(getInstitutions());
    expect(action.type).toBe('getInstitutions/fulfilled');
    expect(action.payload).toEqual(institutionsList);
    expect(store.getState().userState.institutions).toStrictEqual(institutionsList);
  });

  it('Should be able to fetch productsInstitution', async () => {
    mock
      .onGet(GET_INSTITUTION_PRODUCTS('1'))
      .reply(200, productsDTO);
    const action = await store.dispatch(getProductsOfInstitution('1'));
    expect(action.type).toBe('getProductsOfInstitution/fulfilled');
    expect(action.payload).toEqual(productsList);
    expect(store.getState().userState.productsOfInstitution).toStrictEqual(productsList);
  });
});
