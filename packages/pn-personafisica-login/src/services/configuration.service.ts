import { Configuration } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface LoginConfigurationFromFile {
  OT_DOMAIN_ID?: string;
}

interface LoginConfiguration extends LoginConfigurationFromFile {
  OT_DOMAIN_ID: string;
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  LOG_REDUX_ACTIONS: boolean;
}

class LoginConfigurationValidator extends Validator<LoginConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString();
  }
}

export function getConfiguration(): LoginConfiguration {
  const configurationFromFile = Configuration.get<LoginConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
  };
}

export async function loadLoginConfiguration(): Promise<void> {
  await Configuration.load(new LoginConfigurationValidator());
  console.log(getConfiguration());
}
