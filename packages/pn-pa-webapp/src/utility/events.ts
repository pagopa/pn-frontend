import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  NOTIFICATIONS_CHANGE_PAGE = 'setPagination',
  NOTIFICATION_FILTER_TYPE = 'NOTIFICATION_FILTER_TYPE',
  NOTIFICATION_FILTER_DATE = 'NOTIFICATION_FILTER_DATE',
  NOTIFICATION_FILTER_NOTIFICATION_STATE = 'NOTIFICATION_FILTER_NOTIFICATION_STATE',
  NOTIFICATION_FILTER_CODE_VALIDATION_RATE = 'NOTIFICATION_FILTER_CODE_VALIDATION_RATE',
  NOTIFICATION_FILTER_SEARCH = 'NOTIFICATION_FILTER_SEARCH',
  NOTIFICATION_FILTER_REMOVE = 'NOTIFICATION_FILTER_REMOVE',
  NOTIFICATION_DETAIL_CANCEL_NOTIFICATION = 'NOTIFICATION_DETAIL_CANCEL_NOTIFICATION',
  NOTIFICATION_DETAIL_CONFIRM_CANCEL_NOTIFICATION = 'setCancelledIun/fulfilled',
  NOTIFICATION_DETAIL_ALL_ATTACHMENTS = 'NOTIFICATION_DETAIL_ALL_ATTACHMENTS',
  NOTIFICATION_DETAIL_SINGLE_ATTACHMENT = 'getSentNotificationDocument/fulfilled',
  NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE = 'NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE',
  NOTIFICATION_SEND = 'NOTIFICATION_SEND',
  NOTIFICATION_SEND_DELIVERY_MODE = 'NOTIFICATION_SEND_DELIVERY_MODE',
  NOTIFICATION_SEND_PAYMENT_MODE = 'NOTIFICATION_SEND_PAYMENT_MODE',
  NOTIFICATION_SEND_PRELIMINARY_INFO = 'NOTIFICATION_SEND_PRELIMINARY_INFO',
  NOTIFICATION_SEND_RECIPIENT_TYPE = 'NOTIFICATION_SEND_RECIPIENT_TYPE',
  NOTIFICATION_SEND_PHYSICAL_ADDRESS = 'NOTIFICATION_SEND_PHYSICAL_ADDRESS',
  NOTIFICATION_SEND_DIGITAL_DOMICILE = 'NOTIFICATION_SEND_DIGITAL_DOMICILE',
  NOTIFICATION_SEND_MULTIPLE_RECIPIENTS = 'NOTIFICATION_SEND_MULTIPLE_RECIPIENTS',
  NOTIFICATION_SEND_RECIPIENT_INFO = 'NOTIFICATION_SEND_RECIPIENT_INFO',
  NOTIFICATION_SEND_ATTACHMENTS = 'NOTIFICATION_SEND_ATTACHMENTS',
  NOTIFICATION_SEND_PAYMENT_MODES = 'NOTIFICATION_SEND_PAYMENT_MODES',
  NOTIFICATION_SEND_EXIT_WARNING = 'NOTIFICATION_SEND_EXIT_WARNING',
  NOTIFICATION_SEND_EXIT_FLOW = 'NOTIFICATION_SEND_EXIT_FLOW',
  NOTIFICATION_SEND_EXIT_CANCEL = 'NOTIFICATION_SEND_EXIT_CANCEL',
  NOTIFICATION_TABLE_SORT = 'NOTIFICATION_TABLE_SORT',
  NOTIFICATION_TABLE_ROW_INTERACTION = 'NOTIFICATION_TABLE_ROW_INTERACTION',
  NOTIFICATION_TABLE_ROW_TOOLTIP = 'NOTIFICATION_TABLE_ROW_TOOLTIP',
  NOTIFICATION_TABLE_SIZE = 'NOTIFICATION_TABLE_SIZE',
  NOTIFICATION_TABLE_PAGINATION = 'NOTIFICATION_TABLE_PAGINATION',
  NOTIFICATION_TIMELINE_ALL_ATTACHMENTS = 'NOTIFICATION_TIMELINE_ALL_ATTACHMENTS',
  NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT = 'getSentNotificationLegalfact/fulfilled',
  NOTIFICATION_TIMELINE_VIEW_MORE = 'NOTIFICATION_TIMELINE_VIEW_MORE',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO',
  CUSTOMER_CARE_CONTACT = 'CUSTOMER_CARE_CONTACT',
  CUSTOMER_CARE_CONTACT_SUCCESS = 'CUSTOMER_CARE_CONTACT_SUCCESS',
  CUSTOMER_CARE_CONTACT_FAILURE = 'CUSTOMER_CARE_CONTACT_FAILURE',
  APP_CRASH = 'APP_CRASH',
  APP_UNLOAD = 'APP_UNLOAD',
  USER_PRODUCT_SWITCH = 'USER_PRODUCT_SWITCH',
  USER_PARTY_SWITCH = 'USER_PARTY_SWITCH',
  USER_LOGOUT = 'logout/fulfilled',
  USER_NAV_ITEM = 'USER_NAV_ITEM',
  APIKEYS_TABLE_PAGINATION = 'APIKEYS_TABLE_PAGINATION',
  APIKEYS_TABLE_SIZE = 'APIKEYS_TABLE_SIZE',
  SEND_DOWNLOAD_RECEIPT_NOTICE = 'SEND_DOWNLOAD_RECEIPT_NOTICE',
  SEND_DOWNLOAD_ATTACHMENT = 'SEND_DOWNLOAD_ATTACHMENT',
}

