import { trackEvent } from '@pagopa-pn/pn-commons';

import { TrackEventType, events } from './events';

/**
 * Function to track events outside redux
 * @param trackEventType event name
 * @param attributes event attributes
 */
export const trackEventByType = (trackEventType: TrackEventType, attributes?: object) => 
  // PN-9008 - turn off Mixpanel tracking in pf-personafisica-login
  // I leave a nonsense implementation in order to avoid compilation errors
  trackEventType && attributes;


// PN-9008 - The actual implementation is kept in a separate function in order to ease its recovering,
//           in particular to leave the imports.
export const trackEventByTypeReal = (trackEventType: TrackEventType, attributes?: object) => {
  const eventParameters = attributes
    ? { ...events[trackEventType], ...attributes }
    : events[trackEventType];

  trackEvent(trackEventType, process.env.NODE_ENV, eventParameters);
};
