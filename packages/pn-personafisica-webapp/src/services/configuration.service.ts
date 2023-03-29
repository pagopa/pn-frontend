import { Configuration } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface PfConfigurationFromFile {
  OT_DOMAIN_ID?: string;
}

interface PfConfiguration extends PfConfigurationFromFile {
  OT_DOMAIN_ID: string;
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  LOG_REDUX_ACTIONS: boolean;
}

class PfConfigurationValidator extends Validator<PfConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString();
  }
}

export function getConfiguration(): PfConfiguration {
  const configurationFromFile = Configuration.get<PfConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
  };
}

export async function loadPfConfiguration(): Promise<void> {
  await Configuration.load(new PfConfigurationValidator());
  console.log(getConfiguration());
}