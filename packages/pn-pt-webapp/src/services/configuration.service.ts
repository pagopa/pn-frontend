import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface PtConfiguration {
  OT_DOMAIN_ID: string;
  OT_SETTINGS_TOKEN: string;
  API_BASE_URL: string;
  PAGOPA_HELP_EMAIL: string;
  ACCESSIBILITY_LINK: string;
  SERCQ_SERVICE_STATEMENT_LINK: string;
  SELFCARE_BASE_URL: string;
  SELFCARE_SEND_PROD_ID: string;
  INACTIVITY_HANDLER_MINUTES: number;
  WORK_IN_PROGRESS: boolean;
  LANDING_SITE_URL: string;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
}

class PtConfigurationValidator extends Validator<PtConfiguration> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString().isRequired().matches(dataRegex.token);
    this.ruleFor('OT_SETTINGS_TOKEN').isString().isRequired().matches(dataRegex.token);
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('ACCESSIBILITY_LINK').isString().isRequired();
    this.ruleFor('SERCQ_SERVICE_STATEMENT_LINK')
      .isString()
      .isRequired()
      .matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_SEND_PROD_ID').isString().isRequired();
    this.ruleFor('INACTIVITY_HANDLER_MINUTES').isNumber().isRequired();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean().isRequired();
    this.ruleFor('LANDING_SITE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean().isRequired();
    this.ruleFor('ONE_TRUST_PP').isString().isRequired();
    this.ruleFor('ONE_TRUST_TOS').isString().isRequired();
  }
}

export function getConfiguration(): PtConfiguration {
  return Configuration.get<PtConfiguration>();
}

export async function loadPtConfiguration(): Promise<void> {
  await Configuration.load(new PtConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
