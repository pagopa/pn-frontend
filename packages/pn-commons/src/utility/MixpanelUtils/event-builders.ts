import {
  EventAction,
  EventCategory,
  EventPropertyType,
  TrackedEvent,
} from '../../models/MixpanelEvents';

type Props = Record<string, unknown>;

type TrackPayloadBase = Props & {
  event_category: EventCategory;
  event_type?: EventAction;
};

const trackBase = (payload: TrackPayloadBase): TrackedEvent => ({
  [EventPropertyType.TRACK]: payload,
});

export const uxAction = (extra: Props = {}): TrackedEvent =>
  trackBase({
    event_category: EventCategory.UX,
    event_type: EventAction.ACTION,
    ...extra,
  });

export const uxConfirm = (extra: Props = {}): TrackedEvent =>
  trackBase({
    event_category: EventCategory.UX,
    event_type: EventAction.CONFIRM,
    ...extra,
  });

export const uxScreenView = (extra: Props = {}): TrackedEvent =>
  trackBase({
    event_category: EventCategory.UX,
    event_type: EventAction.SCREEN_VIEW,
    ...extra,
  });

export const koError = (extra: Props = {}): TrackedEvent =>
  trackBase({
    event_category: EventCategory.KO,
    event_type: EventAction.ERROR,
    ...extra,
  });

export const profile = (props: Props): TrackedEvent => ({
  [EventPropertyType.PROFILE]: props,
});

export const superProperty = (props: Props): TrackedEvent => ({
  [EventPropertyType.SUPER_PROPERTY]: props,
});

export const mergeEvents = (...items: Array<TrackedEvent>): TrackedEvent =>
  items.reduce((acc, curr) => ({ ...acc, ...curr }), {});
