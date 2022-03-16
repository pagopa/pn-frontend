import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';

/**
 *
 */
export const getDelegates = createAsyncThunk<any>(
  'getDelegates',
  // async (_, {rejectWithValue}) => {
  //   try {
  //     return await DelegationsApi.getDelegates();
  //   } catch (e){
  //       return e
  //   }
  // }
  async () => [
    {
      mandateId: '1',
      delegator: {
        firstName: 'Mario',
        lastName: 'Rossi',
        companyName: 'eni',
        fiscalCode: 'MRIRSS68P24H501C',
        person: true,
      },
      delegate: {
        firstName: 'Marco',
        lastName: 'Verdi',
        companyName: 'eni',
        fiscalCode: 'MRCVRD83C12H501C',
        person: true,
      },
      status: 'Active',
      visibilityIds: [
        {
          name: 'Agenzia Entrate',
          uniqueIdentifier: '123456789',
        },
      ],
      verificationCode: '123456',
      datefrom: '15-12-2021',
      dateto: '16-04-2022',
      email: 'email@falsa.it',
    },
    {
      mandateId: '123',
      delegator: {
        firstName: 'Mario',
        lastName: 'Rossi',
        companyName: 'eni',
        fiscalCode: 'MRIRSS68P24H501C',
        person: true,
      },
      delegate: {
        firstName: 'Davide',
        lastName: 'Legato',
        companyName: 'eni',
        fiscalCode: 'DVDLGT83C12H501C',
        person: true,
      },
      status: 'Active',
      visibilityIds: [
        {
          name: 'Agenzia Entrate',
          uniqueIdentifier: '123456789',
        },
      ],
      verificationCode: '123456',
      datefrom: '15-12-2021',
      dateto: '16-04-2022',
      email: 'email@falsa.it',
    },
  ]
);

export const getDelegators = createAsyncThunk<any>(
  'getDelegators',
  // async (_, {rejectWithValue}) => {
  //   try {
  //     return await DelegationsApi.getDelegators();
  //   } catch (e){
  //       return e
  //   }
  // }
  async () => [
    {
      mandateId: '3',
      delegator: {
        firstName: 'Marco',
        lastName: 'Verdi',
        companyName: 'eni',
        fiscalCode: 'MRCVRD83C12H501C',
        person: true,
      },
      delegate: {
        firstName: 'Mario',
        lastName: 'Rossi',
        companyName: 'eni',
        fiscalCode: 'MRIRSS68P24H501C',
        person: true,
      },
      status: 'Pending',
      visibilityIds: [
        {
          name: 'Agenzia Entrate',
          uniqueIdentifier: '123456789',
        },
      ],
      verificationCode: '123456',
      datefrom: '15-12-2021',
      dateto: '16-04-2022',
      email: 'email@falsa.it',
    },
    {
      mandateId: '4',
      delegator: {
        firstName: 'Davide',
        lastName: 'Legato',
        companyName: 'eni',
        fiscalCode: 'DVDLGT83C12H501C',
        person: true,
      },
      delegate: {
        firstName: 'Mario',
        lastName: 'Rossi',
        companyName: 'eni',
        fiscalCode: 'MRIRSS68P24H501C',
        person: true,
      },
      status: 'Active',
      visibilityIds: [
        {
          name: 'Agenzia Entrate',
          uniqueIdentifier: '123456789',
        },
      ],
      verificationCode: '123456',
      datefrom: '15-12-2021',
      dateto: '16-04-2022',
      email: 'email@falsa.it',
    },
  ]
);

export const revokeDelegation = createAsyncThunk<{ id: string }, string>(
  'revokeDelegation',
  async (id: string, { rejectWithValue }) => {
    try {
      return await DelegationsApi.revokeDelegation(id);
    } catch (e) {
      // TODO: return rejectWithValue(e);
      return { id };
    }
  }
);

export const rejectDelegation = createAsyncThunk<{ id: string }, string>(
  'rejectDelegation',
  async (id: string, { rejectWithValue }) => {
    try {
      return await DelegationsApi.rejectDelegation(id);
    } catch (e) {
      // TODO: return rejectWithValue(e);
      return { id };
    }
  }
);

export const acceptDelegation = createAsyncThunk<{ id: string }, string>(
  'acceptDelegation',
  async (id: string) => {
    try {
      return await DelegationsApi.acceptDelegation(id);
    } catch (e) {
      return { id };
      // TODO: return { rejectWithValue(e) };
    }
  }
);

export const openRevocationModal =
  createAction<{ id: string; type: string }>('openRevocationModal');

export const closeRevocationModal = createAction<void>('closeRevocationModal');
