import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { PhysicalCommunicationType, NotificationDetailDocument } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import {
  PaymentModel,
  NewNotificationFe,
  NewNotificationResponse,
  FormRecipient,
  UploadAttachmentParams,
  UploadPayementParams,
  UpaloadPaymentResponse,
} from '../../models/NewNotification';

export const setCancelledIun = createAction<string>('setCancelledIun');

export const setSenderInfos = createAction<{senderDenomination: string; senderTaxId: string}>('setSenderInfos');

export const setPreliminaryInformations = createAction<{
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentMode: PaymentModel;
}>('setPreliminaryInformations');

export const saveRecipients = createAction<{recipients: Array<FormRecipient>}>('saveRecipients');
export const setRecipients = createAction<{recipients: Array<FormRecipient>}>('setRecipients');

const uploadNotificationDocumentCbk = async (items: Array<UploadAttachmentParams>) => {
  try {
    const presignedUrls = await NotificationsApi.preloadNotificationDocument(items.map(item => ({contentType: item.contentType, key: item.key, sha256: item.sha256})));
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
        title: item.key
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
  UpaloadPaymentResponse,
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
    const response: UpaloadPaymentResponse = {};
    const getFile = (item: UploadAttachmentParams) => {
      if (item.file && item.sha256) {
        return documentsUploaded.find(
          (f) => f.digests.sha256 === item.sha256
        );
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
