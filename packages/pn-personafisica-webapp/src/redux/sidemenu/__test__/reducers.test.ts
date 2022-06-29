/* eslint-disable functional/no-let */
import { DelegationsApi } from "../../../api/delegations/Delegations.api";
import { mockAuthentication } from "../../auth/__test__/reducers.test";
import { acceptDelegation } from "../../delegation/actions";
import { Delegator } from "../../delegation/types";
import { store } from "../../store";
import { closeDomicileBanner, getSidemenuInformation } from "../actions";
import { getMockedDelegators, initialState } from "./test-utils";

// const initialState = {
//   pendingDelegators: 0,
//   delegators: [],
//   legalDomicile: [],
//   domicileBannerOpened: true
// };

// const getDelegatorsResponse: Array<Delegator> = [
//   {
//     mandateId: "1dc53e54-1368-4c2d-8583-2f1d672350d8",
//     status: "pending",
//     visibilityIds: [],
//     verificationCode: "",
//     datefrom: "2022-03-01",
//     dateto: "2022-06-30",
//     delegator: {
//       displayName: "Alessandro Manzoni",
//       firstName: "",
//       lastName: "",
//       companyName: null,
//       fiscalCode: "",
//       person: true
//     }
//   }, {
//     mandateId: "8ff0b635-b770-49ae-925f-3888495f3d13",
//     status: "pending",
//     visibilityIds: [],
//     verificationCode: "",
//     datefrom: "2022-03-01",
//     dateto: "2022-06-30",
//     delegator: {
//       displayName: "Lucia Mondella",
//       firstName: "",
//       lastName: "",
//       companyName: null,
//       fiscalCode: "",
//       person: true
//     }
//   }
// ];

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
    expect(action.type).toBe('closeDomicileBanner');
    const state = store.getState().generalInfoState;
    expect(state).toEqual({...initialState, domicileBannerOpened: false});
  });

  it('Should load data properly', async () => {
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

  it.only('works after accepting a delegation', async () => {
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

  it('works after rejecting a pending delegation', () => {

  });
});