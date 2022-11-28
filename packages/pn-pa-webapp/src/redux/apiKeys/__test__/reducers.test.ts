import { ApiKeysApi } from '../../../api/apiKeys/ApiKeys.api';
import { ApiKey } from '../../../models/ApiKeys';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import { getApiKeys } from '../actions';
import { resetState } from  '../reducers';
import { mockApiKeysForFE } from './test-utils';

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

  it('Should be able to fetch the api keys list', async () => {
    const apiSpy = jest.spyOn(ApiKeysApi, 'getApiKeys');
    apiSpy.mockResolvedValue(mockApiKeysForFE);
    const action = await store.dispatch(getApiKeys());
    const payload = action.payload;
    expect(action.type).toBe('getApiKeys/fulfilled');
    expect(payload).toEqual(mockApiKeysForFE);
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