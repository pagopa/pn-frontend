import _ from 'lodash';

import { GetNotificationsParams, compileRoute, formatFiscalCode } from '@pagopa-pn/pn-commons';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';
const API_EXTERNAL_REGISTRY_PREFIX = 'ext-registry';

// Segments
const API_VERSION_SEGMENT = 'v1';
const API_VERSION_V2_1_SEGMENT = 'v2.1';
const API_NOTIFICATIONS_BASE = 'notifications';
const API_NOTIFICATIONS_RECEIVED = 'received';
const API_NOTIFICATIONS_ATTACHMENTS = 'attachments';
const API_NOTIFICATIONS_PAYMENT = 'payment';
const API_NOTIFICATIONS_PAGOPA = 'pagopa';
const API_NOTIFICATIONS_PAYMENTINFO = 'paymentinfo';
const API_NOTIFICATIONS_FROM_QRCODE = 'check-aar-qr-code';
const API_NOTIFICATIONS_CHECKOUTCART = 'checkout-cart';

// Parameters
const API_NOTIFICATIONS_START_DATE_PARAMETER = 'startDate';
const API_NOTIFICATIONS_END_DATE_PARAMETER = 'endDate';
const API_NOTIFICATIONS_RECIPIENT_ID_PARAMETER = 'recipientId';
const API_NOTIFICATIONS_STATUS_PARAMETER = 'status';
const API_NOTIFICATIONS_SUBJECT_PARAMETER = 'subjectRegExp';
const API_NOTIFICATIONS_SIZE_PARAMETER = 'size';
const API_NOTIFICATIONS_NEXT_PAGES_KEY_PARAMETER = 'nextPagesKey';
const API_NOTIFICATIONS_IUN_MATCH_PARAMETER = 'iunMatch';
const API_NOTIFICATIONS_MANDATE_ID_PARAMETER = 'mandateId';
const API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER = 'attachmentIdx';
const API_NOTIFICATIONS_IUN_PARAMETER = 'iun';
const API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER = 'attachmentName';

// Paths
const API_NOTIFICATIONS_RECEIVED_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_RECEIVED}`;
const API_NOTIFICATION_ID_FROM_QRCODE_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_RECEIVED}/${API_NOTIFICATIONS_FROM_QRCODE}`;
const API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH = `${API_NOTIFICATIONS_RECEIVED_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PAYMENT}/:${API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER}`;
const API_NOTIFICATION_PAYMENT_INFO_PATH = `${API_NOTIFICATIONS_PAGOPA}/${API_VERSION_V2_1_SEGMENT}/${API_NOTIFICATIONS_PAYMENTINFO}`;
const API_NOTIFICATION_PAYMENT_URL_PATH = `${API_NOTIFICATIONS_PAGOPA}/${API_VERSION_SEGMENT}/${API_NOTIFICATIONS_CHECKOUTCART}`;

// APIs
export function NOTIFICATIONS_LIST(params: GetNotificationsParams<string>) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATIONS_RECEIVED_PATH,
    query: {
      [API_NOTIFICATIONS_START_DATE_PARAMETER]: params.startDate,
      [API_NOTIFICATIONS_END_DATE_PARAMETER]: params.endDate,
      [API_NOTIFICATIONS_RECIPIENT_ID_PARAMETER]: params.recipientId
        ? formatFiscalCode(params.recipientId)
        : '',
      [API_NOTIFICATIONS_STATUS_PARAMETER]: params.status || '',
      [API_NOTIFICATIONS_SUBJECT_PARAMETER]: params.subjectRegExp || '',
      [API_NOTIFICATIONS_SIZE_PARAMETER]: params.size ? params.size.toString() : '',
      [API_NOTIFICATIONS_NEXT_PAGES_KEY_PARAMETER]: params.nextPagesKey || '',
      [API_NOTIFICATIONS_IUN_MATCH_PARAMETER]: params.iunMatch || '',
      [API_NOTIFICATIONS_MANDATE_ID_PARAMETER]: params.mandateId || '',
    },
  });
}

export function NOTIFICATION_ID_FROM_QRCODE() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_ID_FROM_QRCODE_PATH,
  });
}

export function NOTIFICATION_PAYMENT_ATTACHMENT(
  iun: string,
  attachmentName: string,
  mandateId?: string,
  attachmentIdx?: number
) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER]: attachmentName,
    },
    query: {
      [API_NOTIFICATIONS_MANDATE_ID_PARAMETER]: mandateId ?? '',
      [API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER]: !_.isNil(attachmentIdx)
        ? attachmentIdx.toString()
        : '',
    },
  });
}

export function NOTIFICATION_PAYMENT_INFO() {
  return compileRoute({
    prefix: API_EXTERNAL_REGISTRY_PREFIX,
    path: API_NOTIFICATION_PAYMENT_INFO_PATH,
  });
}

export function NOTIFICATION_PAYMENT_URL() {
  return compileRoute({
    prefix: API_EXTERNAL_REGISTRY_PREFIX,
    path: API_NOTIFICATION_PAYMENT_URL_PATH,
  });
}
