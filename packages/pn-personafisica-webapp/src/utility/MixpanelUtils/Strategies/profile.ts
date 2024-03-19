import {
  EventAction,
  EventCategory,
  EventStrategy,
  StrategyEventType,
} from '@pagopa-pn/pn-commons';

export class SendProfileStrategy implements EventStrategy {
  performComputations(): StrategyEventType {
    return {
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
    };
  }
}
