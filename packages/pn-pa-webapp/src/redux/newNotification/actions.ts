import _ from 'lodash';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationDetailDocument } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import {
  NewNotificationResponse,
  NewNotificationAttachment,
  PaymentObject,
  NewNotification,
} from '../../models/NewNotification';
import { GroupStatus, UserGroup } from '../../models/user';
import { UploadAttachmentParams, UploadPayementParams, UploadPaymentResponse } from './types';

export const getUserGroups = createAsyncThunk<Array<UserGroup>, GroupStatus | undefined>(
  'getUserGroups',
  async (status: GroupStatus | undefined, { rejectWithValue }) => {
    try {
      return await NotificationsApi.getUserGroups(status);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const uploadNotificationDocumentCbk = async (items: Array<UploadAttachmentParams>) => {
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
      return items.map((item, index) => ({
        digests: {
          sha256: item.sha256,
        },
        contentType: item.contentType,
        ref: {
          key: presignedUrls[index].key,
          versionToken: documentsToken[index],
        },
        title: item.key,
      }));
    }
    throw new Error();
  } catch (e) {
    throw new Error(e as any);
  }
};

export const uploadNotificationAttachment = createAsyncThunk<
  Array<NotificationDetailDocument>,
  Array<UploadAttachmentParams>
>(
  'uploadNotificationAttachment',
  async (items: Array<UploadAttachmentParams>, { rejectWithValue }) => {
    try {
      return await uploadNotificationDocumentCbk(items);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const uploadNotificationPaymentDocument = createAsyncThunk<
  UploadPaymentResponse,
  UploadPayementParams
>('uploadNotificationPaymentDocument', async (items: UploadPayementParams, { rejectWithValue }) => {
  try {
    const documentsToUpload = Object.values(items).reduce((arr, item) => {
      /* eslint-disable functional/immutable-data */
      arr.push(item.pagoPaForm);
      if (item.f24flatRate.file && item.f24flatRate.sha256) {
        arr.push(item.f24flatRate);
      }
      if (item.f24standard.file && item.f24standard.sha256) {
        arr.push(item.f24standard);
      }
      /* eslint-enable functional/immutable-data */
      return arr;
    }, [] as Array<UploadAttachmentParams>);
    const documentsUploaded = await uploadNotificationDocumentCbk(
      _.uniqWith(documentsToUpload, (a, b) => a.sha256 === b.sha256)
    );
    const response: UploadPaymentResponse = {};
    const getFile = (item: UploadAttachmentParams) => {
      if (item.file && item.sha256) {
        return documentsUploaded.find((f) => f.digests.sha256 === item.sha256);
      }
      return undefined;
    };
    for (const [key, item] of Object.entries(items)) {
      /* eslint-disable functional/immutable-data */
      const pagoPaFile = getFile(item.pagoPaForm);
      if (!pagoPaFile) {
        throw new Error('Invalid file for pagoPa document');
      }
      response[key] = { pagoPaForm: pagoPaFile };
      response[key].f24flatRate = getFile(item.f24flatRate);
      response[key].f24standard = getFile(item.f24standard);
      /* eslint-enable functional/immutable-data */
    }
    return response;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const createNewNotification = createAsyncThunk<NewNotificationResponse, NewNotification>(
  'createNewNotification',
  async (notification: NewNotification, { rejectWithValue }) => {
    try {
      return await NotificationsApi.createNewNotification(notification);
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const setAttachments = createAction<{ documents: Array<NewNotificationAttachment> }>('setAttachments');

export const setPaymentDocuments =
  createAction<{ paymentMethodsDocuments: { [key: string]: PaymentObject } }>(
    'setPaymentDocuments'
  );
