export enum TrackEventType {
  CONTACT_LEGAL_CONTACT = 'CONTACT_LEGAL_CONTACT',
  CONTACT_IOAPP_COURTESY = 'CONTACT_IOAPP_COURTESY',
  CONTACT_MAIL_COURTESY = 'CONTACT_MAIL_COURTESY',
  CONTACT_SPECIAL_CONTACTS = 'CONTACT_SPECIAL_CONTACTS',
  CONTACT_TEL_COURTESY = 'CONTACT_TEL_COURTESY',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO',
  DELEGATION_DELEGATE_ADD_ACTION = 'DELEGATION_DELEGATE_ADD_ACTION',
  DELEGATION_DELEGATE_ADD_CTA = 'DELEGATION_DELEGATE_ADD_CTA',
  DELEGATION_DELEGATE_ADD_ERROR = 'DELEGATION_DELEGATE_ADD_ERROR',
  DELEGATION_DELEGATE_REVOKE = 'DELEGATION_DELEGATE_REVOKE',
  DELEGATION_DELEGATE_VIEW_CODE = 'DELEGATION_DELEGATE_VIEW_CODE',
  DELEGATION_DELEGATOR_ACCEPT = 'DELEGATION_DELEGATOR_ACCEPT',
  DELEGATION_DELEGATOR_REJECT = 'DELEGATION_DELEGATOR_REJECT',
  DIGITAL_DOMICILE_BANNER_CLOSE = 'DIGITAL_DOMICILE_BANNER_CLOSE',
  DIGITAL_DOMICILE_LINK = 'DIGITAL_DOMICILE_LINK',
  FOOTER_ACCESSIBILITY = 'FOOTER_ACCESSIBILITY',
  FOOTER_LANG_SWITCH = 'FOOTER_LANG_SWITCH',
  GET_NOTIFICATIONS = 'getReceivedNotifications/fulfilled',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  NOTIFICATION_DETAIL_ALL_ATTACHMENTS = 'NOTIFICATION_DETAIL_ALL_ATTACHMENTS',
  NOTIFICATION_DETAIL_HELP_BOX = 'NOTIFICATION_DETAIL_HELP_BOX',
  NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE = 'NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE',
  NOTIFICATION_DETAIL_PAYMENT_INTERACTION = 'NOTIFICATION_DETAIL_PAYMENT_INTERACTION',
  NOTIFICATION_DETAIL_PAYMENT_ERROR = 'NOTIFICATION_DETAIL_PAYMENT_ERROR',
  NOTIFICATION_DETAIL_PAYMENT_F24_FILE = 'NOTIFICATION_DETAIL_PAYMENT_F24_FILE',
  NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE = 'NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE',
  NOTIFICATION_DETAIL_PAYMENT_RELOAD = 'NOTIFICATION_DETAIL_PAYMENT_RELOAD',
  NOTIFICATION_DETAIL_SINGLE_ATTACHMENT = 'NOTIFICATION_DETAIL_SINGLE_ATTACHMENT',
  NOTIFICATION_FILTER_REMOVE = 'NOTIFICATION_FILTER_REMOVE',
  NOTIFICATION_FILTER_SEARCH = 'NOTIFICATION_FILTER_SEARCH',
  NOTIFICATION_TIMELINE_ALL_ATTACHMENTS = 'NOTIFICATION_TIMELINE_ALL_ATTACHMENTS',
  NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT = 'NOTIFICATION_TIMELINE_SINGLE_ATTACHMENT',
  NOTIFICATION_TIMELINE_VIEW_MORE = 'NOTIFICATION_TIMELINE_VIEW_MORE',
  NOTIFICATION_TABLE_PAGINATION = 'NOTIFICATION_TABLE_PAGINATION',
  NOTIFICATION_TABLE_ROW_INTERACTION = 'NOTIFICATION_TABLE_ROW_INTERACTION',
  NOTIFICATION_TABLE_ROW_TOOLTIP = 'NOTIFICATION_TABLE_ROW_TOOLTIP',
  NOTIFICATION_TABLE_SIZE = 'NOTIFICATION_TABLE_SIZE',
  NOTIFICATION_TABLE_SORT = 'NOTIFICATION_TABLE_SORT',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_VIEW_CONTACTS_PROFILE = 'USER_VIEW_CONTACTS_PROFILE',
  USER_VIEW_PROFILE = 'USER_VIEW_PROFILE'
}

