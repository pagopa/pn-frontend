import { Configuration, IS_DEVELOP, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';

export interface PtConfiguration {
  API_BASE_URL: string;
  PAGOPA_HELP_EMAIL: string;
  ACCESSIBILITY_LINK: string;
  SERCQ_SERVICE_STATEMENT_LINK: string;
  SELFCARE_BASE_URL: string;
  INACTIVITY_HANDLER_MINUTES: number;
  WORK_IN_PROGRESS: boolean;
  LANDING_SITE_URL: string;
}

class PtConfigurationValidator extends Validator<PtConfiguration> {
  constructor() {
    super();
    this.ruleFor('API_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('PAGOPA_HELP_EMAIL').isString().isRequired().matches(dataRegex.email);
    this.ruleFor('ACCESSIBILITY_LINK').isString().isRequired();
    this.ruleFor('SERCQ_SERVICE_STATEMENT_LINK')
      .isString()
      .isRequired()
      .matches(dataRegex.htmlPageUrl);
    this.ruleFor('SELFCARE_BASE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
    this.ruleFor('INACTIVITY_HANDLER_MINUTES').isNumber().isRequired();
    this.ruleFor('WORK_IN_PROGRESS').isBoolean().isRequired();
    this.ruleFor('LANDING_SITE_URL').isString().isRequired().matches(dataRegex.htmlPageUrl);
  }
}

export function getConfiguration(): PtConfiguration {
  return Configuration.get<PtConfiguration>();
}

export async function loadPtConfiguration(): Promise<void> {
  await Configuration.load(new PtConfigurationValidator());
  IS_DEVELOP && console.log(getConfiguration());
}
