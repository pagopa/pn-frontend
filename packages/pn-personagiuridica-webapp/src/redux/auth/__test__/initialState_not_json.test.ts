describe('Initial auth redux state - session storage with non-JSON value', () => {
  /* eslint-disable @typescript-eslint/no-var-requires */

  afterAll(() => {
    sessionStorage.clear();
  });

  it('check user in store', () => {
    sessionStorage.setItem('user', 'not a JSON');
    const store = require('../../store').store;
    const state = store?.getState().userState;
    expect(state.user.fiscal_number).toEqual('');
    expect(state.user.uid).toEqual('');
  });
});

export {};