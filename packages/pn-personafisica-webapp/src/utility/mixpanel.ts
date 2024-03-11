import {
  ProfilePropertyType,
  interceptDispatch,
  interceptDispatchSuperOrProfileProperty,
  setSuperOrProfileProperty,
  trackEvent,
} from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import { TrackEventType, events, eventsActionsMap } from './events';
import { ProfilePropertyParams, profilePropertiesActionsMap } from './profileProperties';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatch(next, events, eventsActionsMap, process.env.NODE_ENV);

export const trackingProfileMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatchSuperOrProfileProperty(next, profilePropertiesActionsMap, process.env.NODE_ENV);

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
  // eslint-disable-next-line functional/no-let
  let property: any;

  if (attributes) {
    property = {
      [propertyName]: attributes,
    };
  } else {
    property = propertyName;
  }

  setSuperOrProfileProperty(type, property, process.env.NODE_ENV);
}
