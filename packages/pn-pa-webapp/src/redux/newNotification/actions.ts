import _ from 'lodash';

import { calcUnit8Array, performThunkAction } from '@pagopa-pn/pn-commons';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
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
}
export const getUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  NEW_NOTIFICATION_ACTIONS.GET_USER_GROUPS,
  performThunkAction((status: GroupStatus | undefined) => NotificationsApi.getUserGroups(status))
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
    const presignedUrls = await NotificationsApi.preloadNotificationDocument(
      items.map((item) => ({ contentType: item.contentType, key: item.key, sha256: item.sha256 }))
    );
    if (presignedUrls.length) {
      const uploadDocumentCalls: Array<Promise<string>> = [];
      // upload document
      presignedUrls.forEach((presigneUrl, index) => {
        /* eslint-disable-next-line functional/immutable-data */
        uploadDocumentCalls.push(
          NotificationsApi.uploadNotificationAttachment(
            presigneUrl.url,
            items[index].sha256,
            presigneUrl.secret,
            items[index].file as Uint8Array,
            presigneUrl.httpMethod
          )
        );
      });
      const documentsToken = await Promise.all(uploadDocumentCalls);
      return items.reduce((obj, item, index) => {
        /* eslint-disable-next-line functional/immutable-data */
        obj[item.id] = {
          key: presignedUrls[index].key,
          versionToken: documentsToken[index],
        };
        return obj;
      }, {} as UploadDocumentsResponse);
    }
    throw new Error();
  } catch (e) {
    throw new Error(e as any);
  }
};

export const uploadNotificationAttachment = createAsyncThunk<
  Array<NewNotificationDocument>,
  Array<NewNotificationDocument>
>(
  'uploadNotificationAttachment',
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
      return rejectWithValue(e);
    }
  }
);

const getPaymentDocumentsToUpload = (items: {
  [key: string]: PaymentObject;
}): Array<Promise<UploadDocumentParams>> => {
  const documentsArr: Array<Promise<UploadDocumentParams>> = [];
  for (const item of Object.values(items)) {
    /* eslint-disable functional/immutable-data */
    if (item.pagoPaForm && !item.pagoPaForm.ref.key && !item.pagoPaForm.ref.versionToken) {
      documentsArr.push(createPayloadToUpload(item.pagoPaForm));
    }
    if (item.f24flatRate && !item.f24flatRate.ref.key && !item.f24flatRate.ref.versionToken) {
      documentsArr.push(createPayloadToUpload(item.f24flatRate));
    }
    if (item.f24standard && !item.f24standard.ref.key && !item.f24standard.ref.versionToken) {
      documentsArr.push(createPayloadToUpload(item.f24standard));
    }
    /* eslint-enable functional/immutable-data */
  }
  return documentsArr;
};

export const uploadNotificationPaymentDocument = createAsyncThunk<
  { [key: string]: PaymentObject },
  { [key: string]: PaymentObject }
>(
  'uploadNotificationPaymentDocument',
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
        if (item.pagoPaForm && documentsUploaded[item.pagoPaForm.id]) {
          item.pagoPaForm.ref.key = documentsUploaded[item.pagoPaForm.id].key;
          item.pagoPaForm.ref.versionToken = documentsUploaded[item.pagoPaForm.id].versionToken;
        }
        if (item.f24flatRate && documentsUploaded[item.f24flatRate.id]) {
          item.f24flatRate.ref.key = documentsUploaded[item.f24flatRate.id].key;
          item.f24flatRate.ref.versionToken = documentsUploaded[item.f24flatRate.id].versionToken;
        }
        if (item.f24standard && documentsUploaded[item.f24standard.id]) {
          item.f24standard.ref.key = documentsUploaded[item.f24standard.id].key;
          item.f24standard.ref.versionToken = documentsUploaded[item.f24standard.id].versionToken;
        }
        /* eslint-enable functional/immutable-data */
      }
      return updatedItems;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const createNewNotification = createAsyncThunk<NewNotificationResponse, NewNotification>(
  'createNewNotification',
  performThunkAction(async (notification: NewNotification) => {
    const mappedNotification = newNotificationMapper(notification);
    return await NotificationsApi.createNewNotification(mappedNotification);
  })
);
