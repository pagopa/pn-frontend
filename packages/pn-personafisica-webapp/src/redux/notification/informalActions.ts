import { parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import {
  BffFullInformalNotificationV1,
  RecipientInformalNotificationsApiFactory,
} from '../../generated-client/informal-notifications';

export enum INFORMAL_NOTIFICATION_ACTIONS {
  GET_RECEIVED_INFORMAL_NOTIFICATION = 'getReceivedInformalNotification',
}

export const getReceivedInformalNotification = createAsyncThunk<
  BffFullInformalNotificationV1,
  string
>(
  INFORMAL_NOTIFICATION_ACTIONS.GET_RECEIVED_INFORMAL_NOTIFICATION,
  async (iun: string, { rejectWithValue }) => {
    try {
      const informalNotificationsApiFactory = RecipientInformalNotificationsApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response = await informalNotificationsApiFactory.getReceivedInformalNotificationV1(iun);

      return response.data;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);
