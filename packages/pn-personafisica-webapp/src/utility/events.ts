import { EventsType } from '@pagopa-pn/pn-commons';

// All the events are been removed by request of PN-8114 because will be filled again by PN-7437.
// I added a temporary "PLACEHOLDER" to prevent mixpanel errors in mixpanel.ts
// Remove PLACEHOLDER when PN-7437 stars.

export enum TrackEventType {
  PLACEHOLDER = 'PLACEHOLDER',
}

export const events: EventsType = {
  [TrackEventType.PLACEHOLDER]: {
    category: 'placeholder',
    action: 'placeholder',
  },
};
