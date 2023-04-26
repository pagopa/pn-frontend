import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';
import { StringRuleValidator } from "@pagopa-pn/pn-validator/src/ruleValidators/StringRuleValidator";

interface PfConfigurationFromFile {
  API_BASE_URL: string;
  DISABLE_INACTIVITY_HANDLER?: boolean;
  MIXPANEL_TOKEN: string;
  ONE_TRUST_DRAFT_MODE?: boolean;
  ONE_TRUST_PARTICIPATING_ENTITIES?: string;
  ONE_TRUST_PP?: string;
  ONE_TRUST_TOS?: string;
  OT_DOMAIN_ID?: string;
  PAGOPA_HELP_EMAIL: string;
  PAYMENT_DISCLAIMER_URL?: string;
  URL_FE_LOGIN: string;
  URL_CHECKOUT: string;
  LANDING_SITE_URL: string;
  // this will be removed when delegations to pg works correctly
  DELEGATIONS_TO_PG_ENABLED: boolean;
}

interface PfConfiguration extends PfConfigurationFromFile {
  DISABLE_INACTIVITY_HANDLER: boolean;
  IS_DEVELOP: boolean;
  LOG_REDUX_ACTIONS: boolean;
  MOCK_USER: boolean;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PARTICIPATING_ENTITIES: string;
  ONE_TRUST_PP: string;
  ONE_TRUST_TOS: string;
  OT_DOMAIN_ID: string;
  PAGOPA_HELP_EMAIL: string;
  PAYMENT_DISCLAIMER_URL: string;
  URL_FE_LOGOUT: string;
  VERSION: string;
  LANDING_SITE_URL: string;
  DELEGATIONS_TO_PG_ENABLED: boolean;
}

class PfConfigurationValidator extends Validator<PfConfigurationFromFile> {
  constructor() {
    super();
    this.makeRequired(this.ruleFor('API_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('URL_FE_LOGIN').isString().matches((dataRegex.htmlPageUrl)));
    this.makeRequired(this.ruleFor('PAGOPA_HELP_EMAIL').isString().matches(dataRegex.email));
    this.ruleFor('MIXPANEL_TOKEN').isString();
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_PARTICIPATING_ENTITIES').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('ONE_TRUST_TOS').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('LANDING_SITE_URL').isString();
    this.ruleFor('DELEGATIONS_TO_PG_ENABLED').isBoolean();
  }

  makeRequired(rule: StringRuleValidator<PfConfigurationFromFile, string>): void {
    rule.not().isEmpty().not().isUndefined().not().isNull();
  }
}

export function getConfiguration(): PfConfiguration {
  const configurationFromFile = Configuration.get<PfConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const VERSION = process.env.REACT_APP_VERSION ?? '';
  return {
    ...configurationFromFile,
    DISABLE_INACTIVITY_HANDLER: Boolean(configurationFromFile.DISABLE_INACTIVITY_HANDLER),
    MIXPANEL_TOKEN: configurationFromFile.MIXPANEL_TOKEN || 'DUMMY',
    ONE_TRUST_DRAFT_MODE: Boolean(configurationFromFile.ONE_TRUST_DRAFT_MODE),
    ONE_TRUST_PARTICIPATING_ENTITIES: configurationFromFile.ONE_TRUST_PARTICIPATING_ENTITIES || '',
    ONE_TRUST_PP: configurationFromFile.ONE_TRUST_PP || '',
    ONE_TRUST_TOS: configurationFromFile.ONE_TRUST_TOS || '',
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    PAYMENT_DISCLAIMER_URL: configurationFromFile.PAYMENT_DISCLAIMER_URL || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
    URL_FE_LOGOUT: `${configurationFromFile.URL_FE_LOGIN}logout`,
    VERSION,
    LANDING_SITE_URL: configurationFromFile.LANDING_SITE_URL || '',
    DELEGATIONS_TO_PG_ENABLED: Boolean(configurationFromFile.DELEGATIONS_TO_PG_ENABLED)
  };
}

export async function loadPfConfiguration(): Promise<void> {
  await Configuration.load(new PfConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
