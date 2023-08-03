import MockAdapter from 'axios-mock-adapter';
import { store } from '../../store';
import { DelegationsApi } from '../../../api/delegations/Delegations.api';
import { apiClient } from '../../../api/apiClients';
import { createDelegation } from '../actions';
import { resetNewDelegation } from '../reducers';
import {
  createDelegationDuplicatedErrorResponse,
  createDelegationGenericErrorResponse,
  createDelegationPayload,
  createDelegationResponse,
  createDelegationSelectedPayload,
  initialState,
} from './test.utils';
import { mockApi } from '../../../__test__/test-utils';
import { CREATE_DELEGATION } from '../../../api/delegations/delegations.routes';


describe('delegation redux state tests', () => {
  let mock: MockAdapter;

  afterEach(() => {
    if (mock) {
      mock.restore();
      mock.reset();
    }
  });

  it('checks the initial state', () => {
    const state = store.getState().newDelegationState;
    expect(state).toEqual(initialState);
  });

  it('creates a new delegation with all organizations', async () => {
    mock = mockApi(apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      undefined,
      createDelegationResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));

    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it('creates a new delegation with a single organization', async () => {
    mock = mockApi(apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      undefined,
      createDelegationResponse);
    const action = await store.dispatch(createDelegation(createDelegationSelectedPayload));

    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it("can't create a new delegation", async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'createDelegation');
    apiSpy.mockRejectedValue(createDelegationGenericErrorResponse);
    // mock = mockApi(apiClient,
    //   'POST',
    //   CREATE_DELEGATION(),
    //   401,
    //   undefined,
    //   createDelegationGenericErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    

    expect(action.type).toBe('createDelegation/rejected');
    expect(action.payload).toEqual(createDelegationGenericErrorResponse);
  });

  it("can't create a new delegation (duplicated)", async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'createDelegation');
    apiSpy.mockRejectedValue(createDelegationDuplicatedErrorResponse);
    // mock = mockApi(apiClient,
    //   'POST',
    //   CREATE_DELEGATION(),
    //   400,
    //   undefined,
    //   createDelegationDuplicatedErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect(action.payload).toEqual(createDelegationDuplicatedErrorResponse);
  });

  it('resets the newDelegation state', () => {
    const action = store.dispatch(resetNewDelegation());
    const state = store.getState().newDelegationState;

    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state).toEqual(initialState);
  });
});