export const events: EventsType = {
  [TrackEventType.NOTIFICATIONS_CHANGE_PAGE]: {
    event_category: 'notifications',
    event_type: 'change page',
  },
  [TrackEventType.NOTIFICATION_FILTER_TYPE]: {
    event_category: 'notifications',
    event_type: 'filter by type',
  },
  [TrackEventType.NOTIFICATION_FILTER_DATE]: {
    event_category: 'notifications',
    event_type: 'filter by date',
  },
  [TrackEventType.NOTIFICATION_FILTER_NOTIFICATION_STATE]: {
    event_category: 'notifications',
    event_type: 'filter by notification status',
  },
  [TrackEventType.NOTIFICATION_FILTER_CODE_VALIDATION_RATE]: {
    event_category: 'notifications',
    event_type: 'filter validation code',
  },
  [TrackEventType.NOTIFICATION_FILTER_SEARCH]: {
    event_category: 'notifications',
    event_type: 'click on filter search',
  },
  [TrackEventType.NOTIFICATION_FILTER_REMOVE]: {
    event_category: 'notifications',
    event_type: 'click on remove filters',
  },
  [TrackEventType.NOTIFICATION_DETAIL_CANCEL_NOTIFICATION]: {
    event_category: 'notifications',
    event_type: 'cancel notification',
  },
  [TrackEventType.NOTIFICATION_DETAIL_CONFIRM_CANCEL_NOTIFICATION]: {
    event_category: 'notifications',
    event_type: 'confirm cancel notification',
  },
  [TrackEventType.NOTIFICATION_DETAIL_ALL_ATTACHMENTS]: {
    event_category: 'notifications',
    event_type: 'detail all attachments',
  },
  [TrackEventType.NOTIFICATION_DETAIL_SINGLE_ATTACHMENT]: {
    event_category: 'notifications',
    event_type: 'detail single attachment',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE]: {
    event_category: 'notification',
    event_type: 'download the PagoPA file',
  },
  [TrackEventType.NOTIFICATION_SEND]: {
    event_category: 'notifications',
    event_type: 'send notification',
  },
  [TrackEventType.NOTIFICATION_SEND_DELIVERY_MODE]: {
    event_category: 'notifications',
    event_type: 'delivery mode',
  },
  [TrackEventType.NOTIFICATION_SEND_PAYMENT_MODE]: {
    event_category: 'notifications',
    event_type: 'payment mode',
  },
  [TrackEventType.NOTIFICATION_SEND_PRELIMINARY_INFO]: {
    event_category: 'notifications',
    event_type: 'preliminary info',
  },
  [TrackEventType.NOTIFICATION_SEND_RECIPIENT_TYPE]: {
    event_category: 'notifications',
    event_type: 'recipient type',
  },
  [TrackEventType.NOTIFICATION_SEND_PHYSICAL_ADDRESS]: {
    event_category: 'notifications',
    event_type: 'phsycal address',
  },
  [TrackEventType.NOTIFICATION_SEND_DIGITAL_DOMICILE]: {
    event_category: 'notifications',
    event_type: 'digital domicile',
  },
  [TrackEventType.NOTIFICATION_SEND_MULTIPLE_RECIPIENTS]: {
    event_category: 'notifications',
    event_type: 'multiple recipients',
  },
  [TrackEventType.NOTIFICATION_SEND_RECIPIENT_INFO]: {
    event_category: 'notifications',
    event_type: 'recipient info',
  },
  [TrackEventType.NOTIFICATION_SEND_ATTACHMENTS]: {
    event_category: 'notifications',
    event_type: 'attachments',
  },
  [TrackEventType.NOTIFICATION_SEND_PAYMENT_MODES]: {
    event_category: 'notifications',
    event_type: 'payments mode',
  },
  [TrackEventType.NOTIFICATION_SEND_EXIT_WARNING]: {
    event_category: 'notifications',
    event_type: 'confirm cancel send notification',
  },
  [TrackEventType.NOTIFICATION_SEND_EXIT_FLOW]: {
    event_category: 'notifications',
    event_type: 'cancel send notification',
  },
  [TrackEventType.NOTIFICATION_SEND_EXIT_CANCEL]: {
    event_category: 'notifications',
    event_type: 'abort cancel notification',
  },
  [TrackEventType.NOTIFICATION_TABLE_SORT]: {
    event_category: 'notifications',
    event_type: 'sorting table',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION]: {
    event_category: 'notifications',
    event_type: 'click on row table',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP]: {
    event_category: 'notifications',
    event_type: 'open table row tooltip',
  },
  [TrackEventType.NOTIFICATION_TABLE_SIZE]: {
    event_category: 'notifications',
    event_type: 'table rows per page',
  },
  [TrackEventType.NOTIFICATION_TABLE_PAGINATION]: {
    event_category: 'notifications',
    event_type: 'table pagination',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_ALL_ATTACHMENTS]: {
    event_category: 'notifications',
    event_type: 'timeline all attachments',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT]: {
    event_category: 'notifications',
    event_type: 'single single attachment',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE]: {
    event_category: 'notifications',
    event_type: 'timeline view mode',
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    event_category: 'customer care',
    event_type: 'click on customer care email',
  },
  [TrackEventType.CUSTOMER_CARE_CONTACT]: {
    event_category: 'customer care',
    event_type: 'click on customer care form',
  },
  [TrackEventType.CUSTOMER_CARE_CONTACT_SUCCESS]: {
    event_category: 'customer care',
    event_type: 'send customer care form success',
  },
  [TrackEventType.CUSTOMER_CARE_CONTACT_FAILURE]: {
    event_category: 'customer care',
    event_type: 'send customer care form failed',
  },
  [TrackEventType.APP_CRASH]: {
    event_category: 'app',
    event_type: 'app crashed',
  },
  [TrackEventType.APP_UNLOAD]: {
    event_category: 'app',
    event_type: 'app unloaded',
  },
  [TrackEventType.USER_PRODUCT_SWITCH]: {
    event_category: 'user',
    event_type: 'switch product',
  },
  [TrackEventType.USER_PARTY_SWITCH]: {
    event_category: 'user',
    event_type: 'switch ente',
  },
  [TrackEventType.USER_LOGOUT]: {
    event_category: 'user',
    event_type: 'user logout',
  },
  [TrackEventType.USER_NAV_ITEM]: {
    event_category: 'user',
    event_type: 'user menu navigation',
  },
  [TrackEventType.APIKEYS_TABLE_PAGINATION]: {
    event_category: 'apikeys',
    event_type: 'table pagination',
  },
  [TrackEventType.APIKEYS_TABLE_SIZE]: {
    event_category: 'apikeys',
    event_type: 'table rows per page',
  },
};
