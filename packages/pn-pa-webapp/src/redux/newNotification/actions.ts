import * as _ from 'lodash-es';

import { calcUnit8Array, parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { InfoPaApiFactory } from '../../generated-client/info-pa';
import {
  BffNewNotificationResponse,
  NotificationSentApiFactory,
} from '../../generated-client/notifications';
import {
  NewNotification,
  NewNotificationDocument,
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  NewNotificationRecipient,
  UploadDocumentParams,
  UploadDocumentsResponse,
} from '../../models/NewNotification';
import { GroupStatus, UserGroup } from '../../models/user';
import { hasPagoPaDocument, newNotificationMapper } from '../../utility/notification.utility';

export enum NEW_NOTIFICATION_ACTIONS {
  GET_USER_GROUPS = 'getUserGroups',
  UPLOAD_DOCUMENT = 'uploadNotificationDocument',
  UPLOAD_PAYMENT_DOCUMENT = 'uploadNotificationPaymentDocument',
  CREATE_NOTIFICATION = 'createNewNotification',
}
/**
 * Get user groups
 */
export const getUserGroups = createAsyncThunk(
  NEW_NOTIFICATION_ACTIONS.GET_USER_GROUPS,
  async (params: GroupStatus | undefined, { rejectWithValue }) => {
    try {
      const infoPaFactory = InfoPaApiFactory(undefined, undefined, apiClient);
      const response = await infoPaFactory.getPAGroupsV1(params);
      return response.data as Array<UserGroup>;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

const createPayloadToUpload = async (
  item: NewNotificationDocument | Required<NewNotificationPagoPaPayment> | NewNotificationF24Payment
): Promise<UploadDocumentParams> => {
  const unit8Array = await calcUnit8Array(item.file.data);
  return {
    id: item.id,
    contentType: item.contentType,
    file: unit8Array,
    sha256: item.file.sha256.hashBase64,
  };
};

const uploadNotificationDocumentCbk = async (
  items: Array<UploadDocumentParams>
): Promise<UploadDocumentsResponse> => {
  try {
    const notificationSentApiFactory = NotificationSentApiFactory(undefined, undefined, apiClient);
    const presignedUrlsResponse = await notificationSentApiFactory.preSignedUploadV1(
      items.map((item) => ({ contentType: item.contentType, sha256: item.sha256 }))
    );
    const presignedUrls = presignedUrlsResponse.data;
    if (presignedUrls.length) {
      const uploadDocumentCalls: Array<Promise<string>> = [];
      // upload document
      presignedUrls.forEach((presigneUrl, index) => {
        if (presigneUrl.url && presigneUrl.secret && presigneUrl.httpMethod) {
          /* eslint-disable-next-line functional/immutable-data */
          uploadDocumentCalls.push(
            NotificationsApi.uploadNotificationDocument(
              presigneUrl.url,
              items[index].sha256,
              presigneUrl.secret,
              items[index].file as Uint8Array,
              presigneUrl.httpMethod,
              items[index].contentType
            )
          );
        }
      });
      const documentsToken = await Promise.all(uploadDocumentCalls);
      return items.reduce((obj, item, index) => {
        const key = presignedUrls[index].key;
        if (key) {
          /* eslint-disable-next-line functional/immutable-data */
          obj[item.id] = {
            key,
            versionToken: documentsToken[index],
          };
        }
        return obj;
      }, {} as UploadDocumentsResponse);
    }
    throw new Error();
  } catch (e) {
    throw new Error(e as any);
  }
};

export const uploadNotificationDocument = createAsyncThunk<
  Array<NewNotificationDocument>,
  Array<NewNotificationDocument>
>(
  NEW_NOTIFICATION_ACTIONS.UPLOAD_DOCUMENT,
  async (items: Array<NewNotificationDocument>, { rejectWithValue }) => {
    try {
      // before upload, filter out documents already uploaded
      const filteredItems = items.filter((item) => !item.ref.key && !item.ref.versionToken);
      const itemsToUpload = await Promise.all(filteredItems.map(createPayloadToUpload));
      if (itemsToUpload.length === 0) {
        return items;
      }
      const itemsUploaded = await uploadNotificationDocumentCbk(itemsToUpload);
      return items.map((item) => {
        if (!itemsUploaded[item.id]) {
          return item;
        }
        return {
          ...item,
          ref: {
            key: itemsUploaded[item.id].key,
            versionToken: itemsUploaded[item.id].versionToken,
          },
        };
      });
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

const getPaymentDocumentsToUpload = (
  recipients: Array<NewNotificationRecipient>
): Array<Promise<UploadDocumentParams>> => {
  const documentsArr: Array<Promise<UploadDocumentParams>> = [];
  /* eslint-disable functional/immutable-data */
  for (const recipient of recipients) {
    if (!recipient.payments) {
      continue;
    }

    for (const payment of recipient.payments) {
      if (
        payment.pagoPa &&
        hasPagoPaDocument(payment.pagoPa) &&
        !payment.pagoPa.ref.key &&
        !payment.pagoPa.ref.versionToken
      ) {
        documentsArr.push(createPayloadToUpload(payment.pagoPa));
      }

      if (payment.f24 && !payment.f24.ref.key && !payment.f24.ref.versionToken) {
        documentsArr.push(createPayloadToUpload(payment.f24));
      }
    }
  }
  /* eslint-enable functional/immutable-data */

  return documentsArr;
};

export const uploadNotificationPaymentDocument = createAsyncThunk<
  Array<NewNotificationRecipient>,
  Array<NewNotificationRecipient>
>(
  NEW_NOTIFICATION_ACTIONS.UPLOAD_PAYMENT_DOCUMENT,
  async (recipients: Array<NewNotificationRecipient>, { rejectWithValue }) => {
    try {
      // before upload, filter out documents already uploaded
      const documentsToUpload = await Promise.all(getPaymentDocumentsToUpload(recipients));
      if (documentsToUpload.length === 0) {
        return recipients;
      }
      const documentsUploaded = await uploadNotificationDocumentCbk(documentsToUpload);
      const updatedItems = _.cloneDeep(recipients);

      for (const updatedItem of updatedItems) {
        if (!updatedItem.payments) {
          continue;
        }

        for (const payment of updatedItem.payments) {
          /* eslint-disable functional/immutable-data */
          if (payment.pagoPa?.ref && documentsUploaded[payment.pagoPa.id]) {
            payment.pagoPa.ref.key = documentsUploaded[payment.pagoPa.id].key;
            payment.pagoPa.ref.versionToken = documentsUploaded[payment.pagoPa.id].versionToken;
          }
          if (payment.f24 && documentsUploaded[payment.f24.id]) {
            payment.f24.ref.key = documentsUploaded[payment.f24.id].key;
            payment.f24.ref.versionToken = documentsUploaded[payment.f24.id].versionToken;
          }
          /* eslint-enable functional/immutable-data */
        }
      }

      return updatedItems;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createNewNotification = createAsyncThunk<BffNewNotificationResponse, NewNotification>(
  NEW_NOTIFICATION_ACTIONS.CREATE_NOTIFICATION,
  async (notification: NewNotification, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const mappedNotification = newNotificationMapper(notification);
      const response = await notificationSentApiFactory.newSentNotificationV1(mappedNotification);
      return response.data;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);
