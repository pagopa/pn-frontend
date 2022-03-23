import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';

export interface CreateDelegationProps {
  selectPersonaFisicaOrPersonaGiuridica: string;
  codiceFiscale: string;
  email: string;
  nome: string;
  cognome: string;
  selectTuttiEntiOrSelezionati: string;
  expirationDate: number;
  enteSelect: string;
  verificationCode: string;
}

export const createDelegation = createAsyncThunk<
  CreateDelegationProps | string,
  CreateDelegationProps
>('delegation', async (data) => {
  try {
    return await DelegationsApi.createDelegation(data);
  } catch (e) {
    // TODO: add return rejectWithValue(e);
    return {
      selectPersonaFisicaOrPersonaGiuridica: 'pf',
      codiceFiscale: 'asdfghjkbvxgs',
      email: 'string@string.it',
      nome: 'Luigi',
      cognome: 'Rossi',
      selectTuttiEntiOrSelezionati: 'string',
      expirationDate: 245678909876,
      enteSelect: 'jasincjs',
      verificationCode: '12345',
    };
  }
});

export const resetNewDelegation = createAction<void>('resetNewDelegation');
