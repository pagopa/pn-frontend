import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

import { PhysicalAddressLookupConfig } from '../models/NewNotification';

export interface PaConfiguration {
  OT_DOMAIN_ID: string;
  SELFCARE_URL_FE_LOGIN: string;
  SELFCARE_URL_FE_LOGOUT: string;
  SELFCARE_BASE_URL: string;
  API_BASE_URL: string;
  LANDING_SITE_URL: string;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  PAGOPA_HELP_EMAIL: string;
  IS_INACTIVITY_HANDLER_ENABLED: boolean;
  IS_PAYMENT_ENABLED: boolean;
  MIXPANEL_TOKEN: string;
  WORK_IN_PROGRESS: boolean;
  SELFCARE_SEND_PROD_ID: string;
  API_B2B_LINK: string;
  IS_MANUAL_SEND_ENABLED: boolean;
  IS_STATISTICS_ENABLED: boolean;
  TAXONOMY_SEND_URL: string;
  DOWNTIME_EXAMPLE_LINK: string;
  PAYMENT_INFO_LINK: string;
  DEVELOPER_API_DOCUMENTATION_LINK: string;
  PHYSICAL_ADDRESS_LOOKUP: PhysicalAddressLookupConfig;
}

class PaConfigurationValidator extends Validator<PaConfiguration> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString().isRequired().matches(dataRegex.token);
    this.ruleFor('SELFCARE_URL_FE_LOGIN').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_URL_FE_LOGOUT').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('LANDING_SITE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().isRequired().matches(dataRegex.token);
    this.ruleFor('ONE_TRUST_TOS').isString().isRequired().matches(dataRegex.token);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('IS_INACTIVITY_HANDLER_ENABLED').isBoolean();
    this.ruleFor('IS_PAYMENT_ENABLED').isBoolean();
    this.ruleFor('MIXPANEL_TOKEN').isString().isRequired();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean();
    this.ruleFor('SELFCARE_SEND_PROD_ID').isString().isRequired();
    this.ruleFor('API_B2B_LINK').isString().isRequired();
    this.ruleFor('IS_MANUAL_SEND_ENABLED').isBoolean();
    this.ruleFor('IS_STATISTICS_ENABLED').isBoolean();
    this.ruleFor('TAXONOMY_SEND_URL').isString().isRequired();
    this.ruleFor('DOWNTIME_EXAMPLE_LINK').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('PAYMENT_INFO_LINK').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('DEVELOPER_API_DOCUMENTATION_LINK')
      .isString()
      .isRequired()
      .matches(dataRegex.htmlPageUrl);
    this.ruleFor('PHYSICAL_ADDRESS_LOOKUP')
      .isString()
      .isRequired()
      .isOneOf(Object.values(PhysicalAddressLookupConfig));
  }
}

export function getConfiguration(): PaConfiguration {
  return Configuration.get<PaConfiguration>();
}

export async function loadPaConfiguration(): Promise<void> {
  await Configuration.load(new PaConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
