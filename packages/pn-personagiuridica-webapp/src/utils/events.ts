import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  APP_CRASH = 'APP_CRASH',
  APP_UNLOAD = 'APP_UNLOAD',
  CONTACT_LEGAL_CONTACT = 'CONTACT_LEGAL_CONTACT',
  CONTACT_MAIL_COURTESY = 'CONTACT_MAIL_COURTESY',
  CONTACT_SPECIAL_CONTACTS = 'CONTACT_SPECIAL_CONTACTS',
  CONTACT_TEL_COURTESY = 'CONTACT_TEL_COURTESY',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO',
  DELEGATION_DELEGATE_ADD_ACTION = 'DELEGATION_DELEGATE_ADD_ACTION',
  DELEGATION_DELEGATE_ADD_CTA = 'DELEGATION_DELEGATE_ADD_CTA',
  DELEGATION_DELEGATE_ADD_ERROR = 'delegationsSlice/createDelegation/rejected',
  DELEGATION_DELEGATE_REVOKE = 'DELEGATION_DELEGATE_REVOKE',
  DELEGATION_DELEGATE_VIEW_CODE = 'DELEGATION_DELEGATE_VIEW_CODE',
  DELEGATION_DELEGATOR_ACCEPT = 'delegationsSlice/openAcceptModal',
  DELEGATION_DELEGATOR_REJECT = 'DELEGATION_DELEGATOR_REJECT',
  DIGITAL_DOMICILE_BANNER_CLOSE = 'DIGITAL_DOMICILE_BANNER_CLOSE',
  DIGITAL_DOMICILE_LINK = 'DIGITAL_DOMICILE_LINK',
  FOOTER_ACCESSIBILITY = 'FOOTER_ACCESSIBILITY',
  FOOTER_LANG_SWITCH = 'FOOTER_LANG_SWITCH',
  NOTIFICATION_DETAIL_ALL_ATTACHMENTS = 'NOTIFICATION_DETAIL_ALL_ATTACHMENTS',
  NOTIFICATION_DETAIL_HELP_BOX = 'NOTIFICATION_DETAIL_HELP_BOX',
  NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE = 'NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE',
  NOTIFICATION_DETAIL_PAYMENT_INTERACTION = 'NOTIFICATION_DETAIL_PAYMENT_INTERACTION',
  NOTIFICATION_DETAIL_PAYMENT_ERROR = 'getNotificationPaymentInfo/rejected',
  NOTIFICATION_DETAIL_PAYMENT_F24_FILE = 'NOTIFICATION_DETAIL_PAYMENT_F24_FILE',
  NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE = 'NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE',
  NOTIFICATION_DETAIL_PAYMENT_RELOAD = 'NOTIFICATION_DETAIL_PAYMENT_RELOAD',
  NOTIFICATION_DETAIL_SINGLE_ATTACHMENT = 'getReceivedNotificationDocument/fulfilled',
  NOTIFICATION_FILTER_REMOVE = 'NOTIFICATION_FILTER_REMOVE',
  NOTIFICATION_FILTER_SEARCH = 'NOTIFICATION_FILTER_SEARCH',
  NOTIFICATION_TIMELINE_ALL_ATTACHMENTS = 'NOTIFICATION_TIMELINE_ALL_ATTACHMENTS',
  NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT = 'getReceivedNotificationLegalfact/fulfilled',
  NOTIFICATION_TIMELINE_VIEW_MORE = 'NOTIFICATION_TIMELINE_VIEW_MORE',
  NOTIFICATION_TABLE_PAGINATION = 'NOTIFICATION_TABLE_PAGINATION',
  NOTIFICATION_TABLE_ROW_INTERACTION = 'NOTIFICATION_TABLE_ROW_INTERACTION',
  NOTIFICATION_TABLE_ROW_TOOLTIP = 'NOTIFICATION_TABLE_ROW_TOOLTIP',
  NOTIFICATION_TABLE_SIZE = 'NOTIFICATION_TABLE_SIZE',
  NOTIFICATION_TABLE_SORT = 'setSorting',
  USER_LOGOUT = 'logout/fulfilled',
  USER_NAV_ITEM = 'USER_NAV_ITEM',
  USER_PRODUCT_SWITCH = 'USER_PRODUCT_SWITCH',
  USER_VIEW_CONTACTS_PROFILE = 'USER_VIEW_CONTACTS_PROFILE',
  USER_VIEW_PROFILE = 'USER_VIEW_PROFILE',
}

