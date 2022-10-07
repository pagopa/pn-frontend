import { UserGroup } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { resetState } from  '../reducers';

const initialState = {
  loading: false,
  apiKey: '',
  groups: [] as Array<UserGroup>,
};

describe('api keys page redux state test', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newApiKeyState;
    expect(state).toEqual(initialState);
  });

  it.skip('Should be able to create new API Key', async () => {

    // TO-DO: Make test for fetching data when BE is ready

  });
  
  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('newApiKeySlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().newApiKeyState;
    expect(state).toEqual(initialState);
  });
});