import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
  UPDATE_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../../api/external-registries/external-registries-routes';
import { Delegation, DelegationStatus, GetDelegatorsResponse } from '../../../models/Deleghe';
import { GroupStatus } from '../../../models/groups';
import { store } from '../../store';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import {
  acceptDelegation,
  getDelegatesByCompany,
  getDelegators,
  getGroups,
  rejectDelegation,
  revokeDelegation,
  updateDelegation,
} from '../actions';
import { arrayOfDelegates, arrayOfDelegators, initialState } from './test.utils';
import { resetState, setFilters } from '../reducers';

describe('delegation redux state tests', () => {
  mockAuthentication();

  it('checks the initial state', () => {
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });

  it('should be able to fetch the delegates', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_BY_DELEGATOR(),
      200,
      undefined,
      arrayOfDelegates
    );
    const action = await store.dispatch(getDelegatesByCompany());
    const payload = action.payload as Array<Delegation>;
    expect(action.type).toBe('getDelegatesByCompany/fulfilled');
    expect(payload).toEqual(arrayOfDelegates);
    mock.reset();
    mock.restore();
  });

  it('should be able to fetch the delegators', async () => {
    const mock = mockApi(apiClient, 'POST', DELEGATIONS_BY_DELEGATE({ size: 10 }), 200, undefined, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    const action = await store.dispatch(getDelegators({ size: 10 }));
    const payload = action.payload as GetDelegatorsResponse;
    expect(action.type).toBe('getDelegators/fulfilled');
    expect(payload.resultsPage).toEqual(arrayOfDelegators);
    mock.reset();
    mock.restore();
  });

  it('should accept a delegation request', async () => {
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('1'), 204);
    const action = await store.dispatch(
      acceptDelegation({ id: '1', code: '12345', groups: [{ id: 'group-1', name: 'Group 1' }] })
    );
    const payload = action.payload;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(payload).toEqual({ id: '1', groups: [{ id: 'group-1', name: 'Group 1' }] });
    mock.reset();
    mock.restore();
  });

  it('should throw an error trying to accept a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('1'), 500);
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345', groups: [] }));
    const payload = action.payload as any;
    expect(action.type).toBe('acceptDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    mock.reset();
    mock.restore();
  });

  it('should reject a delegation from a delegator', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('2'), 204);
    const action = await store.dispatch(rejectDelegation('2'));
    const payload = action.payload;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(payload).toEqual({ id: '2' });
    mock.reset();
    mock.restore();
  });

  it('should throw an error trying to reject a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('2'), 500);
    const action = await store.dispatch(rejectDelegation('2'));
    const payload = action.payload as any;
    expect(action.type).toBe('rejectDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    mock.reset();
    mock.restore();
  });

  it('should revoke a delegation for a delegate', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('2'), 204);
    const action = await store.dispatch(revokeDelegation('2'));
    const payload = action.payload;
    expect(action.type).toBe('revokeDelegation/fulfilled');
    expect(payload).toEqual({ id: '2' });
    mock.reset();
    mock.restore();
  });

  it('should throw an error trying to revoke a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('2'), 500);
    const action = await store.dispatch(revokeDelegation('2'));
    const payload = action.payload as any;
    expect(action.type).toBe('revokeDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    mock.reset();
    mock.restore();
  });

  it('should get groups for the current PG', async () => {
    const mock = mockApi(apiClient, 'GET', GET_GROUPS(), 200, undefined, [
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ]);
    const action = await store.dispatch(getGroups());
    const payload = action.payload as any;
    expect(action.type).toBe('getGroups/fulfilled');
    expect(payload).toEqual([
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ]);
    mock.reset();
    mock.restore();
  });

  it('should update a delegation request', async () => {
    const mock = mockApi(apiClient, 'PATCH', UPDATE_DELEGATION('1'), 204);
    const action = await store.dispatch(
      updateDelegation({ id: '1', groups: [{ id: 'group-1', name: 'Group 1' }] })
    );
    const payload = action.payload;
    expect(action.type).toBe('updateDelegation/fulfilled');
    expect(payload).toEqual({ id: '1', groups: [{ id: 'group-1', name: 'Group 1' }] });
    mock.reset();
    mock.restore();
  });

  it('should throw an error trying to update a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', UPDATE_DELEGATION('1'), 500);
    const action = await store.dispatch(updateDelegation({ id: '1', groups: [] }));
    const payload = action.payload as any;
    expect(action.type).toBe('updateDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    mock.reset();
    mock.restore();
  });

  it('Should be able to set filters', () => {
    const filters = {
      size: 20,
      page: 3,
      groups: ['group-1', 'group-3'],
      status: [DelegationStatus.ACTIVE],
      mandateIds: ['mandate-1'],
    };
    const action = store.dispatch(setFilters(filters));
    const payload = action.payload;
    expect(action.type).toBe('delegationsSlice/setFilters');
    expect(payload).toEqual(filters);
    const state = store.getState().delegationsState;
    expect(state.filters).toEqual(filters);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('delegationsSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });
});
