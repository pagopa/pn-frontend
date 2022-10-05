import { ApiKey } from '../../../models/ApiKeys';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';

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
});