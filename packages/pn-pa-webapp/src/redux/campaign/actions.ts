import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffCampaignSearchResponseV1,
  SenderInformalNotificationsApiFactory,
} from '../../generated-client/informal-notifications';

export enum CAMPAIGN_ACTIONS {
  GET_CAMPAIGNS = 'getCampaigns',
}

interface GetCampaignsParams {
  size: number;
  nextPagesKey?: string;
  allowGlobalLoading?: boolean;
}

/**
 * Get campaigns
 */
export const getCampaigns = createAsyncThunk(
  CAMPAIGN_ACTIONS.GET_CAMPAIGNS,
  async (params: GetCampaignsParams, { rejectWithValue }) => {
    try {
      const senderInformalNotificationsFactory = SenderInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response = await senderInformalNotificationsFactory.getListCampaignsV1(
        params.size,
        params.nextPagesKey
      );

      return response.data as BffCampaignSearchResponseV1;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  },
  {
    getPendingMeta: ({ arg }) => ({ blockLoading: !arg.allowGlobalLoading }),
  }
);
