import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface LoginConfiguration {
  MIXPANEL_TOKEN: string;
  OT_DOMAIN_ID: string;
  OT_SETTINGS_TOKEN: string;
  PAGOPA_HELP_EMAIL: string;
  PF_URL: string;
  SPID_TEST_ENV_ENABLED?: boolean;
  SPID_VALIDATOR_ENV_ENABLED?: boolean;
  SPID_CIE_ENTITY_ID: string;
  URL_API_LOGIN: string;
  APP_IO_SITE: string;
  APP_IO_ANDROID: string;
  APP_IO_IOS: string;
  IS_SMART_APP_BANNER_ENABLED?: boolean;
  ACCESSIBILITY_LINK: string;
  ONE_IDENTITY_LOGIN_ENABLED: boolean;
  ONE_IDENTITY_CLIENT_ID?: string;
  ONE_IDENTITY_BASE_URL: string;
  SERCQ_SERVICE_STATEMENT_LINK: string;
  DIGITAL_IDENTITY_LINK: string;
  ONE_IDENTITY_CDN_URL: string;
  SPID_REQUEST_LINK: string;
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
    this.ruleFor('OT_SETTINGS_TOKEN').isString().isRequired().matches(dataRegex.token);
    this.ruleFor('PF_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('APP_IO_SITE').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('APP_IO_ANDROID').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('APP_IO_IOS').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('IS_SMART_APP_BANNER_ENABLED').isBoolean();
    this.ruleFor('ACCESSIBILITY_LINK').isString().isRequired();
    this.ruleFor('ONE_IDENTITY_LOGIN_ENABLED').isBoolean();
    this.ruleFor('ONE_IDENTITY_CLIENT_ID')
      .isString()
      .customValidator((value, model) => {
        if (model.ONE_IDENTITY_LOGIN_ENABLED && !value) {
          return 'ONE_IDENTITY_CLIENT_ID is required when ONE_IDENTITY_LOGIN_ENABLED is true';
        }
        return null;
      });
    this.ruleFor('ONE_IDENTITY_BASE_URL').isString().isRequired();
    this.ruleFor('SERCQ_SERVICE_STATEMENT_LINK').isString().isRequired();
    this.ruleFor('DIGITAL_IDENTITY_LINK').isString().isRequired();
    this.ruleFor('ONE_IDENTITY_CDN_URL').isString().isRequired();
    this.ruleFor('SPID_REQUEST_LINK').isString().isRequired();
  }
}

export function getConfiguration(): LoginConfiguration {
  return Configuration.get<LoginConfiguration>();
}

export async function loadLoginConfiguration(): Promise<void> {
  await Configuration.load(new LoginConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
