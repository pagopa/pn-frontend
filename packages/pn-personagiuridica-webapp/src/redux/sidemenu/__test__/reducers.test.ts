import { mockApi } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import {
  ACCEPT_DELEGATION,
  COUNT_DELEGATORS,
  REJECT_DELEGATION,
} from '../../../api/delegations/delegations.routes';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { acceptDelegation, rejectDelegation } from '../../delegation/actions';
import { store } from '../../store';
import { getSidemenuInformation } from '../actions';
import { closeDomicileBanner } from '../reducers';
import { initialState } from './test-utils';
import { DelegationStatus } from '../../../models/Deleghe';

describe('Sidemenu redux state tests', () => {
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
    const mock = mockApi(
      apiClient,
      'GET',
      COUNT_DELEGATORS(DelegationStatus.PENDING),
      200,
      undefined,
      { value: 2 }
    );
    const action = await store.dispatch(getSidemenuInformation());
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('getSidemenuInformation/fulfilled');
    expect(state.pendingDelegators).toBe(2);
    mock.reset();
    mock.restore();
  });

  it('Should update state after accepting a delegation', async () => {
    const mock = mockApi(
      apiClient,
      'PATCH',
      ACCEPT_DELEGATION('1dc53e54-1368-4c2d-8583-2f1d672350d8'),
      204
    );
    // accept delegation (both in pending state)
    mockApi(mock, 'GET', COUNT_DELEGATORS(DelegationStatus.PENDING), 200, undefined, {
      value: 2,
    });
    await store.dispatch(getSidemenuInformation());
    const action = await store.dispatch(
      acceptDelegation({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345', groups: [] })
    );
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
    mock.reset();
    mock.restore();
  });

  it('Should update state after rejecting a pending delegation', async () => {
    const mock = mockApi(
      apiClient,
      'PATCH',
      REJECT_DELEGATION('1dc53e54-1368-4c2d-8583-2f1d672350d8'),
      204
    );
    // reject delegation (both in pending state)
    mockApi(mock, 'GET', COUNT_DELEGATORS(DelegationStatus.PENDING), 200, undefined, {
      value: 2,
    });
    await store.dispatch(getSidemenuInformation());
    const action = await store.dispatch(rejectDelegation('1dc53e54-1368-4c2d-8583-2f1d672350d8'));
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
    mock.reset();
    mock.restore();
  });
});
