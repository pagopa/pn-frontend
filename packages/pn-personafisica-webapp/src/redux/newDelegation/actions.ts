import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { CreateDelegationResponse, NewDelegationFormProps } from '../delegation/types';

export const createDelegation = createAsyncThunk<CreateDelegationResponse, NewDelegationFormProps>(
  'delegation',
  async (data, { rejectWithValue }) => {
    const payload = {
      delegate: {
        firstName: data.nome,
        lastName: data.cognome,
        fiscalCode: data.codiceFiscale,
        person: data.selectPersonaFisicaOrPersonaGiuridica === 'pf',
        email: data.email,
      },
      visibilityIds: data.selectTuttiEntiOrSelezionati === 'tuttiGliEnti' ? [] : [data.enteSelect],
      verificationCode: data.verificationCode,
      dateto: new Date(data.expirationDate).toISOString(),
    };
    try {
      return await DelegationsApi.createDelegation(payload);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetNewDelegation = createAction<void>('resetNewDelegation');
