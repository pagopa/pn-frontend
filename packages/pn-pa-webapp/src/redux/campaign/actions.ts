import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffCampaignDetailResponseV1,
  SenderInformalNotificationsApiFactory,
} from '../../generated-client/sender-informal-notifications';

export enum CAMPAIGN_ACTIONS {
  GET_CAMPAIGN_DETAIL = 'getCampaignDetail',
}

export const getCampaignDetail = createAsyncThunk<BffCampaignDetailResponseV1, string>(
  CAMPAIGN_ACTIONS.GET_CAMPAIGN_DETAIL,
  async (campaignId: string, { rejectWithValue }) => {
    try {
      const senderInformalNotificationsApiFactory = SenderInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response = await senderInformalNotificationsApiFactory.getCampaignDetailV1(campaignId);

      return response.data as BffCampaignDetailResponseV1;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
