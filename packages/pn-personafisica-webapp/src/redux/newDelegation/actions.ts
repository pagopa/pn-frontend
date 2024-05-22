import { RecipientType, formatToSlicedISOString, parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { MandateApiFactory } from '../../generated-client/mandate';
import { FilterPartiesParams, Party } from '../../models/party';
import { NewDelegationFormProps, NewMandateRequest, Person } from '../delegation/types';

export function createDelegationMapper(formData: NewDelegationFormProps): NewMandateRequest {
  const delegate = {
    fiscalCode: formData.codiceFiscale.toUpperCase(),
  } as Person;

  /* eslint-disable functional/immutable-data */
  if (formData.selectPersonaFisicaOrPersonaGiuridica === RecipientType.PF) {
    delegate.person = true;
    delegate.displayName = `${formData.nome} ${formData.cognome}`;
    delegate.firstName = formData.nome;
    delegate.lastName = formData.cognome;
  } else {
    delegate.person = false;
    delegate.displayName = formData.ragioneSociale;
    delegate.companyName = formData.ragioneSociale;
  }
  /* eslint-enable functional/immutable-data */

  return {
    delegate,
    visibilityIds:
      formData.selectTuttiEntiOrSelezionati === 'tuttiGliEnti'
        ? []
        : formData.enti.map(function (ente) {
            return {
              uniqueIdentifier: ente.id,
              name: ente.name,
            };
          }),
    verificationCode: formData.verificationCode,
    dateto: formatToSlicedISOString(formData.expirationDate),
  };
}

export const createDelegation = createAsyncThunk<void, NewDelegationFormProps>(
  'createDelegation',
  async (data, { rejectWithValue }) => {
    try {
      const payload = createDelegationMapper(data);
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.createMandateV1(payload);
      console.log(response.data);
      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getAllEntities = createAsyncThunk<Array<Party>, FilterPartiesParams | null>(
  'getAllEntities',
  async (payload, { rejectWithValue }) => {
    try {
      return await ExternalRegistriesAPI.getAllActivatedParties(payload ?? {});
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  {
    getPendingMeta: ({ arg }) => ({ blockLoading: arg?.blockLoading }),
  }
);
