import { Configuration } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

interface PgConfigurationFromFile {
  OT_DOMAIN_ID?: string;
}

interface PgConfiguration extends PgConfigurationFromFile {
  OT_DOMAIN_ID: string;
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  LOG_REDUX_ACTIONS: boolean;
}

class PgConfigurationValidator extends Validator<PgConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString();
  }
}

export function getConfiguration(): PgConfiguration {
  const configurationFromFile = Configuration.get<PgConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
  };
}

export async function loadPgConfiguration(): Promise<void> {
  await Configuration.load(new PgConfigurationValidator());
  console.log(getConfiguration());
}