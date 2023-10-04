import { EventsType } from '@pagopa-pn/pn-commons';

export enum TrackEventType {
  APP_UNLOAD = 'APP_UNLOAD',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGIN_INTENT = 'LOGIN_INTENT',
  LOGIN_IDP_SELECTED = 'LOGIN_IDP_SELECTED',
  LOGIN_PRIVACY = 'LOGIN_PRIVACY',
  LOGIN_TOS = 'LOGIN_TOS',
  CUSTOMER_CARE_MAILTO = 'CUSTOMER_CARE_MAILTO'
}

export const events: EventsType = {
  [TrackEventType.APP_UNLOAD]: {
    category: 'app',
    action: 'app unloaded'
  },
  [TrackEventType.LOGIN_FAILURE]: {
    category: 'user',
    action: 'error during login'
  },
  [TrackEventType.LOGIN_INTENT]: {
    category: 'user',
    action: 'the user opens login page'
  },
  [TrackEventType.LOGIN_IDP_SELECTED]: {
    category: 'user',
    action: 'the user opens login page'
  },
  [TrackEventType.LOGIN_PRIVACY]: {
    category: 'user',
    action: 'click on privacy link'
  },
  [TrackEventType.LOGIN_TOS]: {
    category: 'user',
    action: 'click on privacy link'
  },
  [TrackEventType.CUSTOMER_CARE_MAILTO]: {
    category: 'customer care',
    action: 'click on customer care email'
  },
};
