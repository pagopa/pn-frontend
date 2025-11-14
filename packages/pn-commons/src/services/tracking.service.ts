// leave default import for mixpanel, using named once it won't work
import _ from 'lodash';
import mixpanel from 'mixpanel-browser';

import { AnyAction, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { ActionMeta, EventPropertyType } from '../models/MixpanelEvents';
import EventStrategyFactory from '../utility/MixpanelUtils/EventStrategyFactory';

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
      mixpanel.people.set(properties);
      break;
    case EventPropertyType.INCREMENTAL: {
      const hasProperties =
        !_.isNil(properties) && (typeof properties === 'object' || typeof properties === 'string')
          ? !_.isEmpty(properties)
          : true;
      mixpanel.people.increment(hasProperties ? { event_name: properties } : event_name);
      break;
    }
    case EventPropertyType.SUPER_PROPERTY:
      mixpanel.register(properties);
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
      callMixpanelTrackingMethod(propertyType, event_name, properties);
    } catch (_) {
      // eslint-disable-next-line no-console
      console.log(event_name, properties);
    }
  }
}

export const interceptDispatch =
  <T extends string>(
    next: Dispatch<AnyAction>,
    eventStrategyFactory: EventStrategyFactory<T>,
    eventsActionsMap: Record<string, T>
  ) =>
  (
    action: PayloadAction<any, string, ActionMeta>
  ): void | PayloadAction<any, string, ActionMeta> => {
    if (eventsActionsMap[action.type]) {
      const eventName = eventsActionsMap[action.type];
      const data = { payload: action.payload, params: action.meta?.arg };
      eventStrategyFactory.triggerEvent(eventName, data);
    }
    return next(action);
  };
