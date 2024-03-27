import {
  GetNotificationsParams,
  LegalFactId,
  NotificationDetailOtherDocument,
  compileRoute,
  formatFiscalCode,
} from '@pagopa-pn/pn-commons';

// Prefixes
const API_DELIVERY_PREFIX = 'delivery';
const API_DELIVERY_PUSH_PREFIX = 'delivery-push';
const API_EXTERNAL_REGISTRY_PREFIX = 'ext-registry';

// Segments
const API_VERSION_SEGMENT = 'v1';
const API_VERSION_V2_1_SEGMENT = 'v2.1';
const API_VERSION_V2_3_SEGMENT = 'v2.3';
const API_NOTIFICATIONS_BASE = 'notifications';
const API_NOTIFICATIONS_RECEIVED = 'received';
const API_NOTIFICATIONS_DELEGATED = 'delegated';
const API_NOTIFICATIONS_DOCUMENTS = 'documents';
const API_NOTIFICATIONS_DOCUMENT = 'document';
const API_NOTIFICATIONS_LEGALFACTS = 'legal-facts';
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
const API_NOTIFICATIONS_GROUP_PARAMETER = 'group';
const API_NOTIFICATIONS_DOCUMENT_INDEX_PARAMETER = 'documentIndex';
const API_NOTIFICATIONS_LEGALFACT_TYPE_PARAMETER = 'legalfactType';
const API_NOTIFICATIONS_LEGALFACT_KEY_PARAMETER = 'legalfactKey';
const API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER = 'attachmentName';
const API_NOTIFICATIONS_OTHER_DOCUMENT_TYPE = 'documentType';

// Paths
const API_NOTIFICATIONS_RECEIVED_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_RECEIVED}`;
const API_NOTIFICATIONS_DELEGATOR_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_RECEIVED}/${API_NOTIFICATIONS_DELEGATED}`;
const API_NOTIFICATION_ID_FROM_QRCODE_PATH = `${API_NOTIFICATIONS_BASE}/${API_NOTIFICATIONS_RECEIVED}/${API_NOTIFICATIONS_FROM_QRCODE}`;
const API_NOTIFICATION_DETAIL_PATH = `${API_NOTIFICATIONS_RECEIVED_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}`;
const API_NOTIFICATION_DETAIL_DOCUMENT_PATH = `${API_NOTIFICATIONS_RECEIVED_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_DOCUMENTS}/:${API_NOTIFICATIONS_DOCUMENT_INDEX_PARAMETER}`;
const API_NOTIFICATION_DETAIL_OTHER_DOCUMENT_PATH = `:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_DOCUMENT}/:${API_NOTIFICATIONS_OTHER_DOCUMENT_TYPE}`;
const API_NOTIFICATION_DETAIL_LEGALFACT_PATH = `:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_LEGALFACTS}/:${API_NOTIFICATIONS_LEGALFACT_TYPE_PARAMETER}/:${API_NOTIFICATIONS_LEGALFACT_KEY_PARAMETER}`;
const API_NOTIFICATION_PAYMENT_ATTACHMENT_PATH = `${API_NOTIFICATIONS_RECEIVED_PATH}/:${API_NOTIFICATIONS_IUN_PARAMETER}/${API_NOTIFICATIONS_ATTACHMENTS}/${API_NOTIFICATIONS_PAYMENT}/:${API_NOTIFICATIONS_ATTACHMENT_NAME_PARAMETER}`;
const API_NOTIFICATION_PAYMENT_INFO_PATH = `${API_NOTIFICATIONS_PAGOPA}/${API_VERSION_V2_1_SEGMENT}/${API_NOTIFICATIONS_PAYMENTINFO}`;
const API_NOTIFICATION_PAYMENT_URL_PATH = `${API_NOTIFICATIONS_PAGOPA}/${API_VERSION_SEGMENT}/${API_NOTIFICATIONS_CHECKOUTCART}`;
// APIs
export function NOTIFICATIONS_LIST(params: GetNotificationsParams<string>, delegated?: boolean) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: !delegated ? API_NOTIFICATIONS_RECEIVED_PATH : API_NOTIFICATIONS_DELEGATOR_PATH,
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
      [API_NOTIFICATIONS_GROUP_PARAMETER]: params.group ? params.group : '',
    },
  });
}

export function NOTIFICATION_DETAIL(iun: string, mandateId?: string) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    version: API_VERSION_V2_3_SEGMENT,
    path: API_NOTIFICATION_DETAIL_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
    },
    query: {
      [API_NOTIFICATIONS_MANDATE_ID_PARAMETER]: mandateId || '',
    },
  });
}

export function NOTIFICATION_ID_FROM_QRCODE() {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_ID_FROM_QRCODE_PATH,
  });
}

export function NOTIFICATION_DETAIL_DOCUMENTS(
  iun: string,
  documentIndex: string,
  mandateId?: string
) {
  return compileRoute({
    prefix: API_DELIVERY_PREFIX,
    path: API_NOTIFICATION_DETAIL_DOCUMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_DOCUMENT_INDEX_PARAMETER]: documentIndex,
    },
    query: {
      [API_NOTIFICATIONS_MANDATE_ID_PARAMETER]: mandateId || '',
    },
  });
}

export function NOTIFICATION_DETAIL_OTHER_DOCUMENTS(
  iun: string,
  otherDocument: NotificationDetailOtherDocument
) {
  return compileRoute({
    prefix: API_DELIVERY_PUSH_PREFIX,
    path: API_NOTIFICATION_DETAIL_OTHER_DOCUMENT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_OTHER_DOCUMENT_TYPE]: otherDocument.documentType,
    },
  });
}

export function NOTIFICATION_DETAIL_LEGALFACT(
  iun: string,
  legalFact: LegalFactId,
  mandateId?: string
) {
  return compileRoute({
    prefix: API_DELIVERY_PUSH_PREFIX,
    path: API_NOTIFICATION_DETAIL_LEGALFACT_PATH,
    params: {
      [API_NOTIFICATIONS_IUN_PARAMETER]: iun,
      [API_NOTIFICATIONS_LEGALFACT_TYPE_PARAMETER]: legalFact.category,
      [API_NOTIFICATIONS_LEGALFACT_KEY_PARAMETER]: legalFact.key,
    },
    query: {
      [API_NOTIFICATIONS_MANDATE_ID_PARAMETER]: mandateId || '',
    },
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
      [API_NOTIFICATIONS_MANDATE_ID_PARAMETER]: mandateId || '',
      [API_NOTIFICATIONS_ATTACHMENT_IDX_PARAMETER]: attachmentIdx || '',
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