export const events: EventsType = {
  [TrackEventType.APP_CRASH]: {
    category: 'app',
    action: 'app crashed',
  },
  [TrackEventType.APP_UNLOAD]: {
    category: 'app',
    action: 'app unloaded',
  },
  [TrackEventType.CONTACT_LEGAL_CONTACT]: {
    category: 'contact',
    action: 'edit legal contact',
  },
  [TrackEventType.CONTACT_MAIL_COURTESY]: {
    category: 'contact',
    action: 'edit email courtesy contact',
  },
  [TrackEventType.CONTACT_SPECIAL_CONTACTS]: {
    category: 'contact',
    action: 'edit special contact',
  },
  [TrackEventType.CONTACT_TEL_COURTESY]: {
    category: 'contact',
    action: 'edit telephone courtesy contact',
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    category: 'customer care',
    action: 'click on customer care email',
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_ACTION]: {
    category: 'delegation',
    action: 'add new delegate',
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_CTA]: {
    category: 'delegation',
    action: 'click/tap on the button that shows the new delegation form',
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_ERROR]: {
    category: 'delegation',
    action: 'error while adding new delegate',
    getAttributes: (payload: { [key: string]: any }) => ({
      type: payload.response.data.title || 'generic error',
    }),
  },
  [TrackEventType.DELEGATION_DELEGATE_REVOKE]: {
    category: 'delegation',
    action: 'click/tap on the revoke action',
  },
  [TrackEventType.DELEGATION_DELEGATE_VIEW_CODE]: {
    category: 'delegation',
    action: 'click/tap on show code',
  },
  [TrackEventType.DELEGATION_DELEGATOR_ACCEPT]: {
    category: 'delegation',
    action: 'click/tap on the accept button',
  },
  [TrackEventType.DELEGATION_DELEGATOR_REJECT]: {
    category: 'delegation',
    action: 'click/tap on reject action',
  },
  [TrackEventType.DIGITAL_DOMICILE_BANNER_CLOSE]: {
    category: 'notification',
    action: 'close the banner in notifications detail/list',
  },
  [TrackEventType.DIGITAL_DOMICILE_LINK]: {
    category: 'notification',
    action: 'click/tap on  the banner link in notifications detail/list',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE]: {
    category: 'notification',
    action: 'contact assistance',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ERROR]: {
    category: 'notification',
    action: 'failed payment',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_F24_FILE]: {
    category: 'notification',
    action: 'download the F24 file',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_INTERACTION]: {
    category: 'notification',
    action: 'click on the pay button',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE]: {
    category: 'notification',
    action: 'download the PagoPA file',
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_RELOAD]: {
    category: 'notification',
    action: 'reload the payment page',
  },
  [TrackEventType.NOTIFICATION_DETAIL_SINGLE_ATTACHMENT]: {
    category: 'notification',
    action: 'click/tap on  the banner link in notifications detail/list',
  },
  [TrackEventType.NOTIFICATION_FILTER_SEARCH]: {
    category: 'notification',
    action: 'click/tap on  the filter button in notifications filter',
  },
  [TrackEventType.NOTIFICATION_TABLE_PAGINATION]: {
    category: 'notification',
    action: 'change page',
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION]: {
    category: 'notification',
    action: 'go to notification detail',
  },
  [TrackEventType.NOTIFICATION_TABLE_SORT]: {
    category: 'notification',
    action: 'change notification sorting order',
    getAttributes: (payload: { [key: string]: string }) => ({
      orderBy: payload.orderBy,
      order: payload.order,
    }),
  },
  [TrackEventType.NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT]: {
    category: 'notification',
    action: 'click/tap on  the banner link in notifications timeline',
  },
  [TrackEventType.NOTIFICATION_TIMELINE_VIEW_MORE]: {
    category: 'notification',
    action: 'click/tap on timeline view more',
  },
  [TrackEventType.USER_LOGOUT]: {
    category: 'user',
    action: 'user logs out from action',
  },
  [TrackEventType.USER_NAV_ITEM]: {
    category: 'user',
    action: 'click on a sidebar link',
  },
  [TrackEventType.USER_PRODUCT_SWITCH]: {
    category: 'user',
    action: 'switch product',
  },
  [TrackEventType.USER_VIEW_PROFILE]: {
    category: 'user',
    action: 'go to user profile',
  },
  [TrackEventType.USER_VIEW_CONTACTS_PROFILE]: {
    category: 'user',
    action: 'go to contacts from profile',
  },
};

export enum EventActions {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete',
}
