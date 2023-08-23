import MockAdapter from 'axios-mock-adapter';
import { mockLogin, mockLogout, userResponse } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../../api/apiClients';
import { GET_CONSENTS, SET_CONSENTS } from '../../../api/consents/consents.routes';
import { Consent, ConsentActionType, ConsentType } from '../../../models/consents';
import { store } from '../../store';
import { acceptPrivacy, acceptToS, getPrivacyApproval, getToSApproval } from '../actions';
import { User } from '../types';

/**
 * The tests about how the initial state is set based on the values in sessionStorage
 * must lie in separate files, because
 * - in order to set the session storage before the Redux store is initialized, the store must be
 *   imported using a require (rather than import) statement coming *after* the mock session storage values
 *   are set. E.g.
 * - and furthermore, if we include multiple require statements for the same file in the same test file,
 *   the value obtained in the first require is preserved in all the test files, hence to test with
 *   different initial store values (deriving from different settings of the session storage)
 *   we need to put on different test files.
 * -----------------------
 * Carlos Lombardi, 2022.08.06
 */
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

  // afterAll(() => {
  //   getConsentsApiSpy.mockRestore();
  //   setConsentsApiSpy.mockRestore();
  // });

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
      aud: '',
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

    const stateBefore = store.getState().userState;
    expect(stateBefore.tosConsent.accepted).toBe(false);
    expect(stateBefore.fetchedTos).toBe(false);

    const action = await store.dispatch(getToSApproval());
    const payload = action.payload as Consent;

    expect(action.type).toBe('getToSApproval/fulfilled');
    expect(payload).toEqual(tosMock);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(true);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should fetch ToS not approved', async () => {
    const tosErrorResponse = { response: { data: 'error-tos', status: 500 } };
    mock.onGet(GET_CONSENTS(ConsentType.TOS)).reply(500, 'error-tos');
    const action = await store.dispatch(getToSApproval());
    const payload = action.payload as Consent;

    expect(action.type).toBe('getToSApproval/rejected');
    expect(payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
    expect(store.getState().userState.tosConsent.isFirstAccept).toStrictEqual(true);
    expect(store.getState().userState.fetchedTos).toStrictEqual(true);
  });

  it('Should accept ToS', async () => {
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);
    const action = await store.dispatch(acceptToS('mocked-version-1'));
    const payload = action.payload as string;

    expect(action.type).toBe('acceptToS/fulfilled');
    expect(payload).toEqual('success');
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(true);
  });

  it('Should reject ToS', async () => {
    const tosErrorResponse = { response: { data: undefined, status: 500 } };
    mock
      .onPut(SET_CONSENTS(ConsentType.TOS, 'mocked-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(500);

    const action = await store.dispatch(acceptToS('mocked-version-1'));
    const payload = action.payload as string;

    expect(action.type).toBe('acceptToS/rejected');
    expect(payload).toEqual(tosErrorResponse);
    expect(store.getState().userState.tosConsent.accepted).toStrictEqual(false);
  });

  it('Should fetch privacy approved', async () => {
    const tosMock = {
      recipientId: 'mock-recipient-id',
      consentType: ConsentType.DATAPRIVACY,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    };

    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
    expect(store.getState().userState.fetchedPrivacy).toBe(false);

    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(200, tosMock);
    const action = await store.dispatch(getPrivacyApproval());
    const payload = action.payload as Consent;

    expect(action.type).toBe('getPrivacyApproval/fulfilled');
    expect(payload).toEqual(tosMock);

    expect(store.getState().userState.privacyConsent.accepted).toBe(true);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toBe(true);
    expect(store.getState().userState.privacyConsent.consentVersion).toBe('mocked-version');
    expect(store.getState().userState.fetchedPrivacy).toBe(true);
  });

  it('Should fetch Privacy not approved', async () => {
    const tosErrorResponse = { response: { data: 'error-privacy-approval', status: 500 } };
    mock.onGet(GET_CONSENTS(ConsentType.DATAPRIVACY)).reply(500, 'error-privacy-approval');

    const action = await store.dispatch(getPrivacyApproval());
    const payload = action.payload as string;

    expect(action.type).toBe('getPrivacyApproval/rejected');
    expect(payload).toEqual(tosErrorResponse);

    expect(store.getState().userState.privacyConsent.accepted).toBe(false);
    expect(store.getState().userState.privacyConsent.isFirstAccept).toBe(true);
    expect(store.getState().userState.fetchedPrivacy).toBe(true);
  });

  it('Should accept Privacy', async () => {
    const tosAcceptanceMock = 'success';
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'), {
        action: ConsentActionType.ACCEPT,
      })
      .reply(200);

    const action = await store.dispatch(acceptPrivacy('mock-version-1'));
    const payload = action.payload;

    expect(action.type).toBe('acceptPrivacy/fulfilled');
    expect(payload).toEqual(tosAcceptanceMock);

    expect(store.getState().userState.privacyConsent.accepted).toBe(true);
  });

  it('Should reject Privacy', async () => {
    const privacyErrorResponse = { response: { data: 'error-privacy-approval', status: 500 } };
    mock
      .onPut(SET_CONSENTS(ConsentType.DATAPRIVACY, 'mock-version-1'))
      .reply(500, 'error-privacy-approval');

    const action = await store.dispatch(acceptPrivacy('mock-version-1'));
    const payload = action.payload;

    expect(action.type).toBe('acceptPrivacy/rejected');
    expect(payload).toEqual(privacyErrorResponse);

    expect(action.payload).toEqual(privacyErrorResponse);
    expect(store.getState().userState.privacyConsent.accepted).toStrictEqual(false);
  });
});
