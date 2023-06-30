import { mockApi } from '../../../__test__/test-utils';
import { CREATE_DELEGATION } from '../../../api/delegations/delegations.routes';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import { createDelegation, createDelegationMapper } from '../actions';
import { resetNewDelegation } from '../reducers';
import {
  createDelegationDuplicatedErrorResponse,
  createDelegationGenericErrorResponse,
  createDelegationPayload,
  createDelegationResponse,
  createDelegationSelectedPayload,
  initialState,
} from './test.utils';

describe('delegation redux state tests', () => {
  it('checks the initial state', () => {
    const state = store.getState().newDelegationState;
    expect(state).toEqual(initialState);
  });

  it('creates a new delegation with all organizations', async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      createDelegationMapper(createDelegationPayload),
      createDelegationResponse
    );
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
    mock.reset();
    mock.restore();
  });

  it('creates a new delegation with a single organization', async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      createDelegationMapper(createDelegationSelectedPayload),
      createDelegationResponse
    );
    const action = await store.dispatch(createDelegation(createDelegationSelectedPayload));
    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
    mock.reset();
    mock.restore();
  });

  it("can't create a new delegation", async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      401,
      createDelegationMapper(createDelegationPayload),
      createDelegationGenericErrorResponse
    );
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationGenericErrorResponse);
    mock.reset();
    mock.restore();
  });

  it("can't create a new delegation (duplicated)", async () => {
    const mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      400,
      createDelegationMapper(createDelegationPayload),
      createDelegationDuplicatedErrorResponse
    );
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect((action.payload as any).response.data).toEqual(createDelegationDuplicatedErrorResponse);
    mock.reset();
    mock.restore();
  });

  it('resets the newDelegation state', () => {
    const action = store.dispatch(resetNewDelegation());
    const state = store.getState().newDelegationState;
    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state).toEqual(initialState);
  });
});
