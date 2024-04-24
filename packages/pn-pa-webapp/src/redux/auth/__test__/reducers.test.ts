import MockAdapter from 'axios-mock-adapter';

import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import {
  acceptTosPrivacyConsentBodyMock,
  tosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { institutionsDTO, productsDTO } from '../../../__mocks__/User.mock';
import { apiClient } from '../../../api/apiClients';
import { PNRole, PartyRole } from '../../../models/user';
import { store } from '../../store';
import {
  acceptTosPrivacy,
  getInstitutions,
  getProductsOfInstitution,
  getTosPrivacyApproval,
} from '../actions';

describe('Auth redux state tests', () => {
  // eslint-disable-next-line functional/no-let
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
      productsOfInstitution: [],
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

  it('Should be able to fetch the tos and privacy approval', async () => {
    mock.onGet('/bff/v1/tos-privacy').reply(200, tosPrivacyConsentMock(true, true));
    const action = await store.dispatch(getTosPrivacyApproval());
    expect(action.type).toBe('getTosPrivacyApproval/fulfilled');
    expect(action.payload).toEqual(tosPrivacyConsentMock(true, true));

    expect(store.getState().userState.tosConsent).toEqual(tosPrivacyConsentMock(true, true).tos);
    expect(store.getState().userState.privacyConsent).toEqual(
      tosPrivacyConsentMock(true, true).privacy
    );
  });

  it('Should NOT be able to fetch the tos and privacy approval', async () => {
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

  it('Should be able to fetch institutions', async () => {
    mock.onGet('bff/v1/institutions').reply(200, institutionsDTO);
    const action = await store.dispatch(getInstitutions());
    expect(action.type).toBe('getInstitutions/fulfilled');
    expect(action.payload).toEqual(institutionsDTO);
    expect(store.getState().userState.institutions).toStrictEqual(institutionsDTO);
  });

  it('Should be able to fetch productsInstitution', async () => {
    mock.onGet('bff/v1/institutions/products').reply(200, productsDTO);
    const action = await store.dispatch(getProductsOfInstitution());
    expect(action.type).toBe('getProductsOfInstitution/fulfilled');
    expect(action.payload).toEqual(productsDTO);
    expect(store.getState().userState.productsOfInstitution).toStrictEqual(productsDTO);
  });
});
