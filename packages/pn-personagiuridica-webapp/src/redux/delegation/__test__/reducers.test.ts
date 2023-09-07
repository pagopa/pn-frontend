import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  arrayOfDelegates,
  arrayOfDelegators,
  initialState,
} from '../../../__mocks__/Delegations.mock';
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
import { DelegationStatus } from '../../../models/Deleghe';
import { GroupStatus } from '../../../models/groups';
import { store } from '../../store';
import {
  acceptDelegation,
  getDelegatesByCompany,
  getDelegators,
  getGroups,
  rejectDelegation,
  revokeDelegation,
  updateDelegation,
} from '../actions';
import { resetState, setFilters } from '../reducers';

describe('delegation redux state tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  mockAuthentication();

  it('checks the initial state', () => {
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });

  it('should be able to fetch the delegates', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    const action = await store.dispatch(getDelegatesByCompany());
    expect(action.type).toBe('getDelegatesByCompany/fulfilled');
    expect(action.payload).toEqual(arrayOfDelegates);
  });

  it('should be able to fetch the delegates', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    const action = await store.dispatch(getDelegatesByCompany());
    expect(action.type).toBe('getDelegatesByCompany/fulfilled');
    expect(action.payload).toEqual(arrayOfDelegates);
  });

  it('should be able to fetch the delegators', async () => {
    mock.onPost(DELEGATIONS_BY_DELEGATE({ size: 10 })).reply(200, {
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
    const action = await store.dispatch(getDelegators({ size: 10 }));
    expect(action.type).toBe('getDelegators/fulfilled');
    expect(action.payload).toEqual({
      resultsPage: arrayOfDelegators,
      nextPagesKey: [],
      moreResult: false,
    });
  });

  it('should accept a delegation request', async () => {
    mock.onPatch(ACCEPT_DELEGATION('1')).reply(204);
    const action = await store.dispatch(
      acceptDelegation({ id: '1', code: '12345', groups: [{ id: 'group-1', name: 'Group 1' }] })
    );
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(action.payload).toEqual({ id: '1', groups: [{ id: 'group-1', name: 'Group 1' }] });
  });

  it('should throw an error trying to accept a delegation', async () => {
    mock.onPatch(ACCEPT_DELEGATION('1')).reply(500, 'error');
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345', groups: [] }));
    expect(action.type).toBe('acceptDelegation/rejected');
    expect(action.payload).toStrictEqual({ response: { status: 500, data: 'error' } });
  });

  it('should reject a delegation from a delegator', async () => {
    mock.onPatch(REJECT_DELEGATION('2')).reply(204);
    const action = await store.dispatch(rejectDelegation('2'));
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(action.payload).toEqual({ id: '2' });
  });

  it('should throw an error trying to reject a delegation', async () => {
    mock.onPatch(REJECT_DELEGATION('2')).reply(500, 'error');
    const action = await store.dispatch(rejectDelegation('2'));
    expect(action.type).toBe('rejectDelegation/rejected');
    expect(action.payload).toEqual({ response: { status: 500, data: 'error' } });
  });

  it('should revoke a delegation for a delegate', async () => {
    mock.onPatch(REVOKE_DELEGATION('2')).reply(204);
    const action = await store.dispatch(revokeDelegation('2'));
    expect(action.type).toBe('revokeDelegation/fulfilled');
    expect(action.payload).toEqual({ id: '2' });
  });

  it('should throw an error trying to revoke a delegation', async () => {
    mock.onPatch(REVOKE_DELEGATION('2')).reply(500, 'error');
    const action = await store.dispatch(revokeDelegation('2'));
    expect(action.type).toBe('revokeDelegation/rejected');
    expect(action.payload).toEqual({ response: { status: 500, data: 'error' } });
  });

  it('should get groups for the current PG', async () => {
    mock.onGet(GET_GROUPS()).reply(200, [
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ]);
    const action = await store.dispatch(getGroups());
    expect(action.type).toBe('getGroups/fulfilled');
    expect(action.payload).toEqual([
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ]);
  });

  it('should update a delegation request', async () => {
    mock.onPatch(UPDATE_DELEGATION('1')).reply(204);
    const action = await store.dispatch(
      updateDelegation({ id: '1', groups: [{ id: 'group-1', name: 'Group 1' }] })
    );
    expect(action.type).toBe('updateDelegation/fulfilled');
    expect(action.payload).toEqual({ id: '1', groups: [{ id: 'group-1', name: 'Group 1' }] });
  });

  it('should throw an error trying to update a delegation', async () => {
    mock.onPatch(UPDATE_DELEGATION('1')).reply(500, 'error');
    const action = await store.dispatch(updateDelegation({ id: '1', groups: [] }));
    expect(action.type).toBe('updateDelegation/rejected');
    expect(action.payload).toEqual({ response: { status: 500, data: 'error' } });
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
    expect(action.type).toBe('delegationsSlice/setFilters');
    expect(action.payload).toEqual(filters);
    const state = store.getState().delegationsState;
    expect(state.filters).toEqual(filters);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('delegationsSlice/resetState');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });
});
