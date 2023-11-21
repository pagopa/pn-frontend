import { EventCategory, EventsType } from '@pagopa-pn/pn-commons';

// All the events are been removed by request of PN-8114 because will be filled again by PN-7437.
// I added a temporary "PLACEHOLDER" to prevent mixpanel errors in mixpanel.ts
// Remove PLACEHOLDER when PN-7437 stars.

export enum TrackEventType {
  SEND_LOGIN = 'SEND_LOGIN',
  SEND_IDP_SELECTED = 'SEND_IDP_SELECTED',
  SEND_LOGIN_FAILURE = 'SEND_LOGIN_FAILURE',
}

export const events: EventsType = {
  [TrackEventType.SEND_LOGIN]: {
    category: EventCategory.UX,
    action: 'view login page',
  },
  [TrackEventType.SEND_IDP_SELECTED]: {
    category: EventCategory.UX,
    action: 'select IDP provider',
  },
  [TrackEventType.SEND_LOGIN_FAILURE]: {
    category: EventCategory.TECH,
    action: 'login failed',
  },
};
