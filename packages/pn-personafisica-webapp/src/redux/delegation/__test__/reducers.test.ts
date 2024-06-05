import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { mandatesByDelegate, mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { createMockedStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { store } from '../../store';
import {
  acceptMandate,
  getMandatesByDelegate,
  getMandatesByDelegator,
  rejectMandate,
  revokeMandate,
} from '../actions';
import {
  closeAcceptModal,
  closeRevocationModal,
  openAcceptModal,
  openRevocationModal,
  setDelegatesSorting,
  setDelegatorsSorting,
} from '../reducers';

const pendingDelegator = mandatesByDelegate.find((d) => d.status === 'pending');
const pendingDelegates = mandatesByDelegator.find((d) => d.status === 'pending');
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

  it('should be able to fetch the mandates by delegator', async () => {
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    const action = await store.dispatch(getMandatesByDelegator());
    expect(action.type).toBe('getMandatesByDelegator/fulfilled');
    expect(action.payload).toEqual(mandatesByDelegator);
  });

  it('should be able to fetch the mandates by delegate', async () => {
    mock.onGet('/bff/v1/mandate/delegate').reply(200, mandatesByDelegate);
    const action = await store.dispatch(getMandatesByDelegate());
    expect(action.type).toBe('getMandatesByDelegate/fulfilled');
    expect(action.payload).toEqual(mandatesByDelegate);
  });

  it('should accept a delegation request', async () => {
    // init store
    const testStore = createMockedStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: mandatesByDelegate,
        },
        acceptModalState: {
          open: true,
          id: 'test',
          name: 'test',
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegator!.mandateId}/accept`).reply(204);
    const action = await testStore.dispatch(
      acceptMandate({ id: pendingDelegator!.mandateId, code: '12345' })
    );
    expect(action.type).toBe('acceptMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().delegationsState;
    expect(state.acceptModalState.open).toBeFalsy();
    expect(state.delegations.delegators[0].status).toBe('active');
  });

  it('error on delegation acceptance', async () => {
    // init store
    const testStore = createMockedStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: mandatesByDelegate,
        },
        acceptModalState: {
          open: true,
          id: 'test',
          name: 'test',
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/1/accept`).reply(500, 'error');
    const action = await testStore.dispatch(acceptMandate({ id: '1', code: '12345' }));
    expect(action.type).toBe('acceptMandate/rejected');
    expect(action.payload).toStrictEqual({ response: { status: 500, data: 'error' } });
    const state = testStore.getState().delegationsState;
    expect(state.acceptModalState.open).toBeTruthy();
    expect(state.delegations.delegators[0].status).toBe('pending');
  });

  it('should reject a delegation from a delegator', async () => {
    // init store
    const testStore = createMockedStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: mandatesByDelegate,
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegator!.mandateId}/reject`).reply(204);
    const action = await testStore.dispatch(rejectMandate(pendingDelegator!.mandateId));
    expect(action.type).toBe('rejectMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().delegationsState;
    expect(state.modalState.open).toBeFalsy();
    expect(
      state.delegations.delegators.find((d) => d.mandateId === pendingDelegator!.mandateId)
    ).toBeUndefined();
  });

  it('should throw an error trying to reject a delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/2/reject`).reply(500, 'error');
    const action = await store.dispatch(rejectMandate('2'));
    expect(action.type).toBe('rejectMandate/rejected');
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
          delegates: mandatesByDelegator,
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegates!.mandateId}/revoke`).reply(204);
    const action = await testStore.dispatch(revokeMandate(pendingDelegates!.mandateId));
    expect(action.type).toBe('revokeMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().delegationsState;
    expect(state.modalState.open).toBeFalsy();
    expect(
      state.delegations.delegates.find((d) => d.mandateId === pendingDelegates!.mandateId)
    ).toBeUndefined();
  });

  it('should throw an error trying to revoke a delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/2/revoke`).reply(500, 'error');
    const action = await store.dispatch(revokeMandate('2'));
    expect(action.type).toBe('revokeMandate/rejected');
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
    expect(confirmModalState).toEqual({ id: '123', open: true, name: 'test name' });
    const closeAction = store.dispatch(closeAcceptModal());
    expect(closeAction.type).toBe('delegationsSlice/closeAcceptModal');
    const closeModalState = store.getState().delegationsState.acceptModalState;
    expect(closeModalState).toEqual({ id: '', open: false, name: 'test name' });
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
