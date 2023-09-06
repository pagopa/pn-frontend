import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  REJECT_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { DelegationStatus } from '../../../models/Deleghe';
import { acceptDelegation, rejectDelegation } from '../../delegation/actions';
import { store } from '../../store';
import { getSidemenuInformation } from '../actions';
import { closeDomicileBanner } from '../reducers';

const initialState = {
  pendingDelegators: 0,
  defaultAddresses: [],
  domicileBannerOpened: true,
};

describe('Sidemenu redux state tests', () => {
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

  it('Should load delegators count', async () => {
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 2 });
    const action = await store.dispatch(getSidemenuInformation());
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('getSidemenuInformation/fulfilled');
    expect(state.pendingDelegators).toBe(2);
  });

  it('Should update state after accepting a delegation', async () => {
    mock.onPatch(ACCEPT_DELEGATION('1dc53e54-1368-4c2d-8583-2f1d672350d8')).reply(204);
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 2 });
    await store.dispatch(getSidemenuInformation());
    const action = await store.dispatch(
      acceptDelegation({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345', groups: [] })
    );
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
  });

  it('Should update state after rejecting a pending delegation', async () => {
    mock.onPatch(REJECT_DELEGATION('1dc53e54-1368-4c2d-8583-2f1d672350d8')).reply(204);
    mock.onGet(COUNT_DELEGATORS(DelegationStatus.PENDING)).reply(200, { value: 2 });
    await store.dispatch(getSidemenuInformation());
    const action = await store.dispatch(rejectDelegation('1dc53e54-1368-4c2d-8583-2f1d672350d8'));
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
  });
});
