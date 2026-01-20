import MockAdapter from 'axios-mock-adapter';

import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import {
  acceptTosPrivacyConsentBodyMock,
  privacyConsentMock,
  tosConsentMock,
  tosPrivacyConsentMock,
} from '../../../__mocks__/Consents.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { institutionsDTO, productsDTO } from '../../../__mocks__/User.mock';
import { createMockedStore } from '../../../__test__/test-utils';
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
      fetchedTos: false,
      fetchedPrivacy: false,
      tosPrivacyApiError: false,
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
      institutions: [],
      productsOfInstitution: [],
      additionalLanguages: [],
    });
  });

  it('Should be able to exchange token', async () => {
    const action = await mockLogin();
    expect(action.type).toBe('exchangeToken/fulfilled');
    expect(action.payload).toEqual(userResponse);
  });

  it('Should be able to exchange token - invalid json', async () => {
    const action = await mockLogin('invalid-json');
    expect(action.type).toBe('exchangeToken/rejected');
    expect(action.payload).toEqual({
      code: 'USER_VALIDATION_FAILED',
      message: expect.any(String),
    });
  });

  it('Should be able to exchange token - fail validation', async () => {
    const preState = store.getState();
    const action = await mockLogin({ ...userResponse, uid: 'not an uid' });
    expect(action.type).toBe('exchangeToken/rejected');
    const postState = store.getState();
    expect(postState.userState.user).toEqual(preState.userState.user);
  });

  it('Should be able to logout', async () => {
    const action = await mockLogout();
    expect(action.type).toBe('userSlice/resetState');
    expect(store.getState().userState.user).toEqual({
      desired_exp: 0,
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
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(200, tosPrivacyConsentMock(true, true));
    const action = await store.dispatch(getTosPrivacyApproval());
    expect(action.type).toBe('getTosPrivacyApproval/fulfilled');
    expect(action.payload).toEqual(tosPrivacyConsentMock(true, true));

    expect(store.getState().userState.tosConsent).toEqual(tosConsentMock(true));
    expect(store.getState().userState.privacyConsent).toEqual(privacyConsentMock(true));
  });

  it('Should NOT be able to fetch the tos and privacy approval', async () => {
    mock.onGet(/\/bff\/v2\/tos-privacy.*/).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(getTosPrivacyApproval());
    expect(action.type).toBe('getTosPrivacyApproval/rejected');
    expect(action.payload).toEqual({ response: errorMock });

    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);

    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toBe(true);
    expect(store.getState().userState.fetchedPrivacy).toBe(true);
  });

  it('Should be able to fetch tos and privacy acceptance', async () => {
    mock.onPut('/bff/v2/tos-privacy').reply(200);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock));

    expect(action.type).toBe('acceptTosPrivacy/fulfilled');
    expect(store.getState().userState.tosConsent.accepted).toBe(true);
    expect(store.getState().userState.privacyConsent.accepted).toBe(true);
  });

  it('Should NOT be able to fetch tos and privacy acceptance', async () => {
    mock.onPut('/bff/v2/tos-privacy').reply(errorMock.status, errorMock.data);

    const action = await store.dispatch(acceptTosPrivacy(acceptTosPrivacyConsentBodyMock));

    expect(action.type).toBe('acceptTosPrivacy/rejected');
    expect(action.payload).toEqual({ response: errorMock });

    expect(store.getState().userState.tosConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
  });

  it('Should be able to fetch institutions', async () => {
    // preset store
    const mockedStore = createMockedStore({
      userState: { user: userResponse },
    });

    mock.onGet('bff/v1/institutions').reply(200, institutionsDTO);
    const action = await mockedStore.dispatch(getInstitutions());
    expect(action.type).toBe('getInstitutions/fulfilled');
    expect(action.payload).toEqual(institutionsDTO);
    expect(mockedStore.getState().userState.institutions).toStrictEqual(institutionsDTO);
  });

  it('Should be able to add current institution if not in list', async () => {
    const userOrganization = {
      id: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1c5',
      name: 'Comune di Test',
      roles: [
        {
          partyRole: PartyRole.OPERATOR,
          role: PNRole.OPERATOR,
        },
      ],
    };
    // preset store
    const mockedStore = createMockedStore({
      userState: {
        user: {
          ...userResponse,
          organization: userOrganization,
        },
      },
    });

    mock.onGet('bff/v1/institutions').reply(200, institutionsDTO);
    const action = await mockedStore.dispatch(getInstitutions());
    expect(action.type).toBe('getInstitutions/fulfilled');
    const institutions = [
      ...institutionsDTO,
      {
        id: userOrganization.id,
        name: userOrganization.name,
        productRole: userOrganization?.roles[0].role,
        parentName: undefined,
      },
    ];
    expect(action.payload).toEqual(institutions);
    expect(mockedStore.getState().userState.institutions).toStrictEqual(institutions);
  });

  it('Should be able to return current institution if empty list', async () => {
    const userOrganization = {
      id: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1c5',
      name: 'Comune di Test',
      roles: [
        {
          partyRole: PartyRole.OPERATOR,
          role: PNRole.OPERATOR,
        },
      ],
    };
    // preset store
    const mockedStore = createMockedStore({
      userState: {
        user: {
          ...userResponse,
          organization: userOrganization,
        },
      },
    });

    mock.onGet('bff/v1/institutions').reply(200, []);
    const action = await mockedStore.dispatch(getInstitutions());
    expect(action.type).toBe('getInstitutions/fulfilled');
    const institutions = [
      {
        id: userOrganization.id,
        name: userOrganization.name,
        productRole: userOrganization?.roles[0].role,
        parentName: undefined,
      },
    ];
    expect(action.payload).toEqual(institutions);
    expect(mockedStore.getState().userState.institutions).toStrictEqual(institutions);
  });

  it('Should be able to fetch productsInstitution', async () => {
    mock.onGet('bff/v1/institutions/products').reply(200, productsDTO);
    const action = await store.dispatch(getProductsOfInstitution());
    expect(action.type).toBe('getProductsOfInstitution/fulfilled');
    expect(action.payload).toEqual(productsDTO);
    expect(store.getState().userState.productsOfInstitution).toStrictEqual(productsDTO);
  });
});
