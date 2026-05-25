import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type Props = {
  entityID: string;
};

type SendLoginMethodReturn = {
  SEND_LOGIN_METHOD: string;
};

export class SendOneIdentityLoginMethodStrategy implements EventStrategy {
  performComputations({ entityID }: Props): TrackedEvent<SendLoginMethodReturn> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_LOGIN_METHOD: entityID,
      },
    };
  }
}
