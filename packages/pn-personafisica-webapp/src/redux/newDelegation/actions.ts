import { createAsyncThunk } from '@reduxjs/toolkit';

import { formatToSlicedISOString } from '@pagopa-pn/pn-commons';
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { CreateDelegationResponse, NewDelegationFormProps } from '../delegation/types';
import { DelegationParty } from '../../models/Deleghe';
import { FilterPartiesParams, Party } from '../../models/party';

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
      visibilityIds:
        data.selectTuttiEntiOrSelezionati === 'tuttiGliEnti'
          ? []
          : data.enteSelect.map(function (ente) {
              return {
                uniqueIdentifier: ente.id,
                name: ente.name,
              } as DelegationParty;
            }),
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
