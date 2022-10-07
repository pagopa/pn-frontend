import { createAsyncThunk } from '@reduxjs/toolkit';

// import { formatToSlicedISOString } from "@pagopa-pn/pn-commons/src/services/date.service";
// import { DelegationsApi } from '../../api/delegations/Delegations.api';
import { ExternalRegistriesAPI } from '../../api/external-registries/External-registries.api';
import { CreateDelegationResponse, NewDelegationFormProps } from '../delegation/types';

export const createDelegation = createAsyncThunk<CreateDelegationResponse, NewDelegationFormProps>(
  'createDelegation',
  async (data, { rejectWithValue }) => {
    // const payload = {
    //   delegate: {
    //     firstName: data.nome,
    //     lastName: data.cognome,
    //     fiscalCode: data.codiceFiscale,
    //     person: data.selectPersonaFisicaOrPersonaGiuridica === 'pf',
    //   },
    //   visibilityIds: data.selectTuttiEntiOrSelezionati === 'tuttiGliEnti' ? [] : [data.enteSelect],
    //   verificationCode: data.verificationCode,
    //     dateto: formatToSlicedISOString(data.expirationDate),
    // };
    // try {
    //   return await DelegationsApi.createDelegation(payload);
    // } catch (e: any) {
    //   if (e.response.status === 409 && e.response.data.title === "Delega già presente") {
    //     const message = e.response.data.errors[0]?.code  === "PN_MANDATE_DELEGATEHIMSELF" ? "Non è possibile delegare se stessi" : "La persona che hai indicato ha già una delega per questo ente.";
    //     return rejectWithValue({
    //       response: {
    //         ...e.response,
    //         customMessage: {
    //           title: "Delega già presente",
    //           message
    //         }
    //       }
    //     });
    //   }
    //   return rejectWithValue(e);
    // }
    console.log(data);
    return rejectWithValue({
      response: {
        status: 403,
        data: {
          status: 401,
          timestamp: "2022-10-07T12:56:14.913Z",
          traceId: "Self=1-634021ee-164458ed0efaa3524b4e29f0;Root=1-634021ee-3dcdefe23b373d4d0e63c940;Parent=7a35805a25f5a1b2;Sampled=1",
          // errors: [
          //   {
          //     code: "PN_MANDATE_DELEGATEHIMSELF",
          //   },
          //   {
          //     code: "PN_MANDATE_NOTACCEPTABLE"
          //   }
          // ]
        }
      }
    });
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
