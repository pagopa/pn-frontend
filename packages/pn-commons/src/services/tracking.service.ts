// leave default import for mixpanel, using named once it won't work
import mixpanel from 'mixpanel-browser';

import { AnyAction, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { EventPropertyType } from '../models/MixpanelEvents';
import { EventStrategyFactory } from '../utility';

/**
 * Function that calls the mixpanel tracking method based on the property type
 * @param propertyType the type of property
 * @param event_name the event name to track
 * @param properties the event data
 */
function callMixpanelTrackingMethod(
  propertyType: EventPropertyType,
  event_name: string,
  properties?: any
) {
  switch (propertyType) {
    case EventPropertyType.TRACK:
      mixpanel.track(event_name, properties);
      break;
    case EventPropertyType.PROFILE:
      mixpanel.people.set({ event_name: properties });
      break;
    case EventPropertyType.INCREMENTAL:
      mixpanel.people.increment(properties ? { event_name: properties } : event_name);
      break;
    case EventPropertyType.SUPER_PROPERTY:
      mixpanel.register({ event_name: properties });
      break;
    default:
      mixpanel.track(event_name, properties);
  }
}

/**
 * Function that tracks event
 * @param propertyType event property type
 * @param nodeEnv current environment
 * @param properties event data
 */
export function trackEvent(
  propertyType: EventPropertyType,
  event_name: string,
  nodeEnv: string,
  properties?: any
): void {
  if (nodeEnv === 'test') {
    return;
  } else if (!nodeEnv || nodeEnv === 'development') {
    // eslint-disable-next-line no-console
    console.log(event_name, properties, propertyType);
  } else {
    try {
      // mixpanel.track(event_name, properties);
      callMixpanelTrackingMethod(propertyType, event_name, properties);
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log(event_name, properties);
    }
  }
}

export const interceptDispatch =
  (
    next: Dispatch<AnyAction>,
    eventStrategyFactory: EventStrategyFactory<any>,
    eventsActionsMap: Record<string, string>
  ) =>
  (action: PayloadAction<any, string, any>): void | PayloadAction<any, string, any> => {
    if (eventsActionsMap[action.type]) {
      const eventName = eventsActionsMap[action.type];
      eventStrategyFactory.triggerEvent(eventName, action.payload);
    }
    return next(action);
  };
