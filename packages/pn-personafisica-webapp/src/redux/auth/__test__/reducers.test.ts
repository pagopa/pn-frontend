import { store } from '../../store';
import { User } from '../types';
import { userResponse } from './test-users';
import { mockLogin, mockLogout } from './test-utils';

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
      tos: false,
      fetchedTos: false,
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

});
