import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { FormikValues } from 'formik';
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../api/notifications/Notifications.api';
import {
  NewNotificationDocument,
  UploadAttachmentParams,
  UploadPayementParams,
  PaymentModel,
  UpaloadPaymentResponse,
} from '../../models/newNotification';

export const setCancelledIun = createAction<string>('setCancelledIun');

export const setPreliminaryInformations = createAction<{
  paProtocolNumber: string;
  subject: string;
  abstract?: string;
  physicalCommunicationType: PhysicalCommunicationType;
  group?: string;
  paymentMode: PaymentModel;
}>('setPreliminaryInformations');

export const saveRecipients = createAction<FormikValues>('saveRecipients');

const uploadNotificationDocumentCbk = async (items: Array<UploadAttachmentParams>) => {
  try {
    const presignedUrls = await NotificationsApi.preloadNotificationDocument(items);
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
            items[index].fileBase64
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
          key: item.key,
          versionToken: documentsToken[index],
        },
      }));
    }
    throw new Error();
  } catch (e) {
    throw new Error(e as any);
  }
};

export const uploadNotificationAttachment = createAsyncThunk<
  Array<NewNotificationDocument>,
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
      if (item.f24flatRate.fileBase64 && item.f24flatRate.sha256) {
        arr.push(item.f24flatRate);
      }
      if (item.f24standard.fileBase64 && item.f24standard.sha256) {
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
      if (item.fileBase64 && item.sha256) {
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

export const resetNewNotificationState = createAction<void>('resetNewNotificationState');
