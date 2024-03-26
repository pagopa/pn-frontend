import { ErrorInfo } from 'react';

import {
  EventCategory,
  EventPropertyType,
  EventStrategy,
  TrackedEvent,
} from '@pagopa-pn/pn-commons';

type SendGenericError = {
  reason: {
    error: Error;
    errorInfo: ErrorInfo;
  };
};

export class SendGenericErrorStrategy implements EventStrategy {
  performComputations(data: SendGenericError): TrackedEvent<SendGenericError> {
    return {
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.KO,
        reason: data.reason,
      },
    };
  }
}
