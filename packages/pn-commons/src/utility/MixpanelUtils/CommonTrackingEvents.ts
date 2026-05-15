/**
 * Common tracking helpers used by the new functional registry approach.
 *
 * These helpers intentionally return the existing TrackedEvent shape so they can
 * be processed by the current EventStrategyFactory execution layer and remain
 * compatible with legacy PF class-based strategies.
 *
 * TODO: PN-19759 - Once PF is migrated to the typed functional registry approach,
 * evaluate tightening the TrackedEvent/helper typings around track, profile and
 * superProperty payloads, reducing the current legacy-compatible generic shape.
 */
import {
  EventAction,
  EventCategory,
  EventPropertyType,
  TrackedEvent,
} from '../../models/MixpanelEvents';

export type TrackingProperties = Record<string, unknown>;

function buildTrackEvent(
  eventCategory: EventCategory,
  eventAction: EventAction,
  properties?: TrackingProperties
): TrackedEvent<TrackingProperties> {
  return {
    [EventPropertyType.TRACK]: {
      ...properties,
      event_category: eventCategory,
      event_type: eventAction,
    },
  };
}

export function uxScreenView(properties?: TrackingProperties): TrackedEvent<TrackingProperties> {
  return buildTrackEvent(EventCategory.UX, EventAction.SCREEN_VIEW, properties);
}

export function uxAction(properties?: TrackingProperties): TrackedEvent<TrackingProperties> {
  return buildTrackEvent(EventCategory.UX, EventAction.ACTION, properties);
}

export function uxConfirm(properties?: TrackingProperties): TrackedEvent<TrackingProperties> {
  return buildTrackEvent(EventCategory.UX, EventAction.CONFIRM, properties);
}

export function koError(properties?: TrackingProperties): TrackedEvent<TrackingProperties> {
  return buildTrackEvent(EventCategory.KO, EventAction.ERROR, properties);
}

export function superProperty(properties: TrackingProperties): TrackedEvent<TrackingProperties> {
  return {
    [EventPropertyType.SUPER_PROPERTY]: properties,
  };
}
