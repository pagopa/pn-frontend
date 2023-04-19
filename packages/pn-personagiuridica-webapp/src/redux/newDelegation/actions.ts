import { createAsyncThunk } from '@reduxjs/toolkit';

import { RecipientType, formatToSlicedISOString } from '@pagopa-pn/pn-commons';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import {
  DelegationParty,
  NewDelegationFormProps,
  CreateDelegationResponse,
  CreateDelegationProps,
} from '../../models/Deleghe';
import { FilterPartiesParams, Party } from '../../models/party';

export function createDelegationMapper(formData: NewDelegationFormProps): CreateDelegationProps {
  return {
    delegate: {
      firstName: formData.nome,
      lastName: formData.cognome,
      fiscalCode: formData.codiceFiscale,
      person: formData.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PF,
    },
    visibilityIds:
      formData.selectTuttiEntiOrSelezionati === 'tuttiGliEnti'
        ? []
        : formData.enti.map(function (ente) {
            return {
              uniqueIdentifier: ente.id,
              name: ente.name,
            } as DelegationParty;
          }),
    verificationCode: formData.verificationCode,
    dateto: formatToSlicedISOString(formData.expirationDate),
  };
}

export const createDelegation = createAsyncThunk<CreateDelegationResponse, NewDelegationFormProps>(
  'createDelegation',
  async (data, { rejectWithValue }) => {
    const payload = createDelegationMapper(data);
    try {
      return await DelegationsApi.createDelegation(payload);
    } catch (e: any) {
      return rejectWithValue(e);
    }
  }
);

export const getAllEntities = createAsyncThunk<Array<Party>, FilterPartiesParams | null>(
  'getAllEntities',
  async (payload, { rejectWithValue }) => {
    try {
      return await ExternalRegistriesAPI.getAllActivatedParties(payload ? payload : {});
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
