import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface PfConfiguration {
  API_BASE_URL: string;
  INACTIVITY_HANDLER_MINUTES: number;
  MIXPANEL_TOKEN: string;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PARTICIPATING_ENTITIES: string;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  ONE_TRUST_SERCQ_SEND_DRAFT_MODE: boolean;
  ONE_TRUST_TOS_SERCQ_SEND: string;
  OT_DOMAIN_ID: string;
  PAGOPA_HELP_EMAIL: string;
  LANDING_SITE_URL: string;
  // this will be removed when delegations to pg works correctly
  DELEGATIONS_TO_PG_ENABLED: boolean;
  WORK_IN_PROGRESS: boolean;
  F24_DOWNLOAD_WAIT_TIME: number;
  PAGOPA_HELP_PP: string;
  APP_IO_SITE: string;
  APP_IO_ANDROID: string;
  APP_IO_IOS: string;
  IS_DOD_ENABLED: boolean;
  DOWNTIME_EXAMPLE_LINK: string;
}

class PfConfigurationValidator extends Validator<PfConfiguration> {
  constructor() {
    super();
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('INACTIVITY_HANDLER_MINUTES').isNumber().isRequired();
    this.ruleFor('MIXPANEL_TOKEN').isString().isRequired();
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PARTICIPATING_ENTITIES')
      .isString()
      .isRequired()
      .matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_PP').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_TOS').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_SERCQ_SEND_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_TOS_SERCQ_SEND')
      .isString()
      .isRequired()
      .matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('OT_DOMAIN_ID').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('LANDING_SITE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('DELEGATIONS_TO_PG_ENABLED').isBoolean();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean();
    this.ruleFor('F24_DOWNLOAD_WAIT_TIME').isNumber().isRequired();
    this.ruleFor('PAGOPA_HELP_PP').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('APP_IO_SITE').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('APP_IO_ANDROID').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('APP_IO_IOS').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('IS_DOD_ENABLED').isBoolean();
    this.ruleFor('DOWNTIME_EXAMPLE_LINK').isString().isRequired().matches(dataRegex.htmlPageUrl);
  }
}

export function getConfiguration(): PfConfiguration {
  return Configuration.get<PfConfiguration>();
}

export async function loadPfConfiguration(): Promise<void> {
  await Configuration.load(new PfConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
