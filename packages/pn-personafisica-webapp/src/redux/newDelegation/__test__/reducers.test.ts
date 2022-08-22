import { store } from '../../store';
import { DelegationsApi } from '../../../api/delegations/Delegations.api';
import { createDelegation } from '../actions';
import { resetNewDelegation } from '../reducers';
import {
  createDelegationDuplicatedErrorResponse,
  createDelegationGenericErrorResponse,
  createDelegationPayload,
  createDelegationResponse,
  createDelegationSelectedPayload,
  initialState,
} from './test.utils';

describe('delegation redux state tests', () => {
  it('checks the initial state', () => {
    const state = store.getState().newDelegationState;
    expect(state).toEqual(initialState);
  });

  it('creates a new delegation with all organizations', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'createDelegation');
    apiSpy.mockResolvedValue(createDelegationResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));

    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it('creates a new delegation with a single organization', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'createDelegation');
    apiSpy.mockResolvedValue(createDelegationResponse);
    const action = await store.dispatch(createDelegation(createDelegationSelectedPayload));

    expect(action.type).toBe('createDelegation/fulfilled');
    expect(action.payload).toEqual(createDelegationResponse);
  });

  it("can't create a new delegation", async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'createDelegation');
    apiSpy.mockRejectedValue(createDelegationGenericErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));

    expect(action.type).toBe('createDelegation/rejected');
    expect(action.payload).toEqual(createDelegationGenericErrorResponse);
  });

  it("can't create a new delegation (duplicated)", async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'createDelegation');
    apiSpy.mockRejectedValue(createDelegationDuplicatedErrorResponse);
    const action = await store.dispatch(createDelegation(createDelegationPayload));
    expect(action.type).toBe('createDelegation/rejected');
    expect(action.payload).toEqual(createDelegationDuplicatedErrorResponse);
  });

  it('resets the newDelegation state', () => {
    const action = store.dispatch(resetNewDelegation());
    const state = store.getState().newDelegationState;

    expect(action.type).toBe('newDelegationSlice/resetNewDelegation');
    expect(state).toEqual(initialState);
  });
});
