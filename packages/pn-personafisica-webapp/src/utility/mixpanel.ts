import {
  ProfilePropertyType,
  interceptDispatch,
  interceptDispatchSuperOrProfileProperty,
  setSuperOrProfileProperty,
  trackEvent,
} from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import PFEventStrategyFactory from './MixpanelUtils/PFEventStrategyFactory';
import { TrackEventType, events, eventsActionsMap } from './events';
import { ProfilePropertyParams, profilePropertiesActionsMap } from './profileProperties';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatch(next, PFEventStrategyFactory, eventsActionsMap);

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

/**
 * Function to set super or profile property values
 * @param type type of property (Super, Profile or Incremental)
 * @param propertyName name of the property to set
 * @param attributes values of the property to set. If not provided, the property will be set to the name of the property
 */
export function setSuperOrProfilePropertyValues<TProperty extends keyof ProfilePropertyParams>(
  type: ProfilePropertyType,
  propertyName: TProperty,
  attributes?: ProfilePropertyParams[TProperty]
) {
  const property = attributes ? { [propertyName]: attributes } : propertyName;

  setSuperOrProfileProperty(type, property, process.env.NODE_ENV);
}
