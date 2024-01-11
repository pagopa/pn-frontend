import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';
import { StringRuleValidator } from '@pagopa-pn/pn-validator/src/ruleValidators/StringRuleValidator';

interface LoginConfigurationFromFile {
  MIXPANEL_TOKEN: string;
  OT_DOMAIN_ID?: string;
  PAGOPA_HELP_EMAIL: string;
  PF_URL: string;
  SPID_TEST_ENV_ENABLED?: boolean;
  SPID_VALIDATOR_ENV_ENABLED?: boolean;
  SPID_CIE_ENTITY_ID: string;
  URL_API_LOGIN: string;
}

interface LoginConfiguration extends LoginConfigurationFromFile {
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  OT_DOMAIN_ID: string;
  PAGOPA_HELP_EMAIL: string;
  PF_URL: string;
  ROUTE_LOGIN: string;
  ROUTE_LOGIN_ERROR: string;
  ROUTE_LOGOUT: string;
  ROUTE_PRIVACY_POLICY: string;
  ROUTE_SUCCESS: string;
  SPID_CIE_ENTITY_ID: string;
  SPID_TEST_ENV_ENABLED: boolean;
  SPID_VALIDATOR_ENV_ENABLED: boolean;
  VERSION: string;
}

class LoginConfigurationValidator extends Validator<LoginConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('MIXPANEL_TOKEN').isString();
    this.ruleFor('SPID_TEST_ENV_ENABLED').isBoolean();
    this.ruleFor('SPID_VALIDATOR_ENV_ENABLED').isBoolean();
    this.makeRequired(
      this.ruleFor('SPID_CIE_ENTITY_ID').isString().matches(dataRegex.lettersNumbersAndDashs)
    );
    this.makeRequired(this.ruleFor('URL_API_LOGIN').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('PAGOPA_HELP_EMAIL').isString().matches(dataRegex.email));
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.lettersNumbersAndDashs);
    this.makeRequired(this.ruleFor('PF_URL').isString().matches(dataRegex.htmlPageUrl));
  }

  makeRequired(rule: StringRuleValidator<LoginConfigurationFromFile, string>): void {
    rule.not().isEmpty().not().isUndefined().not().isNull();
  }
}

export function getConfiguration(): LoginConfiguration {
  const configurationFromFile = Configuration.get<LoginConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const VERSION = import.meta.env.VITE_APP_VERSION ?? '';

  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID ?? '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    SPID_TEST_ENV_ENABLED: Boolean(configurationFromFile.SPID_TEST_ENV_ENABLED),
    SPID_VALIDATOR_ENV_ENABLED: Boolean(configurationFromFile.SPID_VALIDATOR_ENV_ENABLED),
    VERSION,
    ROUTE_LOGOUT: '/logout',
    ROUTE_LOGIN: '/login',
    ROUTE_LOGIN_ERROR: '/login/error',
    ROUTE_SUCCESS: '/login/success',
    ROUTE_PRIVACY_POLICY: configurationFromFile.PF_URL + '/informativa-privacy',
  };
}

export async function loadLoginConfiguration(): Promise<void> {
  await Configuration.load(new LoginConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
