import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { InstitutionsApi } from '../../api/institutions/Institutions.api';
import { GetInstitutionsParams, InstitutionsResponse } from '../../models/Institutions';

export enum INSTITUTIONS_ACTIONS {
  GET_INSTITUTIONS = 'getInstitutions',
}

export const getInstitutions = createAsyncThunk<InstitutionsResponse, GetInstitutionsParams>(
  INSTITUTIONS_ACTIONS.GET_INSTITUTIONS,
  async (params, { rejectWithValue }) => {
    try {
      return await InstitutionsApi.getInstitutions(params);
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
