import { createAsyncThunk } from '@reduxjs/toolkit';

import { RecipientType, formatToSlicedISOString } from '@pagopa-pn/pn-commons';
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
        displayName:
          data.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PF
            ? `${data.nome} ${data.cognome}`
            : data.ragioneSociale,
        firstName: data.nome || undefined,
        lastName: data.cognome || undefined,
        fiscalCode: data.codiceFiscale,
        companyName: data.ragioneSociale || undefined,
        person: data.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PF,
      },
      visibilityIds:
        data.selectTuttiEntiOrSelezionati === 'tuttiGliEnti'
          ? []
          : data.enti.map(function (ente) {
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
