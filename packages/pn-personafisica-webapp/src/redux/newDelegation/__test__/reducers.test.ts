import MockAdapter from 'axios-mock-adapter';
import {
  createDelegationDuplicatedErrorResponse,
  createDelegationGenericErrorResponse,
  createDelegationPayload,
  createDelegationResponse,
  createDelegationSelectedPayload,
  initialState,
} from '../../../__mocks__/CreateDelegations.mock';
import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { CREATE_DELEGATION } from '../../../api/delegations/delegations.routes';
import { store } from '../../store';
import { createDelegation, createDelegationMapper } from '../actions';
import { resetNewDelegation } from '../reducers';

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
    mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      undefined,
      createDelegationResponse
    );
    const action = await store.dispatch(createDelegation(createDelegationPayload));

    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it('creates a new delegation with a single organization', async () => {
    mock = mockApi(
      apiClient,
      'POST',
      CREATE_DELEGATION(),
      200,
      undefined,
      createDelegationResponse
    );
    const action = await store.dispatch(createDelegation(createDelegationSelectedPayload));

    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it("can't create a new delegation", async () => {
    mock = mockApi(
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
  });

  it("can't create a new delegation (duplicated)", async () => {
    mock = mockApi(
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
  });

  it('resets the newDelegation state', () => {
    const action = store.dispatch(resetNewDelegation());
    const state = store.getState().newDelegationState;

    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state).toEqual(initialState);
  });
});
