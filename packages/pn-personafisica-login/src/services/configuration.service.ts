import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
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
  return Configuration.get<LoginConfiguration>();
}

export async function loadLoginConfiguration(): Promise<void> {
  await Configuration.load(new LoginConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
