import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { NewDelegationFormProps, Person } from '../delegation/types';

export interface CreateDelegationProps {
  delegate: Person;
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
  verificationCode: string;
  dateto: string;
}

export interface CreateDelegationResponse {
  datefrom: string;
  dateto: string;
  delegate: Person;
  delegator: Person | null;
  mandateId: string;
  status: string;
  verificationCode: string;
  visibilityIds: Array<{
    name: string;
    uniqueIdentifier: string;
  }>;
}

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
