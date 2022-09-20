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
  FOOTER_ACCESSIBILITY = 'FOOTER_ACCESSIBILITY',
  FOOTER_LANG_SWITCH = 'FOOTER_LANG_SWITCH',
}

export const events: EventsType = {
  [TrackEventType.NOTIFICATIONS_CHANGE_PAGE]: {
    category: 'notifications',
    action: 'change page',
  },
  [TrackEventType.NOTIFICATION_FILTER_TYPE]: {
    category: 'notifications',
    action: 'filter by type',
  },
  [TrackEventType.NOTIFICATION_FILTER_DATE]: {
    category: 'notifications',
    action: 'filter by date',
  },
  [TrackEventType.NOTIFICATION_FILTER_NOTIFICATION_STATE]: {
    category: 'notifications',
    action: 'filter by notification status',
  },
  [TrackEventType.NOTIFICATION_FILTER_CODE_VALIDATION_RATE]: {
    category: 'notifications',
    action: 'filter validation code',
  },
  [TrackEventType.NOTIFICATION_FILTER_SEARCH]: {
    category: 'notifications',
    action: 'click on filter search',
  },
  [TrackEventType.NOTIFICATION_FILTER_REMOVE]: {
    category: 'notifications',
    action: 'click on remove filters',
  },
  [TrackEventType.NOTIFICATION_DETAIL_CANCEL_NOTIFICATION]: {
    category: 'notifications',
    action: 'cancel notification',
  },
  [TrackEventType.NOTIFICATION_DETAIL_CONFIRM_CANCEL_NOTIFICATION]: {
    category: 'notifications',
    action: 'confirm cancel notification',
  },
  [TrackEventType.NOTIFICATION_DETAIL_ALL_ATTACHMENTS]: {
    category: 'notifications',
    action: 'detail all attachments',
  },
  [TrackEventType.NOTIFICATION_DETAIL_SINGLE_ATTACHMENT]: {
    category: 'notifications',
    action: 'detail single attachment',
  },
  [TrackEventType.NOTIFICATION_SEND]: {
    category: 'notifications',
    action: 'send notification',
  },
  [TrackEventType.NOTIFICATION_SEND_DELIVERY_MODE]: {
    category: 'notifications',
    action: 'delivery mode',
  },
  [TrackEventType.NOTIFICATION_SEND_PAYMENT_MODE]: {
    category: 'notifications',
    action: 'payment mode',
  },
  [TrackEventType.NOTIFICATION_SEND_PRELIMINARY_INFO]: {
    category: 'notifications',
    action: 'preliminary info',
  },
  [TrackEventType.NOTIFICATION_SEND_RECIPIENT_TYPE]: {
    category: 'notifications',
    action: 'recipient type',
  },
  [TrackEventType.NOTIFICATION_SEND_PHYSICAL_ADDRESS]: {
    category: 'notifications',
    action: 'phsycal address',
  },
  [TrackEventType.NOTIFICATION_SEND_DIGITAL_DOMICILE]: {
    category: 'notifications',
    action: 'digital domicile',
  },
  [TrackEventType.NOTIFICATION_SEND_MULTIPLE_RECIPIENTS]: {
    category: 'notifications',
    action: 'multiple recipients',
  },
  [TrackEventType.NOTIFICATION_SEND_RECIPIENT_INFO]: {
    category: 'notifications',
    action: 'recipient info',
  },
  [TrackEventType.NOTIFICATION_SEND_ATTACHMENTS]: {
    category: 'notifications',
    action: 'attachments',
  },
  [TrackEventType.NOTIFICATION_SEND_PAYMENT_MODES]: {
    category: 'notifications',
    action: 'payments mode',
  },
  [TrackEventType.NOTIFICATION_SEND_EXIT_WARNING]: {
    category: 'notifications',
    action: 'confirm cancel send notification',
  },
  [TrackEventType.NOTIFICATION_SEND_EXIT_FLOW]: {
    category: 'notifications',
    action: 'cancel send notification',
  },
  [TrackEventType.NOTIFICATION_SEND_EXIT_CANCEL]: {
    category: 'notifications',
    action: 'abort cancel notification',
  },
  [TrackEventType.NOTIFICATION_TABLE_SORT]: {
    category: 'notifications',
    action: 'sorting table',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION]: {
    category: 'notifications',
    action: 'click on row table',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_TOOLTIP]: {
    category: 'notifications',
    action: 'open table row tooltip',
  },
  [TrackEventType.NOTIFICATION_TABLE_SIZE]: {
    category: 'notifications',
    action: 'table rows per page',
  },
  [TrackEventType.NOTIFICATION_TABLE_PAGINATION]: {
    category: 'notifications',
    action: 'table pagination',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_ALL_ATTACHMENTS]: {
    category: 'notifications',
    action: 'timeline all attachments',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT]: {
    category: 'notifications',
    action: 'single single attachment',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE]: {
    category: 'notifications',
    action: 'timeline view mode',
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    category: 'customer care',
    action: 'click on customer care email',
  },
  [TrackEventType.CUSTOMER_CARE_CONTACT]: {
    category: 'customer care',
    action: 'click on customer care form',
  },
  [TrackEventType.CUSTOMER_CARE_CONTACT_SUCCESS]: {
    category: 'customer care',
    action: 'send customer care form success',
  },
  [TrackEventType.CUSTOMER_CARE_CONTACT_FAILURE]: {
    category: 'customer care',
    action: 'send customer care form failed',
  },
  [TrackEventType.APP_CRASH]: {
    category: 'app',
    action: 'app crashed',
  },
  [TrackEventType.APP_UNLOAD]: {
    category: 'app',
    action: 'app unloaded',
  },
  [TrackEventType.USER_PRODUCT_SWITCH]: {
    category: 'user',
    action: 'switch product',
  },
  [TrackEventType.USER_PARTY_SWITCH]: {
    category: 'user',
    action: 'switch ente',
  },
  [TrackEventType.USER_LOGOUT]: {
    category: 'user',
    action: 'user logout',
  },
  [TrackEventType.USER_NAV_ITEM]: {
    category: 'user',
    action: 'user menu navigation',
  },
  [TrackEventType.FOOTER_ACCESSIBILITY]: {
    category: 'footer',
    action: 'click on app accessibility',
  },
  [TrackEventType.FOOTER_LANG_SWITCH]: {
    category: 'footer',
    action: 'click on app language option',
  },
};
