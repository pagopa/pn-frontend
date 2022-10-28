import { ApiKey } from '../../../models/ApiKeys';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { resetState } from  '../reducers';

const initialState = {
  loading: false,
  apiKeys: [] as Array<ApiKey>,
};

describe('api keys page redux state test', () => {
  mockAuthentication();
  it('initial state', () => {
    const state = store.getState().apiKeysState;
    expect(state).toEqual({
      loading: false,
      apiKeys: [] as Array<ApiKey>
    });
  });

  // TO-DO: Make test for fetching data when BE is ready
  it.skip('Should be able to fetch the api keys list', async () => {
    
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('apiKeysSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().apiKeysState;
    expect(state).toEqual(initialState);
  });
});