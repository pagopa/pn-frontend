import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface PaConfigurationFromFile {
  OT_DOMAIN_ID?: string;
  SELFCARE_URL_FE_LOGIN: string;
  SELFCARE_BASE_URL: string;
  API_BASE_URL: string;
  ONE_TRUST_DRAFT_MODE?: boolean;
  ONE_TRUST_PP?: string;
  ONE_TRUST_TOS?: string;
  PAGOPA_HELP_EMAIL: string;
  DISABLE_INACTIVITY_HANDLER?: boolean;
  IS_PAYMENT_ENABLED?: boolean;
  MIXPANEL_TOKEN?: string;
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
}

class PaConfigurationValidator extends Validator<PaConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.token);
    this.makeRequired(this.ruleFor('SELFCARE_URL_FE_LOGIN').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('SELFCARE_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('API_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().matches(dataRegex.token);
    this.ruleFor('ONE_TRUST_TOS').isString().matches(dataRegex.token);
    this.makeRequired(this.ruleFor('PAGOPA_HELP_EMAIL').isString().matches(dataRegex.email));
    this.ruleFor('DISABLE_INACTIVITY_HANDLER').isBoolean();
    this.ruleFor('IS_PAYMENT_ENABLED').isBoolean();
    this.ruleFor('MIXPANEL_TOKEN').isString();
  }

  makeRequired(rule: any): void {
    rule.not().isEmpty().not().isUndefined().not().isNull();
  }
}

export function getConfiguration(): PaConfiguration {
  const configurationFromFile = Configuration.get<PaConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const APP_VERSION = process.env.REACT_APP_VERSION ?? '';
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
  };
}

export async function loadPaConfiguration(): Promise<void> {
  await Configuration.load(new PaConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
