import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { PaymentModel } from './../../models/newNotification';

export const setPreliminaryInformations = createAction<{
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentModel: PaymentModel;
}>('setPreliminaryInformations');

export const uploadNotificationDocument = createAsyncThunk<
  void,
  { key: string; contentType: string; file: any }
>(
  'uploadNotificationDocument',
  async (params: { key: string; contentType: string }, { rejectWithValue }) => {
    try {
      await NotificationsApi.preloadNotificationDocument(params.key, params.contentType);
      return;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetNewNotificationState = createAction<void>('resetNewNotificationState');
