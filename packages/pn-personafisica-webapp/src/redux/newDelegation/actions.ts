import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { CreateDelegationResponse, NewDelegationFormProps } from '../delegation/types';

export const createDelegation = createAsyncThunk<CreateDelegationResponse, NewDelegationFormProps>(
  'createDelegation',
  async (data, { rejectWithValue }) => {
    const payload = {
      delegate: {
        firstName: data.nome,
        lastName: data.cognome,
        fiscalCode: data.codiceFiscale,
        person: data.selectPersonaFisicaOrPersonaGiuridica === 'pf',
      },
      visibilityIds: data.selectTuttiEntiOrSelezionati === 'tuttiGliEnti' ? [] : [data.enteSelect],
      verificationCode: data.verificationCode,
      dateto: new Date(data.expirationDate).toISOString().split('T')[0],
    };
    try {
      return await DelegationsApi.createDelegation(payload);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAllEntities = createAsyncThunk('getAllEntities', async () =>
  ExternalRegistriesAPI.getAllActivatedParties()
);

export const resetNewDelegation = createAction<void>('resetNewDelegation');
