import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface PaConfigurationFromFile {
  OT_DOMAIN_ID?: string;
  SELFCARE_URL_FE_LOGIN: string;
  SELFCARE_BASE_URL: string;
  API_BASE_URL: string;
  LANDING_SITE_URL: string;
  ONE_TRUST_DRAFT_MODE?: boolean;
  ONE_TRUST_PP?: string;
  ONE_TRUST_TOS?: string;
  PAGOPA_HELP_EMAIL: string;
  DISABLE_INACTIVITY_HANDLER?: boolean;
  IS_PAYMENT_ENABLED?: boolean;
  MIXPANEL_TOKEN?: string;
  WORK_IN_PROGRESS?: boolean;
  SELFCARE_SEND_PROD_ID: string;
  API_B2B_LINK: string;
  IS_MANUAL_SEND_ENABLED: boolean;
  IS_STATISTICS_ENABLED: boolean;
  TAXONOMY_SEND_URL: string;
  DOWNTIME_EXAMPLE_LINK: string;
}

export interface PaConfiguration extends PaConfigurationFromFile {
  OT_DOMAIN_ID: string;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  LOG_REDUX_ACTIONS: boolean;
  APP_VERSION: string;
  DISABLE_INACTIVITY_HANDLER: boolean;
  IS_PAYMENT_ENABLED: boolean;
  MIXPANEL_TOKEN: string;
  WORK_IN_PROGRESS: boolean;
  SELFCARE_SEND_PROD_ID: string;
  API_B2B_LINK: string;
  IS_MANUAL_SEND_ENABLED: boolean;
  IS_STATISTICS_ENABLED: boolean;
  TAXONOMY_SEND_URL: string;
}

class PaConfigurationValidator extends Validator<PaConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.token);
    this.ruleFor('SELFCARE_URL_FE_LOGIN').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('LANDING_SITE_URL').isString().isRequired();
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().matches(dataRegex.token);
    this.ruleFor('ONE_TRUST_TOS').isString().matches(dataRegex.token);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('DISABLE_INACTIVITY_HANDLER').isBoolean();
    this.ruleFor('IS_PAYMENT_ENABLED').isBoolean();
    this.ruleFor('MIXPANEL_TOKEN').isString();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean();
    this.ruleFor('SELFCARE_SEND_PROD_ID').isString();
    this.ruleFor('API_B2B_LINK').isString();
    this.ruleFor('IS_MANUAL_SEND_ENABLED').isBoolean();
    this.ruleFor('IS_STATISTICS_ENABLED').isBoolean();
    this.ruleFor('TAXONOMY_SEND_URL').isString();
    this.ruleFor('DOWNTIME_EXAMPLE_LINK').isString();
  }
}

export function getConfiguration(): PaConfiguration {
  const configurationFromFile = Configuration.get<PaConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '';
  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    ONE_TRUST_DRAFT_MODE: Boolean(configurationFromFile.ONE_TRUST_DRAFT_MODE),
    ONE_TRUST_PP: configurationFromFile.ONE_TRUST_PP || '',
    ONE_TRUST_TOS: configurationFromFile.ONE_TRUST_TOS || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
    APP_VERSION,
    DISABLE_INACTIVITY_HANDLER: configurationFromFile.DISABLE_INACTIVITY_HANDLER ?? true,
    IS_PAYMENT_ENABLED: Boolean(configurationFromFile.IS_PAYMENT_ENABLED),
    MIXPANEL_TOKEN: configurationFromFile.MIXPANEL_TOKEN || 'DUMMY',
    WORK_IN_PROGRESS: Boolean(configurationFromFile.WORK_IN_PROGRESS),
    SELFCARE_SEND_PROD_ID: configurationFromFile.SELFCARE_SEND_PROD_ID,
    API_B2B_LINK: configurationFromFile.API_B2B_LINK || '',
    IS_MANUAL_SEND_ENABLED: Boolean(configurationFromFile.IS_MANUAL_SEND_ENABLED),
    IS_STATISTICS_ENABLED: Boolean(configurationFromFile.IS_STATISTICS_ENABLED),
    TAXONOMY_SEND_URL: configurationFromFile.TAXONOMY_SEND_URL,
    DOWNTIME_EXAMPLE_LINK:
      (configurationFromFile.LANDING_SITE_URL || '') +
      (configurationFromFile.DOWNTIME_EXAMPLE_LINK || ''),
  };
}

export async function loadPaConfiguration(): Promise<void> {
  await Configuration.load(new PaConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
