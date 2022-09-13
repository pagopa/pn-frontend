import { createAsyncThunk } from '@reduxjs/toolkit';

import { formatToSlicedISOString } from "@pagopa-pn/pn-commons/src/services/date.service";
import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { CreateDelegationResponse, NewDelegationFormProps } from '../delegation/types';
import { createDelegationValidator } from '../../validators/CreateDelegationValidator';

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
      console.log(createDelegationValidator.validate(payload));
      return await DelegationsApi.createDelegation(payload);
    } catch (e: any) {
      if (e.response.status === 409 && e.response.data.title === "Delega già presente") {
        const message = e.response.data.errors[0]?.code  === "PN_MANDATE_DELEGATEHIMSELF" ? "Non è possibile delegare se stessi" : "La persona che hai indicato ha già una delega per questo ente.";
        return rejectWithValue({
          response: {
            ...e.response,
            customMessage: {
              title: "Delega già presente",
              message
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
