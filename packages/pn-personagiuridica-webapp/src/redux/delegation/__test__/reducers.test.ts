import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  DELEGATIONS_NAME_BY_DELEGATE,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { GET_GROUPS } from '../../../api/external-registries/external-registries-routes';
import { Delegation, GetDelegatorsResponse } from '../../../models/Deleghe';
import { GroupStatus } from '../../../models/groups';
import { store } from '../../store';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import {
  acceptDelegation,
  getDelegatesByCompany,
  getDelegators,
  getDelegatorsNames,
  getGroups,
  rejectDelegation,
  revokeDelegation,
} from '../actions';
import {
  closeAcceptModal,
  closeRevocationModal,
  openAcceptModal,
  openRevocationModal,
} from '../reducers';
import { arrayOfDelegates, arrayOfDelegators, initialState } from './test.utils';

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
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('1'), 200, undefined, undefined);
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345' }));
    const payload = action.payload;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(payload).toEqual({ id: '1' });
    mock.reset();
    mock.restore();
  });

  it('should set the accept modal state to error', async () => {
    const mock = mockApi(apiClient, 'PATCH', ACCEPT_DELEGATION('1'), 500, undefined, undefined);
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345' }));
    const payload = action.payload as any;
    expect(action.type).toBe('acceptDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    const acceptModalState = store.getState().delegationsState.acceptModalState;
    expect(acceptModalState.error).toEqual(true);
    mock.reset();
    mock.restore();
  });

  it('should reject a delegation from a delegator', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('2'), 200, undefined, undefined);
    const action = await store.dispatch(rejectDelegation('2'));
    const payload = action.payload;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(payload).toEqual({ id: '2' });
    mock.reset();
    mock.restore();
  });

  it('should throw an error trying to reject a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REJECT_DELEGATION('2'), 500, undefined, undefined);
    const action = await store.dispatch(rejectDelegation('2'));
    const payload = action.payload as any;
    expect(action.type).toBe('rejectDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    mock.reset();
    mock.restore();
  });

  it('should revoke a delegation for a delegate', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('2'), 200, undefined, undefined);
    const action = await store.dispatch(revokeDelegation('2'));
    const payload = action.payload;
    expect(action.type).toBe('revokeDelegation/fulfilled');
    expect(payload).toEqual({ id: '2' });
    mock.reset();
    mock.restore();
  });

  it('should throw an error trying to revoke a delegation', async () => {
    const mock = mockApi(apiClient, 'PATCH', REVOKE_DELEGATION('2'), 500, undefined, undefined);
    const action = await store.dispatch(revokeDelegation('2'));
    const payload = action.payload as any;
    expect(action.type).toBe('revokeDelegation/rejected');
    expect(payload.response.status).toEqual(500);
    mock.reset();
    mock.restore();
  });

  it('sets the confirmation modal state to open and then to close', async () => {
    const openAction = store.dispatch(openRevocationModal({ id: '123', type: 'delegates' }));
    expect(openAction.type).toBe('delegationsSlice/openRevocationModal');
    const openModalState = store.getState().delegationsState.modalState;
    expect(openModalState).toEqual({ id: '123', type: 'delegates', open: true });
    const closeAction = store.dispatch(closeRevocationModal());
    expect(closeAction.type).toBe('delegationsSlice/closeRevocationModal');
    const closeModalState = store.getState().delegationsState.modalState;
    expect(closeModalState).toEqual({ id: '', type: 'delegates', open: false });
  });

  it('sets the accept modal state to open and then to close', async () => {
    const action = store.dispatch(openAcceptModal({ id: '123', name: 'test name' }));
    expect(action.type).toBe('delegationsSlice/openAcceptModal');
    const confirmModalState = store.getState().delegationsState.acceptModalState;
    expect(confirmModalState).toEqual({ id: '123', open: true, name: 'test name', error: false });
    const closeAction = store.dispatch(closeAcceptModal());
    expect(closeAction.type).toBe('delegationsSlice/closeAcceptModal');
    const closeModalState = store.getState().delegationsState.acceptModalState;
    expect(closeModalState).toEqual({ id: '', open: false, name: 'test name', error: false });
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

  it('should get delegators names', async () => {
    const mock = mockApi(
      apiClient,
      'GET',
      DELEGATIONS_NAME_BY_DELEGATE(),
      200,
      undefined,
      arrayOfDelegators
    );
    const action = await store.dispatch(getDelegatorsNames());
    const payload = action.payload as any;
    expect(action.type).toBe('getDelegatorsNames/fulfilled');
    expect(payload).toEqual(
      arrayOfDelegators.map((delegator) => ({
        id: delegator.mandateId,
        name: delegator.delegator.displayName,
      }))
    );
    mock.reset();
    mock.restore();
  });
});
