import { EventPropertyType, EventStrategy, TrackedEvent } from '@pagopa-pn/pn-commons';

type SendLoginMethod = {
  entityID:
    | 'cie'
    | 'posteid'
    | 'timid'
    | 'spiditalia'
    | 'sielteid'
    | 'namirialid'
    | 'lepidaid'
    | 'instesaid'
    | 'infocertid'
    | 'arubaid';
};

type SendLoginMethodReturn = {
  SEND_LOGIN_METHOD: string;
};

export class SendLoginMethodStrategy implements EventStrategy {
  performComputations({ entityID }: SendLoginMethod): TrackedEvent<SendLoginMethodReturn> {
    return {
      [EventPropertyType.PROFILE]: {
        SEND_LOGIN_METHOD: entityID,
      },
    };
  }
}
