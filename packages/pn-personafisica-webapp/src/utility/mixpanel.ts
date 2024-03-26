import { interceptDispatch } from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import { eventsActionsMap } from '../models/PFEventsType';
import PFEventStrategyFactory from './MixpanelUtils/PFEventStrategyFactory';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatch(next, PFEventStrategyFactory, eventsActionsMap);

// export const trackingProfileMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
//   interceptDispatchSuperOrProfileProperty(next, profilePropertiesActionsMap, process.env.NODE_ENV);

// export function setSuperOrProfilePropertyValues<TProperty extends keyof ProfilePropertyParams>(
//   type: ProfilePropertyType,
//   propertyName: TProperty,
//   attributes?: ProfilePropertyParams[TProperty]
// ) {
//   const property = attributes ? { [propertyName]: attributes } : propertyName;

//   setSuperOrProfileProperty(type, property, process.env.NODE_ENV);
// }
