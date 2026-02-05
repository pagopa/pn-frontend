import {
  EventAction,
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type Props = {
  event_type: EventAction.SCREEN_VIEW | EventAction.ACTION;
  banner_id: string;
  banner_page: string;
  banner_landing: string;
};

type Return = {
  banner_id: string;
  banner_page: string;
  banner_landing: string;
};

export class UxBannerStrategy implements EventStrategy {
  performComputations({
    event_type,
    banner_id,
    banner_page,
    banner_landing,
  }: Props): TrackedEvent<Return> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type,
        banner_id,
        banner_page,
        banner_landing,
      },
    };
  }
}
