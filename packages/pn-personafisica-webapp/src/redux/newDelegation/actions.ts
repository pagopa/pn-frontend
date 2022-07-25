import { createAction, createAsyncThunk } from '@reduxjs/toolkit';

import { formatToSlicedISOString } from "@pagopa-pn/pn-commons/src/services/date.service";
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
      if (e.response.status === 400 && e.response.data.title === "Delega già presente") {
        return rejectWithValue({
          response: {
            ...e.response,
            customMessage: {
              title: "Delega già presente",
              message: "La persona che hai indicato ha già una delega per questo ente."
            }
          }
        });
      }
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

export const resetNewDelegation = createAction<void>('resetNewDelegation');
