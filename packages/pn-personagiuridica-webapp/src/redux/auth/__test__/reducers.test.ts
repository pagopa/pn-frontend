import { store } from '../../store';
import { PartyRole, PNRole, User } from '../types';
import { userResponse } from './test-users';
import { mockLogin, mockLogout } from './test-utils';

import { ConsentsApi } from '../../../api/consents/Consents.api';
import { ConsentType } from '../../../models/consents';
import { acceptToS, getToSApproval } from '../actions';

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
      tos: false,
      isFirstAccept: true,
      consentVersion: '',
      fetchedTos: false,
      isClosedSession: false,
      isUnauthorizedUser: false,
      messageUnauthorizedUser: { title: '', message: '' },
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
    getConsentsApiSpy.mockResolvedValue({
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: true,
      isFirstAccept: true,
      consentVersion: 'mocked-version',
    });

    const stateBefore = store.getState().userState;
    expect(stateBefore.tos).toBe(false);
    expect(stateBefore.fetchedTos).toBe(false);

    const action = await store.dispatch(getToSApproval());

    expect(action.type).toBe('getToSApproval/fulfilled');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(true);
    expect(stateAfter.isFirstAccept).toBe(true);
    expect(stateAfter.consentVersion).toBe('mocked-version');
    expect(stateAfter.fetchedTos).toBe(true);
  });

  it('Should fetch ToS not approved', async () => {
    getConsentsApiSpy.mockRejectedValue({
      recipientId: 'mocked-recipientId',
      consentType: ConsentType.TOS,
      accepted: false,
      isFirstAccept: true,
    });

    const action = await store.dispatch(getToSApproval());

    expect(action.type).toBe('getToSApproval/rejected');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(false);
    expect(stateAfter.isFirstAccept).toBe(true);
    expect(stateAfter.fetchedTos).toBe(true);
  });

  it('Should accept ToS', async () => {
    setConsentsApiSpy.mockResolvedValueOnce('success');

    const action = await store.dispatch(acceptToS('mocked-version-1'));

    expect(action.type).toBe('acceptToS/fulfilled');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(true);
  });

  it('Should reject ToS', async () => {
    setConsentsApiSpy.mockRejectedValueOnce('error');

    const action = await store.dispatch(acceptToS('mocked-version-1'));

    expect(action.type).toBe('acceptToS/rejected');

    const stateAfter = store.getState().userState;
    expect(stateAfter.tos).toBe(false);
  });
});