export const events: {
  [key: string]: {
    category: string;
    action: string;
  };
} = {
  [TrackEventType.CONTACT_LEGAL_CONTACT]: {
    category: 'contact',
    action: 'edit legal contact'
  },
  [TrackEventType.CONTACT_IOAPP_COURTESY]: {
    category: 'contact',
    action: 'edit ioapp courtesy contact'
  },
  [TrackEventType.CONTACT_MAIL_COURTESY]: {
    category: 'contact',
    action: 'edit email courtesy contact'
  },
  [TrackEventType.CONTACT_SPECIAL_CONTACTS]: {
    category: 'contact',
    action: 'edit special contact'
  },
  [TrackEventType.CONTACT_TEL_COURTESY]: {
    category: 'contact',
    action: 'edit telephone courtesy contact'
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    category: 'customer care',
    action: 'click on customer care email'
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_ACTION]: {
    category: 'delegation',
    action: 'add new delegate'
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_CTA]: {
    category: 'delegation',
    action: 'click/tap on the button that shows the new delegation form'
  },
  [TrackEventType.DELEGATION_DELEGATE_ADD_ERROR]: {
    category: 'delegation',
    action: 'error while adding new delegate'
  },
  [TrackEventType.DELEGATION_DELEGATE_REVOKE]: {
    category: 'delegation',
    action: 'click/tap on the revoke action'
  },
  [TrackEventType.DELEGATION_DELEGATE_VIEW_CODE]: {
    category: 'delegation',
    action: 'click/tap on show code'
  },
  [TrackEventType.DELEGATION_DELEGATOR_ACCEPT]: {
    category: 'delegation',
    action: 'click/tap on the accept button'
  },
  [TrackEventType.DELEGATION_DELEGATOR_REJECT]: {
    category: 'delegation',
    action: 'click/tap on reject action'
  },
  [TrackEventType.DIGITAL_DOMICILE_BANNER_CLOSE]: {
    category: 'notification',
    action: 'close the banner in notifications detail/list'
  },
  [TrackEventType.DIGITAL_DOMICILE_LINK]: {
    category: 'notification',
    action: 'click/tap on  the banner link in notifications detail/list'
  },
  [TrackEventType.GET_NOTIFICATIONS]: {
    category: 'notification',
    action: 'get notifications list'
  },
  [TrackEventType.LOGIN_FAILURE]: {
    category: 'session',
    action: 'error during login'
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ASSISTANCE]: {
    category: 'notification',
    action: 'contact assistance'
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_ERROR]: {
    category: 'notification',
    action: 'failed payment'
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_F24_FILE]: {
    category: 'notification',
    action: 'download the F24 file'
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_INTERACTION]: {
    category: 'notification',
    action: 'click on the pay button'
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_PAGOPA_FILE]: {
    category: 'notification',
    action: 'download the PagoPA file'
  },
  [TrackEventType.NOTIFICATION_DETAIL_PAYMENT_RELOAD]: {
    category: 'notification',
    action: 'reload the payment page'
  },
  [TrackEventType.NOTIFICATION_DETAIL_SINGLE_ATTACHMENT]: {
    category: 'notification',
    action: 'click/tap on  the banner link in notifications detail/list'
  },
  [TrackEventType.NOTIFICATION_TABLE_PAGINATION]: {
    category: 'notification',
    action: 'change page'
  },
  [TrackEventType.NOTIFICATION_TABLE_ROW_INTERACTION]: {
    category: 'notification',
    action: 'go to notification detail'
  },
  [TrackEventType.USER_LOGOUT]: {
    category: 'session',
    action: 'user logs out from action'
  },
  [TrackEventType.USER_VIEW_PROFILE]: {
    category: 'profile',
    action: 'go to user profile'
  },
  [TrackEventType.USER_VIEW_CONTACTS_PROFILE]: {
    category: 'profile',
    action: 'go to contacts from profile'
  }
};

export enum EventActions {
  ADD = 'add',
  EDIT = 'edit',
  DELETE = 'delete'
}