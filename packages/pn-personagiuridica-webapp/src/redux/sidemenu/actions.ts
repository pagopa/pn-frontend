import {
  formatToTimezoneString,
  getEndOfDay,
  getStartOfDay,
  parseError,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { MandateApiFactory } from '../../generated-client/mandate';
import {
  NotificationReceivedApiFactory,
  SearchReceivedNotificationsV1CommunicationTypeEnum,
} from '../../generated-client/notifications';
import { DelegationStatus } from '../../models/Deleghe';

export enum SIDEMENU_ACTIONS {
  GET_SIDEMENU_INFORMATION = 'getSidemenuInformation',
  GET_HAS_NEW_NOTIFICATIONS = 'getHasNewNotifications',
}

export const getSidemenuInformation = createAsyncThunk<number>(
  SIDEMENU_ACTIONS.GET_SIDEMENU_INFORMATION,
  async (_, { rejectWithValue }) => {
    try {
      const mandateApiFactory = MandateApiFactory(undefined, undefined, apiClient);
      const response = await mandateApiFactory.countMandatesByDelegateV1(DelegationStatus.PENDING);
      return response.data.value ?? 0;
    } catch (e: any) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const getHasNewNotifications = createAsyncThunk<boolean>(
  SIDEMENU_ACTIONS.GET_HAS_NEW_NOTIFICATIONS,
  async (_, { rejectWithValue }) => {
    try {
      const receivedNotificationsFactory = NotificationReceivedApiFactory(
        undefined,
        undefined,
        apiClient
      );

      const response = await receivedNotificationsFactory.searchReceivedNotificationsV1(
        formatToTimezoneString(getStartOfDay(tenYearsAgo)),
        formatToTimezoneString(getEndOfDay(today)),
        undefined,
        undefined,
        undefined,
        10,
        undefined,
        SearchReceivedNotificationsV1CommunicationTypeEnum.All
      );

      return (
        response.data.resultsPage?.some((notification) => notification.isNewNotification) ?? false
      );
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
