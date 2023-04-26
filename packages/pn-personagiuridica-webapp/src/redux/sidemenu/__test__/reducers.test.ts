/* eslint-disable functional/no-let */
import { DelegationsApi } from '../../../api/delegations/Delegations.api';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { acceptDelegation, rejectDelegation } from '../../delegation/actions';
import { store } from '../../store';
import { getSidemenuInformation } from '../actions';
import { closeDomicileBanner } from '../reducers';
import { initialState } from './test-utils';

describe('Sidemenu redux state tests', () => {
  mockAuthentication();

  const setInitialState = async (delegatorsCount: number) => {
    // Get sidemenu information
    const getDelegatorsApiSpy = jest.spyOn(DelegationsApi, 'countDelegators');
    getDelegatorsApiSpy.mockResolvedValue({ value: delegatorsCount });
    await store.dispatch(getSidemenuInformation());
  };

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
    // test getSidemenuInformation() with 0 "pending" delegators
    await setInitialState(0);

    let state = store.getState().generalInfoState;
    expect(state.pendingDelegators).toBe(0);

    // test getSidemenuInformation() with 2 "pending" delegators
    await setInitialState(2);

    state = store.getState().generalInfoState;
    expect(state.pendingDelegators).toBe(2);

    // test getSidemenuInformation() with 1 "pending" delegator
    await setInitialState(1);

    state = store.getState().generalInfoState;
    expect(state.pendingDelegators).toBe(1);
  });

  it('Should update state after accepting a delegation', async () => {
    // accept delegation (both in pending state)
    await setInitialState(2);
    const acceptDelegationApiSpy = jest.spyOn(DelegationsApi, 'acceptDelegation');
    acceptDelegationApiSpy.mockResolvedValue({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8' });
    let action = await store.dispatch(
      acceptDelegation({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345' })
    );

    let state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);

    // accept delegation (one active and one pending)
    action = await store.dispatch(
      acceptDelegation({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345' })
    );

    state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting a pending delegation', async () => {
    // reject delegation (both in pending state)
    await setInitialState(2);
    const rejectDelegationApiSpy = jest.spyOn(DelegationsApi, 'rejectDelegation');
    rejectDelegationApiSpy.mockResolvedValue({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8' });
    const action = await store.dispatch(rejectDelegation('1dc53e54-1368-4c2d-8583-2f1d672350d8'));

    const state = store.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
  });
});
