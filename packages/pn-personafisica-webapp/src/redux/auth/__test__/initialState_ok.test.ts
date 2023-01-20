import { userResponse } from './test-users';

/* eslint-disable @typescript-eslint/no-var-requires */

describe('Initial auth redux state tests - session storage with correct JSON', () => {
  afterAll(() => {
    sessionStorage.clear();
  });

  it('check user in store', () => {
    sessionStorage.setItem('user', JSON.stringify(userResponse));
    const store = require('../../store').store;
    const state = store?.getState().userState;
    expect(state.user.fiscal_number).toEqual(userResponse.fiscal_number);
    expect(state.user.uid).toEqual(userResponse.uid);
  });
});
