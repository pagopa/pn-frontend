import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { AcceptDelegationResponse, Delegation } from './types';

export const getDelegates = createAsyncThunk<Array<Delegation>>(
  'getDelegates',
  async (_, { rejectWithValue }) => {
    try {
      return await DelegationsApi.getDelegates();
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDelegators = createAsyncThunk<Array<Delegation>>(
  'getDelegators',
  async (_, { rejectWithValue }) => {
    try {
      return await DelegationsApi.getDelegators();
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const revokeDelegation = createAsyncThunk<{ id: string }, string>(
  'revokeDelegation',
  async (id: string, { rejectWithValue }) => {
    try {
      return await DelegationsApi.revokeDelegation(id);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const rejectDelegation = createAsyncThunk<{ id: string }, string>(
  'rejectDelegation',
  async (id: string, { rejectWithValue }) => {
    try {
      return await DelegationsApi.rejectDelegation(id);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const acceptDelegation = createAsyncThunk<
  AcceptDelegationResponse,
  { id: string; code: string }
>('acceptDelegation', async ({ id, code }, { rejectWithValue }) => {
  const data = {
    verificationCode: code,
  };
  try {
    return await DelegationsApi.acceptDelegation(id, data);
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const openRevocationModal =
  createAction<{ id: string; type: string }>('openRevocationModal');

export const closeRevocationModal = createAction<void>('closeRevocationModal');

export const openAcceptModal = createAction<{ id: string; name: string }>('openAcceptModal');

export const closeAcceptModal = createAction<void>('closeAcceptModal');

export const setDelegatorsSorting = createAction<{orderBy: string; order: 'asc' | 'desc'}>('setDelegatorsSorting');

export const setDelegatesSorting = createAction<{orderBy: string; order: 'asc' | 'desc'}>('setDelegatesSorting');
