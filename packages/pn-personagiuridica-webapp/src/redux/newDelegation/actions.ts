import { RecipientType, formatToSlicedISOString, parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { MandateApiFactory } from '../../generated-client/mandate';
import { InfoRecipientApiFactory } from '../../generated-client/recipient-info';
import { NewDelegationFormProps, NewMandateRequest, Person } from '../../models/Deleghe';
import { FilterPartiesParams, Party } from '../../models/party';

export function createDelegationMapper(formData: NewDelegationFormProps): NewMandateRequest {
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
      const infoRecipientFactory = InfoRecipientApiFactory(undefined, undefined, apiClient);
      const response = await infoRecipientFactory.getPAListV1(
        payload?.paNameFilter ? payload.paNameFilter : undefined
      );

      return response.data as Array<Party>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: ({ arg }) => ({ blockLoading: arg?.blockLoading }),
  }
);
