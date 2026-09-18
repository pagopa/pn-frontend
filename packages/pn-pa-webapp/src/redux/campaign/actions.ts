import {
  formatFiscalCode,
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  parseError,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffCampaignDetailResponseV1,
  BffCampaignSearchResponseV1,
  BffInformalSenderNotificationSearchResponse,
  InformalNotificationStatusV1,
  SenderInformalNotificationsApiFactory,
} from '../../generated-client/informal-notifications';

export enum CAMPAIGN_ACTIONS {
  GET_CAMPAIGNS = 'getCampaigns',
  GET_CAMPAIGN_DETAIL = 'getCampaignDetail',
  GET_CAMPAIGN_COMMUNICATIONS = 'getCampaignCommunications',
}

interface GetCampaignsParams {
  page: number;
  size: number;
  nextPagesKey?: string;
  allowGlobalLoading?: boolean;
}

interface GetCampaignCommunicationsParams {
  campaignId: string;
  recipientId?: string;
  iunMatch?: string;
  status?: InformalNotificationStatusV1;
  viewed?: boolean;
  delivered?: boolean;
  size?: number;
  nextPagesKey?: string;
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

export const getCampaignCommunications = createAsyncThunk(
  CAMPAIGN_ACTIONS.GET_CAMPAIGN_COMMUNICATIONS,
  async (params: GetCampaignCommunicationsParams, { rejectWithValue }) => {
    try {
      const senderInformalNotificationsApiFactory = SenderInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const startDate = formatToTimezoneString(getStartOfDay(tenYearsAgo));
      const endDate = formatToTimezoneString(getEndOfDay(today));

      const response = await senderInformalNotificationsApiFactory.searchInformalSentNotificationV1(
        params.campaignId,
        startDate,
        endDate,
        params.recipientId ? formatFiscalCode(params.recipientId) : undefined,
        params.iunMatch || undefined,
        params.status,
        params.viewed,
        params.delivered,
        params.size,
        params.nextPagesKey
      );

      return response.data as BffInformalSenderNotificationSearchResponse;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
