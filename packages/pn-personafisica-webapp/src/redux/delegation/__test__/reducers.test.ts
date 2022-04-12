import { Delegation } from '../types';
import { store } from '../../store';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { DelegationsApi } from '../../../api/delegations/Delegations.api';
import {
  acceptDelegation,
  closeAcceptModal,
  closeRevocationModal,
  getDelegates,
  getDelegators,
  openAcceptModal,
  openRevocationModal,
  rejectDelegation,
  revokeDelegation,
  setDelegatesSorting,
  setDelegatorsSorting,
} from '../actions';
import { arrayOfDelegates, arrayOfDelegators, initialState } from './test.utils';

describe('delegation redux state tests', () => {
  mockAuthentication();

  it('checks the initial state', () => {
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });
  it('checks the initial state', () => {
    const state = store.getState().delegationsState;
    expect(state).toEqual(initialState);
  });

  it('should be able to fetch the delegates', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'getDelegates');
    apiSpy.mockResolvedValue(arrayOfDelegates);
    const action = await store.dispatch(getDelegates());
    const payload = action.payload as Array<Delegation>;
    expect(action.type).toBe('getDelegates/fulfilled');
    expect(payload).toEqual(arrayOfDelegates);
  });

  it('should be able to fetch the delegators', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'getDelegators');
    apiSpy.mockResolvedValue(arrayOfDelegators);
    const action = await store.dispatch(getDelegators());
    const payload = action.payload as Array<Delegation>;

    expect(action.type).toBe('getDelegators/fulfilled');
    expect(payload).toEqual(arrayOfDelegators);
  });

  it('should not be able to fetch the delegates', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'getDelegates');
    apiSpy.mockRejectedValue('error');
    const action = await store.dispatch(getDelegates());
    const payload = action.payload;

    expect(action.type).toBe('getDelegates/rejected');
    expect(payload).toEqual('error');

    const errorState = store.getState().delegationsState;
    expect(errorState.delegatesError).toEqual(true);
  });

  it('should not be able to fetch the delegators', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'getDelegators');
    apiSpy.mockRejectedValue('error');
    const action = await store.dispatch(getDelegators());
    const payload = action.payload;

    expect(action.type).toBe('getDelegators/rejected');
    expect(payload).toEqual('error');

    const errorState = store.getState().delegationsState;
    expect(errorState.delegatorsError).toEqual(true);
  });

  it('should accept a delegation request', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'acceptDelegation');
    apiSpy.mockResolvedValue({ id: '1' });
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345' }));
    const payload = action.payload;

    expect(action.type).toBe('acceptDelegation/fulfilled');
    expect(payload).toEqual({ id: '1' });
  });

  it('should set the accept modal state to error', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'acceptDelegation');
    apiSpy.mockRejectedValue('error');
    const action = await store.dispatch(acceptDelegation({ id: '1', code: '12345' }));
    const payload = action.payload;

    expect(action.type).toBe('acceptDelegation/rejected');
    expect(payload).toEqual('error');
    const acceptModalState = store.getState().delegationsState.acceptModalState;
    expect(acceptModalState.error).toEqual(true);
  });

  it('should reject a delegation from a delegator', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'rejectDelegation');
    apiSpy.mockResolvedValue({ id: '2' });
    const action = await store.dispatch(rejectDelegation('2'));
    const payload = action.payload;

    expect(action.type).toBe('rejectDelegation/fulfilled');
    expect(payload).toEqual({ id: '2' });
  });

  it('should throw an error trying to reject a delegation', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'rejectDelegation');
    apiSpy.mockRejectedValue('error');
    const action = await store.dispatch(rejectDelegation('2'));
    const payload = action.payload;

    expect(action.type).toBe('rejectDelegation/rejected');
    expect(payload).toEqual('error');
  });

  it('should revoke a delegation for a delegate', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'revokeDelegation');
    apiSpy.mockResolvedValue({ id: '2' });
    const action = await store.dispatch(revokeDelegation('2'));
    const payload = action.payload;

    expect(action.type).toBe('revokeDelegation/fulfilled');
    expect(payload).toEqual({ id: '2' });
  });

  it('should throw an error trying to revoke a delegation', async () => {
    const apiSpy = jest.spyOn(DelegationsApi, 'revokeDelegation');
    apiSpy.mockRejectedValue('error');
    const action = await store.dispatch(revokeDelegation('2'));
    const payload = action.payload;

    expect(action.type).toBe('revokeDelegation/rejected');
    expect(payload).toEqual('error');
  });

  it('sets the confirmation modal state to open and then to close', async () => {
    const openAction = store.dispatch(openRevocationModal({ id: '123', type: 'delegates' }));

    expect(openAction.type).toBe('openRevocationModal');
    const openModalState = store.getState().delegationsState.modalState;
    expect(openModalState).toEqual({ id: '123', type: 'delegates', open: true });

    const closeAction = store.dispatch(closeRevocationModal());

    expect(closeAction.type).toBe('closeRevocationModal');
    const closeModalState = store.getState().delegationsState.modalState;
    expect(closeModalState).toEqual({ id: '', type: 'delegates', open: false });
  });

  it('sets the accept modal state to open and then to close', async () => {
    const action = store.dispatch(openAcceptModal({ id: '123', name: 'test name' }));

    expect(action.type).toBe('openAcceptModal');
    const confirmModalState = store.getState().delegationsState.acceptModalState;
    expect(confirmModalState).toEqual({ id: '123', open: true, name: 'test name', error: false });

    const closeAction = store.dispatch(closeAcceptModal());

    expect(closeAction.type).toBe('closeAcceptModal');
    const closeModalState = store.getState().delegationsState.acceptModalState;
    expect(closeModalState).toEqual({ id: '', open: false, name: '', error: false });
  });

  it('sets the delegates sorting by test in ascendant order', () => {
    const action = store.dispatch(setDelegatesSorting({ orderBy: 'test', order: 'asc' }));

    expect(action.type).toBe('setDelegatesSorting');
    const sortDelegates = store.getState().delegationsState.sortDelegates;
    expect(sortDelegates).toEqual({ orderBy: 'test', order: 'asc' });
  });

  it('sets the delegates sorting by test in descendant order', () => {
    const action = store.dispatch(setDelegatorsSorting({ orderBy: 'test', order: 'desc' }));

    expect(action.type).toBe('setDelegatorsSorting');
    const sortDelegators = store.getState().delegationsState.sortDelegators;
    expect(sortDelegators).toEqual({ orderBy: 'test', order: 'desc' });
  });
});
