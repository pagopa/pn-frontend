import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { arrayOfDelegators } from '../../../__mocks__/Delegations.mock';
import { createMockedStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  DELEGATIONS_BY_DELEGATE,
  REJECT_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { acceptDelegation, rejectDelegation } from '../../delegation/actions';
import { store } from '../../store';
import { getSidemenuInformation } from '../actions';
import { closeDomicileBanner } from '../reducers';

const initialState = {
  pendingDelegators: 0,
  delegators: [],
  defaultAddresses: [],
  domicileBannerOpened: true,
};

const pendingDelegators = arrayOfDelegators.filter((d) => d.status === 'pending');
const activeDelegators = arrayOfDelegators.filter((d) => d.status === 'active');

describe('Sidemenu redux state tests', () => {
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

  it('Initial state', () => {
    const state = store.getState().generalInfoState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to close domicile banner', () => {
    const action = store.dispatch(closeDomicileBanner());
    expect(action.type).toBe('generalInfoSlice/closeDomicileBanner');
    const state = store.getState().generalInfoState;
    expect(state).toEqual({ ...initialState, domicileBannerOpened: false });
  });

  it('Should load state properly', async () => {
    mock.onGet(DELEGATIONS_BY_DELEGATE()).reply(200, arrayOfDelegators);
    const action = await store.dispatch(getSidemenuInformation());
    expect(action.type).toBe('getSidemenuInformation/fulfilled');
    expect(action.payload).toEqual(arrayOfDelegators);
    const state = store.getState().generalInfoState;
    expect(state.delegators).toHaveLength(activeDelegators.length);
    expect(state.pendingDelegators).toBe(pendingDelegators.length);
  });

  it('Should update state after accepting a delegation', async () => {
    // init store
    const testStore = createMockedStore({
      generalInfoState: {
        ...initialState,
        delegators: activeDelegators,
        pendingDelegators: pendingDelegators.length,
      },
    });
    mock
      .onPatch(ACCEPT_DELEGATION(pendingDelegators[0].mandateId))
      .reply(204, { id: pendingDelegators[0].mandateId });
    const action = await testStore.dispatch(
      acceptDelegation({ id: pendingDelegators[0].mandateId, code: '12345' })
    );
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(action.payload).toEqual({ id: pendingDelegators[0].mandateId });
    const state = testStore.getState().generalInfoState;
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting a pending delegation', async () => {
    // init store
    const testStore = createMockedStore({
      generalInfoState: {
        ...initialState,
        delegators: activeDelegators,
        pendingDelegators: pendingDelegators.length,
      },
    });
    mock
      .onPatch(REJECT_DELEGATION(pendingDelegators[0].mandateId))
      .reply(204, { id: pendingDelegators[0].mandateId });
    const action = await testStore.dispatch(rejectDelegation(pendingDelegators[0].mandateId));
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(action.payload).toEqual({ id: pendingDelegators[0].mandateId });
    const state = testStore.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.delegators.length).toBe(activeDelegators.length);
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting an active delegation', async () => {
    // init store
    const testStore = createMockedStore({
      generalInfoState: {
        ...initialState,
        delegators: activeDelegators,
        pendingDelegators: pendingDelegators.length,
      },
    });
    mock
      .onPatch(REJECT_DELEGATION(activeDelegators[0].mandateId))
      .reply(204, { id: activeDelegators[0].mandateId });
    const action = await testStore.dispatch(rejectDelegation(activeDelegators[0].mandateId));
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(action.payload).toEqual({ id: activeDelegators[0].mandateId });
    const state = testStore.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.delegators.length).toBe(activeDelegators.length - 1);
    expect(state.pendingDelegators).toBe(pendingDelegators.length);
  });
});
