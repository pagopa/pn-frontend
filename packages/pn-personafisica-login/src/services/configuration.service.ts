import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface LoginConfiguration {
  MIXPANEL_TOKEN: string;
  OT_DOMAIN_ID?: string;
  PAGOPA_HELP_EMAIL: string;
  PF_URL: string;
  SPID_TEST_ENV_ENABLED?: boolean;
  SPID_VALIDATOR_ENV_ENABLED?: boolean;
  SPID_CIE_ENTITY_ID: string;
  URL_API_LOGIN: string;
  APP_VERSION: string;
  IS_DEVELOP: boolean;
}

class LoginConfigurationValidator extends Validator<LoginConfiguration> {
  constructor() {
    super();
    this.ruleFor('MIXPANEL_TOKEN').isString().isRequired();
    this.ruleFor('SPID_TEST_ENV_ENABLED').isBoolean();
    this.ruleFor('SPID_VALIDATOR_ENV_ENABLED').isBoolean();
    this.ruleFor('SPID_CIE_ENTITY_ID')
      .isString()
      .isRequired()
      .matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('URL_API_LOGIN').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('OT_DOMAIN_ID').isString().isRequired().matches(dataRegex.lettersNumbersAndDashs);
    this.ruleFor('PF_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
  }
}

export function getConfiguration(): LoginConfiguration {
  const configurationFromFile = Configuration.get<LoginConfiguration>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? '';

  return {
    ...configurationFromFile,
    IS_DEVELOP,
    APP_VERSION,
  };
}

export async function loadLoginConfiguration(): Promise<void> {
  await Configuration.load(new LoginConfigurationValidator());
  getConfiguration().IS_DEVELOP && console.log(getConfiguration());
}
