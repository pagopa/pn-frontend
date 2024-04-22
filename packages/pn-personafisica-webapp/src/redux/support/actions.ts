import { performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { SupportApi } from '../../api/support/Support.api';
import { ZendeskAuthorizationDTO } from '../../models/Support';

export const zendeskAuthorization = createAsyncThunk<ZendeskAuthorizationDTO, string>(
  'zendeskAuthorization',
  performThunkAction((params: string) => SupportApi.zendeskAuthorization(params))
);
