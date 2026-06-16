import { EventPropertyType, EventStrategy, TrackedEvent, getLangCode } from '@pagopa-pn/pn-commons';

type SendLanguage = {
  SEND_LANGUAGE: string;
};

type SendLanguageData = {
  language: string;
};

export class SendLanguageStrategy implements EventStrategy {
  performComputations({ language }: SendLanguageData): TrackedEvent<SendLanguage> {
    return {
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_LANGUAGE: getLangCode(language),
      },
    };
  }
}
