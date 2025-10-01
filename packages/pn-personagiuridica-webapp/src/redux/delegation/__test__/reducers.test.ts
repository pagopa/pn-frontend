import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { mandatesByDelegate, mandatesByDelegator } from '../../../__mocks__/Delegations.mock';
import { errorMock } from '../../../__mocks__/Errors.mock';
import { createTestStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { DelegationStatus } from '../../../models/Deleghe';
import { GroupStatus } from '../../../models/groups';
import { store } from '../../store';
import {
  acceptMandate,
  getGroups,
  getMandatesByDelegator,
  rejectMandate,
  revokeMandate,
  searchMandatesByDelegate,
  updateMandate,
} from '../actions';
import { resetState, setFilters } from '../reducers';

const pendingDelegator = mandatesByDelegate.find((d) => d.status === 'pending');
const activeDelegator = mandatesByDelegate.find((d) => d.status === 'active');
const pendingDelegates = mandatesByDelegator.find((d) => d.status === 'pending');
const initialState = {
  delegations: {
    delegators: [],
    delegates: [],
  },
  pagination: {
    nextPagesKey: [],
    moreResult: false,
  },
  groups: [],
  filters: {
    size: 10,
    page: 0,
  },
};

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
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    const action = await store.dispatch(getMandatesByDelegator());
    expect(action.type).toBe('getMandatesByDelegator/fulfilled');
    expect(action.payload).toEqual(mandatesByDelegator);
  });

  it('should be able to fetch the delegates', async () => {
    mock.onGet('/bff/v1/mandate/delegator').reply(200, mandatesByDelegator);
    const action = await store.dispatch(getMandatesByDelegator());
    expect(action.type).toBe('getMandatesByDelegator/fulfilled');
    expect(action.payload).toEqual(mandatesByDelegator);
  });

  it('should be able to fetch the delegators', async () => {
    mock.onPost(`/bff/v1/mandate/delegate?size=10`).reply(200, {
      resultsPage: mandatesByDelegate,
      nextPagesKey: [],
      moreResult: false,
    });
    const action = await store.dispatch(searchMandatesByDelegate({ size: 10 }));
    expect(action.type).toBe('searchMandatesByDelegate/fulfilled');
    expect(action.payload).toEqual({
      resultsPage: mandatesByDelegate,
      nextPagesKey: [],
      moreResult: false,
    });
  });

  it('should accept a delegation request', async () => {
    // init store
    const testStore = createTestStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: mandatesByDelegate,
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegator!.mandateId}/accept`).reply(204);
    const action = await testStore.dispatch(
      acceptMandate({
        id: pendingDelegator!.mandateId,
        code: '12345',
        groups: [{ id: 'group-1', name: 'Group 1' }],
      })
    );
    expect(action.type).toBe('acceptMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().delegationsState;
    expect(state.delegations.delegators[0].status).toBe('active');
    expect(state.delegations.delegators[0].groups).toStrictEqual([
      { id: 'group-1', name: 'Group 1' },
    ]);
  });

  it('should throw an error trying to accept a delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/1/accept`).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(acceptMandate({ id: '1', code: '12345', groups: [] }));
    expect(action.type).toBe('acceptMandate/rejected');
    expect(action.payload).toStrictEqual({ response: errorMock });
  });

  it('should reject a delegation from a delegator', async () => {
    // init store
    const testStore = createTestStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: mandatesByDelegate,
          delegates: [],
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/${pendingDelegator!.mandateId}/reject`).reply(204);
    const action = await testStore.dispatch(rejectMandate(pendingDelegator!.mandateId));
    expect(action.type).toBe('rejectMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().delegationsState;
    expect(
      state.delegations.delegators.find((d) => d.mandateId === pendingDelegator!.mandateId)
    ).toBeUndefined();
  });

  it('should throw an error trying to reject a delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/2/reject`).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(rejectMandate('2'));
    expect(action.type).toBe('rejectMandate/rejected');
    expect(action.payload).toEqual({ response: errorMock });
  });

  it('should revoke a delegation for a delegate', async () => {
    // init store
    const testStore = createTestStore({
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
    expect(
      state.delegations.delegates.find((d) => d.mandateId === pendingDelegates!.mandateId)
    ).toBeUndefined();
  });

  it('should throw an error trying to revoke a delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/2/revoke`).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(revokeMandate('2'));
    expect(action.type).toBe('revokeMandate/rejected');
    expect(action.payload).toEqual({ response: errorMock });
  });

  it('should get groups for the current PG', async () => {
    const response = [
      {
        id: 'group-1',
        name: 'Group 1',
        description: 'This is a mocked group',
        status: GroupStatus.ACTIVE,
      },
    ];
    mock.onGet('/bff/v1/pg/groups').reply(200, response);
    const action = await store.dispatch(getGroups());
    expect(action.type).toBe('getGroups/fulfilled');
    expect(action.payload).toEqual(response);
  });

  it('should update a delegation request', async () => {
    // init store
    const testStore = createTestStore({
      delegationsState: {
        ...initialState,
        delegations: {
          delegators: mandatesByDelegate,
        },
      },
    });
    mock.onPatch(`/bff/v1/mandate/${activeDelegator!.mandateId}/update`).reply(204);
    const action = await testStore.dispatch(
      updateMandate({
        id: activeDelegator!.mandateId,
        groups: [{ id: 'group-1', name: 'Group 1' }],
      })
    );
    expect(action.type).toBe('updateMandate/fulfilled');
    expect(action.payload).toEqual(void 0);
    const state = testStore.getState().delegationsState;
    const delegator = state.delegations.delegators.find(
      (d) => d.mandateId === activeDelegator!.mandateId
    );
    expect(delegator?.groups).toStrictEqual([{ id: 'group-1', name: 'Group 1' }]);
  });

  it('should throw an error trying to update a delegation', async () => {
    mock.onPatch(`/bff/v1/mandate/1/update`).reply(errorMock.status, errorMock.data);
    const action = await store.dispatch(updateMandate({ id: '1', groups: [] }));
    expect(action.type).toBe('updateMandate/rejected');
    expect(action.payload).toEqual({ response: errorMock });
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
