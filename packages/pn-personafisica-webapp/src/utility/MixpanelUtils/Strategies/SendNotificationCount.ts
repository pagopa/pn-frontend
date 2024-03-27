import {
  EventPropertyType,
  EventStrategy,
  INotificationDetailTimeline,
  TimelineCategory,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendGenericError = {
  timeline: Array<INotificationDetailTimeline>;
};

export class SendNotificationCountStrategy implements EventStrategy {
  performComputations({ timeline }: SendGenericError): TrackedEvent {
    if (timeline.findIndex((el) => el.category === TimelineCategory.NOTIFICATION_VIEWED) === -1) {
      return {
        [EventPropertyType.INCREMENTAL]: {},
      };
    }
    return {};
  }
}
