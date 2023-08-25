import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { arrayOfDelegates, arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { createMockedStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  DELEGATIONS_BY_DELEGATOR,
  REJECT_DELEGATION,
  REVOKE_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { store } from '../../store';
import {
  acceptDelegation,
  getDelegates,
  getDelegators,
  rejectDelegation,
  revokeDelegation,
} from '../actions';
import {
  closeAcceptModal,
  closeRevocationModal,
  openAcceptModal,
  openRevocationModal,
  setDelegatesSorting,
  setDelegatorsSorting,
} from '../reducers';

const pendingDelegator = arrayOfDelegators.find((d) => d.status === 'pending');
const pendingDelegates = arrayOfDelegates.find((d) => d.status === 'pending');
const initialState = {
  delegations: {
    delegators: [],
    delegates: [],
    isCompany: false,
  },
  modalState: {
    open: false,
    id: '',
    type: '',
  },
  acceptModalState: {
    open: false,
    id: '',
    name: '',
    error: false,
  },
  sortDelegators: {
    orderBy: '',
    order: 'asc',
  },
  sortDelegates: {
    orderBy: '',
    order: 'asc' as 'asc' | 'desc',
  },
};

describe('delegation redux state tests', () => {
  let mock: MockAdapter;
  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('checks the initial state', () => {
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });

  it('should be able to fetch the delegates', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATOR()).reply(200, arrayOfDelegates);
    const action = await store.dispatch(getDelegates());
    expect(action.type).toBe('getDelegates/fulfilled');
    expect(action.payload).toEqual(arrayOfDelegates);
  });

  it('should be able to fetch the delegators', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    const action = await store.dispatch(getDelegators());
    expect(action.type).toBe('getDelegators/fulfilled');
    expect(action.payload).toEqual(arrayOfDelegators);
  });

  it('should accept a delegation request', async () => {
    // init store
    const testStore = createMockedStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: arrayOfDelegators,
        },
      },
    });
    mock
      .onPatch(ACCEPT_DELEGATION(pendingDelegator!.mandateId))
      .reply(204, { id: pendingDelegator!.mandateId });
    const action = await testStore.dispatch(
      acceptDelegation({ id: pendingDelegator!.mandateId, code: '12345' })
    );
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(action.payload).toEqual({ id: pendingDelegator!.mandateId });
    const state = testStore.getState().delegationsState;
    expect(state.acceptModalState.open).toBeFalsy();
    expect(state.acceptModalState.error).toBeFalsy();
    expect(state.delegations.delegators[0].status).toBe('active');
  });

  it('should set the accept modal state to error', async () => {
    mock.onPatch(ACCEPT_DELEGATION('1')).reply(500, 'error');
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345' }));
    expect(action.type).toBe('acceptDelegation/rejected');
    expect(action.payload).toStrictEqual({ response: { status: 500, data: 'error' } });
    const state = store.getState().delegationsState;
    expect(state.acceptModalState.error).toBeTruthy();
  });

  it('should reject a delegation from a delegator', async () => {
    // init store
    const testStore = createMockedStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: arrayOfDelegators,
        },
      },
    });
    mock
      .onPatch(REJECT_DELEGATION(pendingDelegator!.mandateId))
      .reply(204, { id: pendingDelegator!.mandateId });
    const action = await testStore.dispatch(rejectDelegation(pendingDelegator!.mandateId));
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(action.payload).toEqual({ id: pendingDelegator!.mandateId });
    const state = testStore.getState().delegationsState;
    expect(state.modalState.open).toBeFalsy();
    expect(
      state.delegations.delegators.find((d) => d.mandateId === pendingDelegator!.mandateId)
    ).toBeUndefined();
  });

  it('should throw an error trying to reject a delegation', async () => {
    mock.onPatch(REJECT_DELEGATION('2')).reply(500, 'error');
    const action = await store.dispatch(rejectDelegation('2'));
    expect(action.type).toBe('rejectDelegation/rejected');
    expect(action.payload).toStrictEqual({ response: { status: 500, data: 'error' } });
    const state = store.getState().delegationsState;
    expect(state.modalState.open).toBeFalsy();
  });

  it('should revoke a delegation for a delegate', async () => {
    // init store
    const testStore = createMockedStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegates: arrayOfDelegates,
        },
      },
    });
    mock
      .onPatch(REVOKE_DELEGATION(pendingDelegates!.mandateId))
      .reply(204, { id: pendingDelegates!.mandateId });
    const action = await testStore.dispatch(revokeDelegation(pendingDelegates!.mandateId));
    expect(action.type).toBe('revokeDelegation/fulfilled');
    expect(action.payload).toEqual({ id: pendingDelegates!.mandateId });
    const state = testStore.getState().delegationsState;
    expect(state.modalState.open).toBeFalsy();
    expect(
      state.delegations.delegates.find((d) => d.mandateId === pendingDelegates!.mandateId)
    ).toBeUndefined();
  });

  it('should throw an error trying to revoke a delegation', async () => {
    mock.onPatch(REVOKE_DELEGATION('2')).reply(500, 'error');
    const action = await store.dispatch(revokeDelegation('2'));
    expect(action.type).toBe('revokeDelegation/rejected');
    expect(action.payload).toStrictEqual({ response: { status: 500, data: 'error' } });
    const state = store.getState().delegationsState;
    expect(state.modalState.open).toBeFalsy();
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

  it('sets the delegates sorting by test in ascendant order', () => {
    const action = store.dispatch(setDelegatesSorting({ orderBy: 'startDate', order: 'asc' }));
    expect(action.type).toBe('delegationsSlice/setDelegatesSorting');
    const sortDelegates = store.getState().delegationsState.sortDelegates;
    expect(sortDelegates).toEqual({ orderBy: 'startDate', order: 'asc' });
  });

  it('sets the delegates sorting by test in descendant order', () => {
    const action = store.dispatch(setDelegatorsSorting({ orderBy: 'endDate', order: 'desc' }));
    expect(action.type).toBe('delegationsSlice/setDelegatorsSorting');
    const sortDelegators = store.getState().delegationsState.sortDelegators;
    expect(sortDelegators).toEqual({ orderBy: 'endDate', order: 'desc' });
  });
});
