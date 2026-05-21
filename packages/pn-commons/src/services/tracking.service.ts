// leave default import for mixpanel, using named once it won't work
import { isEmpty, isNil } from 'lodash-es';
import mixpanel from 'mixpanel-browser';

import { AnyAction, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { ActionMeta, EventPropertyType } from '../models/MixpanelEvents';
import EventStrategyFactory from '../utility/MixpanelUtils/EventStrategyFactory';

export type TrackEventOptions = {
  callback?: () => void;
  sendImmediately?: boolean;
};

/**
 * Function that calls the mixpanel tracking method based on the property type
 * @param propertyType the type of property
 * @param event_name the event name to track
 * @param properties the event data
 * @param options tracking options
 */
function callMixpanelTrackingMethod(
  propertyType: EventPropertyType,
  event_name: string,
  properties?: any,
  options?: TrackEventOptions
) {
  switch (propertyType) {
    case EventPropertyType.PROFILE:
      mixpanel.people.set(properties);
      break;
    case EventPropertyType.INCREMENTAL: {
      const hasProperties =
        !isNil(properties) && (typeof properties === 'object' || typeof properties === 'string')
          ? !isEmpty(properties)
          : true;
      mixpanel.people.increment(hasProperties ? { event_name: properties } : event_name);
      break;
    }
    case EventPropertyType.SUPER_PROPERTY:
      mixpanel.register(properties);
      break;
    case EventPropertyType.TRACK:
    default:
      mixpanel.track(
        event_name,
        properties,
        options?.sendImmediately ? { send_immediately: true } : undefined,
        options?.callback
      );
  }
}

/**
 * Function that tracks event
 * @param propertyType event property type
 * @param event_name event name to track
 * @param nodeEnv current environment
 * @param properties event data
 * @param options tracking options
 */
export function trackEvent(
  propertyType: EventPropertyType,
  event_name: string,
  nodeEnv: string,
  properties?: any,
  options?: TrackEventOptions
): void {
  if (nodeEnv === 'test') {
    options?.callback?.();
    return;
  }

  try {
    callMixpanelTrackingMethod(propertyType, event_name, properties, options);
  } catch {
    options?.callback?.();
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
