import _ from 'lodash';

import { calcUnit8Array, parseError } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { apiClient } from '../../api/apiClients';
import { NotificationsApi } from '../../api/notifications/Notifications.api';
import { InfoPaApiFactory } from '../../generated-client/info-pa';
import {
  BffNewNotificationRequest,
  NotificationSentApiFactory,
} from '../../generated-client/notifications';
import {
  NewNotification,
  NewNotificationDocument,
  NewNotificationResponse,
  PaymentObject,
} from '../../models/NewNotification';
import { GroupStatus, UserGroup } from '../../models/user';
import { newNotificationMapper } from '../../utility/notification.utility';
import { UploadDocumentParams, UploadDocumentsResponse } from './types';

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
  item: NewNotificationDocument
): Promise<UploadDocumentParams> => {
  const unit8Array = await calcUnit8Array(item.file.data);
  return {
    id: item.id,
    key: item.name,
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
              presigneUrl.httpMethod
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

const getPaymentDocumentsToUpload = (items: {
  [key: string]: PaymentObject;
}): Array<Promise<UploadDocumentParams>> => {
  const documentsArr: Array<Promise<UploadDocumentParams>> = [];
  for (const item of Object.values(items)) {
    /* eslint-disable functional/immutable-data */
    if (item.pagoPa && !item.pagoPa.ref.key && !item.pagoPa.ref.versionToken) {
      documentsArr.push(createPayloadToUpload(item.pagoPa));
    }
    if (item.f24 && !item.f24.ref.key && !item.f24.ref.versionToken) {
      documentsArr.push(createPayloadToUpload(item.f24));
    }
    /* eslint-enable functional/immutable-data */
  }
  return documentsArr;
};

export const uploadNotificationPaymentDocument = createAsyncThunk<
  { [key: string]: PaymentObject },
  { [key: string]: PaymentObject }
>(
  NEW_NOTIFICATION_ACTIONS.UPLOAD_PAYMENT_DOCUMENT,
  async (items: { [key: string]: PaymentObject }, { rejectWithValue }) => {
    try {
      // before upload, filter out documents already uploaded
      const documentsToUpload = await Promise.all(getPaymentDocumentsToUpload(items));
      if (documentsToUpload.length === 0) {
        return items;
      }
      const documentsUploaded = await uploadNotificationDocumentCbk(documentsToUpload);
      const updatedItems = _.cloneDeep(items);
      for (const item of Object.values(updatedItems)) {
        /* eslint-disable functional/immutable-data */
        if (item.pagoPa && documentsUploaded[item.pagoPa.id]) {
          item.pagoPa.ref.key = documentsUploaded[item.pagoPa.id].key;
          item.pagoPa.ref.versionToken = documentsUploaded[item.pagoPa.id].versionToken;
        }
        if (item.f24 && documentsUploaded[item.f24.id]) {
          item.f24.ref.key = documentsUploaded[item.f24.id].key;
          item.f24.ref.versionToken = documentsUploaded[item.f24.id].versionToken;
        }
        /* eslint-enable functional/immutable-data */
      }
      return updatedItems;
    } catch (e) {
      return rejectWithValue(parseError(e));
    }
  }
);

export const createNewNotification = createAsyncThunk<NewNotificationResponse, NewNotification>(
  NEW_NOTIFICATION_ACTIONS.CREATE_NOTIFICATION,
  async (notification: NewNotification, { rejectWithValue }) => {
    try {
      const notificationSentApiFactory = NotificationSentApiFactory(
        undefined,
        undefined,
        apiClient
      );
      const mappedNotification = newNotificationMapper(notification);
      const response = await notificationSentApiFactory.newSentNotificationV1(
        mappedNotification as BffNewNotificationRequest
      );
      return response.data as NewNotificationResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
