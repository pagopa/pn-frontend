import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import {
  NewNotificationDocument,
  PaymentModel,
  NewNotificationFe,
  NewNotificationResponse,
  FormRecipient,
} from '../../models/newNotification';

export const setCancelledIun = createAction<string>('setCancelledIun');

export const setPreliminaryInformations = createAction<{
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentModel: PaymentModel;
}>('setPreliminaryInformations');

export const saveRecipients = createAction<{recipients: Array<FormRecipient>}>('saveRecipients');

export const uploadNotificationDocument = createAsyncThunk<
  Array<NewNotificationDocument>,
  Array<{ key: string; contentType: string; fileBase64: string; sha256: string }>
>(
  'uploadNotificationDocument',
  async (
    items: Array<{ key: string; contentType: string; fileBase64: string; sha256: string }>,
    { rejectWithValue }
  ) => {
    try {
      const presignedUrls = await NotificationsApi.preloadNotificationDocument(items);
      if (presignedUrls.length) {
        const uploadDocumentCalls: Array<Promise<void>> = [];
        // upload document
        presignedUrls.forEach((presigneUrl, index) => {
          /* eslint-disable-next-line functional/immutable-data */
          uploadDocumentCalls.push(
            NotificationsApi.uploadNotificationDocument(
              presigneUrl.url,
              items[index].sha256,
              presigneUrl.secret,
              items[index].fileBase64
            )
          );
        });
        await Promise.all(uploadDocumentCalls);
      }
      return items.map((item, index) => ({
        digests: {
          sha256: item.sha256,
        },
        contentType: item.contentType,
        ref: {
          key: item.key,
          versionToken: presignedUrls[index].secret,
        },
      }));
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createNewNotification = createAsyncThunk<NewNotificationResponse, NewNotificationFe>(
  'createNewNotification',
  async (notification: NewNotificationFe, { rejectWithValue }) => {
    try {
      const notificationToSave = { ...notification, paymentMode: undefined };
      return await NotificationsApi.createNewNotification(notificationToSave);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetNewNotificationState = createAction<void>('resetNewNotificationState');
