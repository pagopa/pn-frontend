import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';
import { StringRuleValidator } from '@pagopa-pn/pn-validator/src/ruleValidators/StringRuleValidator';

interface PgConfigurationFromFile {
  API_BASE_URL: string;
  DISABLE_INACTIVITY_HANDLER?: boolean;
  MIXPANEL_TOKEN: string;
  ONE_TRUST_DRAFT_MODE?: boolean;
  ONE_TRUST_PP?: string;
  ONE_TRUST_TOS?: string;
  OT_DOMAIN_ID?: string;
  PAGOPA_HELP_EMAIL: string;
  PAYMENT_DISCLAIMER_URL?: string;
  SELFCARE_BASE_URL: string;
  URL_CHECKOUT: string;
  LANDING_SITE_URL: string;
  // this will be removed when delegations to pg works correctly
  DELEGATIONS_TO_PG_ENABLED: boolean;
  WORK_IN_PROGRESS?: boolean;
  F24_DOWNLOAD_WAIT_TIME: number;
}

interface PgConfiguration extends PgConfigurationFromFile {
  DISABLE_INACTIVITY_HANDLER: boolean;
  IS_DEVELOP: boolean;
  LOG_REDUX_ACTIONS: boolean;
  MOCK_USER: boolean;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  OT_DOMAIN_ID: string;
  PAGOPA_HELP_EMAIL: string;
  PAYMENT_DISCLAIMER_URL: string;
  URL_FE_LOGOUT: string;
  VERSION: string;
  LANDING_SITE_URL: string;
  DELEGATIONS_TO_PG_ENABLED: boolean;
  WORK_IN_PROGRESS: boolean;
  F24_DOWNLOAD_WAIT_TIME: number;
}

class PgConfigurationValidator extends Validator<PgConfigurationFromFile> {
  constructor() {
    super();
    this.makeRequired(this.ruleFor('API_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('PAGOPA_HELP_EMAIL').isString().matches(dataRegex.email));
    this.makeRequired(this.ruleFor('SELFCARE_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.ruleFor('MIXPANEL_TOKEN').isString();
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_TOS').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.makeRequired(this.ruleFor('LANDING_SITE_URL').isString());
    this.ruleFor('DELEGATIONS_TO_PG_ENABLED').isBoolean();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean();
    this.ruleFor('F24_DOWNLOAD_WAIT_TIME').isNumber();
  }

  makeRequired(rule: StringRuleValidator<PgConfigurationFromFile, string>): void {
    rule.not().isEmpty().not().isUndefined().not().isNull();
  }
}

export function getConfiguration(): PgConfiguration {
  const configurationFromFile = Configuration.get<PgConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const VERSION = process.env.REACT_APP_VERSION ?? '';
  return {
    ...configurationFromFile,
    DISABLE_INACTIVITY_HANDLER: Boolean(configurationFromFile.DISABLE_INACTIVITY_HANDLER),
    MIXPANEL_TOKEN: configurationFromFile.MIXPANEL_TOKEN || 'DUMMY',
    ONE_TRUST_DRAFT_MODE: Boolean(configurationFromFile.ONE_TRUST_DRAFT_MODE),
    ONE_TRUST_PP: configurationFromFile.ONE_TRUST_PP || '',
    ONE_TRUST_TOS: configurationFromFile.ONE_TRUST_TOS || '',
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    PAYMENT_DISCLAIMER_URL: configurationFromFile.PAYMENT_DISCLAIMER_URL || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
    URL_FE_LOGOUT: `${configurationFromFile.SELFCARE_BASE_URL}/auth/logout`,
    VERSION,
    LANDING_SITE_URL: configurationFromFile.LANDING_SITE_URL || '',
    DELEGATIONS_TO_PG_ENABLED: Boolean(configurationFromFile.DELEGATIONS_TO_PG_ENABLED),
    WORK_IN_PROGRESS: Boolean(configurationFromFile.WORK_IN_PROGRESS),
    F24_DOWNLOAD_WAIT_TIME: configurationFromFile.F24_DOWNLOAD_WAIT_TIME || 0,
  };
}

export async function loadPgConfiguration(): Promise<void> {
  await Configuration.load(new PgConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
