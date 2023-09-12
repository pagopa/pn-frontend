import { RecipientType, formatToSlicedISOString } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { DelegationParty } from '../../models/Deleghe';
import { FilterPartiesParams, Party } from '../../models/party';
import {
  CreateDelegationProps,
  CreateDelegationResponse,
  NewDelegationFormProps,
  Person,
} from '../delegation/types';

export function createDelegationMapper(formData: NewDelegationFormProps): CreateDelegationProps {
  const delegate = {
    fiscalCode: formData.codiceFiscale,
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
            } as DelegationParty;
          }),
    verificationCode: formData.verificationCode,
    dateto: formatToSlicedISOString(formData.expirationDate),
  };
}

export const createDelegation = createAsyncThunk<CreateDelegationResponse, NewDelegationFormProps>(
  'createDelegation',
  async (data, { rejectWithValue }) => {
    try {
      const payload = createDelegationMapper(data);
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
      return await ExternalRegistriesAPI.getAllActivatedParties(payload ?? {});
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
