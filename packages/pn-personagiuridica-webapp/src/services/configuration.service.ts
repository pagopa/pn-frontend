import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface PgConfiguration {
  API_BASE_URL: string;
  INACTIVITY_HANDLER_MINUTES: number;
  MIXPANEL_TOKEN: string;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  ONE_TRUST_SERCQ_SEND_DRAFT_MODE: boolean;
  ONE_TRUST_TOS_SERCQ_SEND: string;
  ONE_TRUST_MASSIVI_DRAFT_MODE: boolean;
  ONE_TRUST_TOS_MASSIVI: string;
  OT_DOMAIN_ID: string;
  PAGOPA_HELP_EMAIL: string;
  LANDING_SITE_URL: string;
  DELEGATIONS_TO_PG_ENABLED: boolean;
  WORK_IN_PROGRESS: boolean;
  F24_DOWNLOAD_WAIT_TIME: number;
  IS_B2B_ENABLED: boolean;
  DOWNTIME_EXAMPLE_LINK: string;
  SELFCARE_BASE_URL: string;
  IS_DOD_ENABLED: boolean;
  SELFCARE_CDN_URL: string;
  ACCESSIBILITY_LINK: string;
}

class PgConfigurationValidator extends Validator<PgConfiguration> {
  constructor() {
    super();
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('INACTIVITY_HANDLER_MINUTES').isNumber().isRequired();
    this.ruleFor('MIXPANEL_TOKEN').isString().isRequired();
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_TOS').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_SERCQ_SEND_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_TOS_SERCQ_SEND')
      .isString()
      .isRequired()
      .matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_MASSIVI_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_TOS_MASSIVI')
      .isString()
      .isRequired()
      .matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('OT_DOMAIN_ID').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('LANDING_SITE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('DELEGATIONS_TO_PG_ENABLED').isBoolean();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean();
    this.ruleFor('F24_DOWNLOAD_WAIT_TIME').isNumber();
    this.ruleFor('IS_B2B_ENABLED').isBoolean();
    this.ruleFor('DOWNTIME_EXAMPLE_LINK').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('IS_DOD_ENABLED').isBoolean();
    this.ruleFor('SELFCARE_CDN_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('ACCESSIBILITY_LINK').isString().isRequired();
  }
}

export function getConfiguration(): PgConfiguration {
  return Configuration.get<PgConfiguration>();
}

export async function loadPgConfiguration(): Promise<void> {
  await Configuration.load(new PgConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
