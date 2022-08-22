/* eslint-disable functional/no-let */
import { DelegationsApi } from "../../../api/delegations/Delegations.api";
import { mockAuthentication } from "../../auth/__test__/test-utils";
import { acceptDelegation, rejectDelegation } from "../../delegation/actions";
import { Delegator } from "../../delegation/types";
import { store } from "../../store";
import { getSidemenuInformation } from "../actions";
import { closeDomicileBanner } from "../reducers";
import { getMockedDelegators, initialState } from "./test-utils";

describe('Sidemenu redux state tests', () => {
  mockAuthentication();

  const setInitialState = async (delegators: Array<Delegator>) => {
    // Get sidemenu information
    const getDelegatorsApiSpy = jest.spyOn(DelegationsApi, 'getDelegators');
    getDelegatorsApiSpy.mockResolvedValue(delegators);
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
    expect(state).toEqual({...initialState, domicileBannerOpened: false});
  });

  it('Should load state properly', async () => {
    // test getSidemenuInformation() with 2 "active" delegators
    await setInitialState(getMockedDelegators("active"));
    
    let state = store.getState().generalInfoState;
    expect(state.delegators.length).toBe(2);
    expect(state.pendingDelegators).toBe(0);

    // test getSidemenuInformation() with 2 "pending" delegators
    await setInitialState(getMockedDelegators("pending"));

    state = store.getState().generalInfoState;
    expect(state.delegators.length).toBe(0);
    expect(state.pendingDelegators).toBe(2);

    // test getSidemenuInformation() with 1 "pending" delegator and 1 "active" delegator
    await setInitialState(getMockedDelegators("mixed"));

    state = store.getState().generalInfoState;
    expect(state.delegators.length).toBe(1);
    expect(state.pendingDelegators).toBe(1);
  });

  it('Should update state after accepting a delegation', async () => {
    // accept delegation (both in pending state)
    await setInitialState(getMockedDelegators("pending"));
    const acceptDelegationApiSpy = jest.spyOn(DelegationsApi, 'acceptDelegation');
    acceptDelegationApiSpy.mockResolvedValue({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8' });
    let action = await store.dispatch(acceptDelegation({id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345'}));
    
    let state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(1);
    
    // accept delegation (both in active state)
    await setInitialState(getMockedDelegators("active"));
    action = await store.dispatch(acceptDelegation({id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345'}));
    
    state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(0);
    
    // accept delegation (one active and one pending)
    await setInitialState(getMockedDelegators("mixed"));
    action = await store.dispatch(acceptDelegation({id: '1dc53e54-1368-4c2d-8583-2f1d672350d8', code: '12345'}));
    
    state = store.getState().generalInfoState;
    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting a pending delegation', async () => {
    // reject delegation (both in pending state)
    await setInitialState(getMockedDelegators("mixed"));
    const rejectDelegationApiSpy = jest.spyOn(DelegationsApi, 'rejectDelegation');
    rejectDelegationApiSpy.mockResolvedValue({ id: '1dc53e54-1368-4c2d-8583-2f1d672350d8' });
    const action = await store.dispatch(rejectDelegation('1dc53e54-1368-4c2d-8583-2f1d672350d8'));
    
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.delegators.length).toBe(1);
    expect(state.pendingDelegators).toBe(0);
  });

  it('Should update state after rejecting an active delegation', async () => {
    // reject delegation (both in pending state)
    await setInitialState(getMockedDelegators("mixed"));
    const rejectDelegationApiSpy = jest.spyOn(DelegationsApi, 'rejectDelegation');
    rejectDelegationApiSpy.mockResolvedValue({ id: '8ff0b635-b770-49ae-925f-3888495f3d13' });
    const action = await store.dispatch(rejectDelegation('8ff0b635-b770-49ae-925f-3888495f3d13'));
    
    const state = store.getState().generalInfoState;
    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(state.delegators.length).toBe(0);
    expect(state.pendingDelegators).toBe(1);
  });
});