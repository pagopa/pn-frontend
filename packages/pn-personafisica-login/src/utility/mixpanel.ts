import { ProfilePropertyType, setSuperOrProfileProperty, trackEvent } from '@pagopa-pn/pn-commons';

import { TrackEventType, events } from './events';
import { ProfilePropertyParams } from './profileProperties';

/**
 * Function to track events outside redux
 * @param trackEventType event name
 * @param attributes event attributes
 */
export const trackEventByType = (trackEventType: TrackEventType, attributes?: object) => {
  const eventParameters = attributes
    ? { ...events[trackEventType], ...attributes }
    : events[trackEventType];

  trackEvent(trackEventType, process.env.NODE_ENV, eventParameters);
};

export function setSuperOrProfilePropertyValues<TProperty extends keyof ProfilePropertyParams>(
  type: ProfilePropertyType,
  propertyName: TProperty,
  attributes?: ProfilePropertyParams[TProperty]
) {
  const property = attributes ? { [propertyName]: attributes } : propertyName;

  setSuperOrProfileProperty(type, property, process.env.NODE_ENV);
}
