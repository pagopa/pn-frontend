import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface PtConfiguration {
  API_BASE_URL: string;
}

class PtConfigurationValidator extends Validator<PtConfiguration> {
  constructor() {
    super();
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
  }
}

export function getConfiguration(): PtConfiguration {
  return Configuration.get<PtConfiguration>();
}

export async function loadPtConfiguration(): Promise<void> {
  await Configuration.load(new PtConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
