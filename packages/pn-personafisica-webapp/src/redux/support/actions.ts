import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { SupportApi } from '../../api/support/Support.api';
import { ZendeskAuthorizationDTO } from '../../models/Support';

export const zendeskAuthorization = createAsyncThunk<ZendeskAuthorizationDTO, string>(
  'zendeskAuthorization',
  async (params, { rejectWithValue }) => {
    try {
      return await SupportApi.zendeskAuthorization(params);
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
