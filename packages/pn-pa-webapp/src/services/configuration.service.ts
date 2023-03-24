import { getConfiguration, loadConfiguration } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface PaConfigurationFromFile {
  OT_DOMAIN_ID?: string;
}

interface PaConfiguration extends PaConfigurationFromFile {
  OT_DOMAIN_ID: string;
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  LOG_REDUX_ACTIONS: boolean;
}

class PaConfigurationValidator extends Validator<PaConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString();
  }
}

export function getPaConfiguration(): PaConfiguration {
  const configurationFromFile = getConfiguration<PaConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
  };
}

export async function loadPaConfiguration(): Promise<void> {
  await loadConfiguration(new PaConfigurationValidator());
  console.log(getPaConfiguration());
}
