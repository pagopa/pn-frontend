import { ErrorInfo } from 'react';

import { EventCategory, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendGenericError = {
  reason: {
    error: Error;
    errorInfo: ErrorInfo;
  };
};

export class SendGenericErrorStrategy implements EventStrategy {
  performComputations(data: SendGenericError): TrackedEvent<SendGenericError> {
    return {
      event_category: EventCategory.KO,
      ...data,
    };
  }
}
