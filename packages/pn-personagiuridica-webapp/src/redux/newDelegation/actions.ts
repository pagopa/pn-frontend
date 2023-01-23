import { createAsyncThunk } from '@reduxjs/toolkit';

import { formatToSlicedISOString } from "@pagopa-pn/pn-commons";
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
        dateto: formatToSlicedISOString(data.expirationDate),
    };
    try {
      return await DelegationsApi.createDelegation(payload);
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const getAllEntities = createAsyncThunk(
  'getAllEntities',
  async (_, { rejectWithValue }) => {
    try {
      return await ExternalRegistriesAPI.getAllActivatedParties();
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
