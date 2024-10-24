import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface PfConfigurationFromFile {
  API_BASE_URL: string;
  DISABLE_INACTIVITY_HANDLER?: boolean;
  MIXPANEL_TOKEN: string;
  ONE_TRUST_DRAFT_MODE?: boolean;
  ONE_TRUST_PARTICIPATING_ENTITIES?: string;
  ONE_TRUST_PP?: string;
  ONE_TRUST_TOS?: string;
  ONE_TRUST_SERCQ_SEND_DRAFT_MODE?: boolean;
  ONE_TRUST_PP_SERCQ_SEND?: string;
  ONE_TRUST_TOS_SERCQ_SEND?: string;
  OT_DOMAIN_ID?: string;
  PAGOPA_HELP_EMAIL: string;
  PAYMENT_DISCLAIMER_URL?: string;
  URL_CHECKOUT: string;
  LANDING_SITE_URL: string;
  // this will be removed when delegations to pg works correctly
  DELEGATIONS_TO_PG_ENABLED: boolean;
  WORK_IN_PROGRESS?: boolean;
  F24_DOWNLOAD_WAIT_TIME: number;
  PAGOPA_HELP_PP: string;
  APP_IO_SITE: string;
  APP_IO_ANDROID: string;
  APP_IO_IOS: string;
  DOD_DISABLED: boolean;
}

interface PfConfiguration extends PfConfigurationFromFile {
  DISABLE_INACTIVITY_HANDLER: boolean;
  IS_DEVELOP: boolean;
  LOG_REDUX_ACTIONS: boolean;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PARTICIPATING_ENTITIES: string;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  ONE_TRUST_SERCQ_SEND_DRAFT_MODE: boolean;
  ONE_TRUST_PP_SERCQ_SEND: string;
  ONE_TRUST_TOS_SERCQ_SEND: string;
  OT_DOMAIN_ID: string;
  PAYMENT_DISCLAIMER_URL: string;
  VERSION: string;
  URL_FE_LOGOUT: string;
  WORK_IN_PROGRESS: boolean;
}

class PfConfigurationValidator extends Validator<PfConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('MIXPANEL_TOKEN').isString();
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_PARTICIPATING_ENTITIES')
      .isString()
      .matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_TOS').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_TOS_SERCQ_SEND').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_PP_SERCQ_SEND').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_SERCQ_SEND_DRAFT_MODE').isBoolean();
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('LANDING_SITE_URL').isString().isRequired();
    this.ruleFor('DELEGATIONS_TO_PG_ENABLED').isBoolean();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean();
    this.ruleFor('F24_DOWNLOAD_WAIT_TIME').isNumber();
    this.ruleFor('PAGOPA_HELP_PP').isString();
    this.ruleFor('APP_IO_SITE').isString();
    this.ruleFor('APP_IO_ANDROID').isString();
    this.ruleFor('APP_IO_IOS').isString();
    this.ruleFor('DOD_DISABLED').isBoolean();
  }
}

export function getConfiguration(): PfConfiguration {
  const configurationFromFile = Configuration.get<PfConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const VERSION = import.meta.env.VITE_APP_VERSION ?? '';
  return {
    ...configurationFromFile,
    DISABLE_INACTIVITY_HANDLER: Boolean(configurationFromFile.DISABLE_INACTIVITY_HANDLER),
    MIXPANEL_TOKEN: configurationFromFile.MIXPANEL_TOKEN || 'DUMMY',
    ONE_TRUST_DRAFT_MODE: Boolean(configurationFromFile.ONE_TRUST_DRAFT_MODE),
    ONE_TRUST_PARTICIPATING_ENTITIES: configurationFromFile.ONE_TRUST_PARTICIPATING_ENTITIES || '',
    ONE_TRUST_PP: configurationFromFile.ONE_TRUST_PP || '',
    ONE_TRUST_TOS: configurationFromFile.ONE_TRUST_TOS || '',
    ONE_TRUST_PP_SERCQ_SEND: configurationFromFile.ONE_TRUST_PP_SERCQ_SEND || '',
    ONE_TRUST_TOS_SERCQ_SEND: configurationFromFile.ONE_TRUST_TOS_SERCQ_SEND || '',
    ONE_TRUST_SERCQ_SEND_DRAFT_MODE: Boolean(configurationFromFile.ONE_TRUST_SERCQ_SEND_DRAFT_MODE),
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    PAYMENT_DISCLAIMER_URL: configurationFromFile.PAYMENT_DISCLAIMER_URL || '',
    IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
    URL_FE_LOGOUT: '/auth/logout',
    VERSION,
    LANDING_SITE_URL: configurationFromFile.LANDING_SITE_URL || '',
    DELEGATIONS_TO_PG_ENABLED: Boolean(configurationFromFile.DELEGATIONS_TO_PG_ENABLED),
    WORK_IN_PROGRESS: Boolean(configurationFromFile.WORK_IN_PROGRESS),
    F24_DOWNLOAD_WAIT_TIME: configurationFromFile.F24_DOWNLOAD_WAIT_TIME || 0,
    DOD_DISABLED: Boolean(configurationFromFile.DOD_DISABLED)
  };
}

export async function loadPfConfiguration(): Promise<void> {
  await Configuration.load(new PfConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
