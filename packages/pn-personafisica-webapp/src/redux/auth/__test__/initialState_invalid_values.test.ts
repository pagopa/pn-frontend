import { userResponse } from "./test-users";

describe('Initial auth redux state - session storage with invalid values in the JSONfile', () => {
  /* eslint-disable @typescript-eslint/no-var-requires */

  afterAll(() => {
    sessionStorage.clear();
  });

  it('check user in store', () => {
    sessionStorage.setItem('user', JSON.stringify({ ...userResponse, iss: 'not an URL' }));
    const store = require('../../store').store;
    const state = store?.getState().userState;
    expect(state.user.fiscal_number).toEqual('');
    expect(state.user.uid).toEqual('');
  });
});
