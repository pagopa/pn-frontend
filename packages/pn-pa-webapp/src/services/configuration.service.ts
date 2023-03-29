import { Configuration, dataRegex } from '@pagopa-pn/pn-commons';
import { Validator } from '@pagopa-pn/pn-validator';
import { StringRuleValidator } from '@pagopa-pn/pn-validator/src/ruleValidators/StringRuleValidator';

interface PaConfigurationFromFile {
  OT_DOMAIN_ID?: string;
  SELFCARE_URL_FE_LOGIN: string;
  SELFCARE_BASE_URL: string;
  API_BASE_URL: string;
  ONE_TRUST_DRAFT_MODE?: boolean;
  ONE_TRUST_PP?: string;
}

interface PaConfiguration extends PaConfigurationFromFile {
  OT_DOMAIN_ID: string;
  ONE_TRUST_DRAFT_MODE: boolean;
  ONE_TRUST_PP: string;
  IS_DEVELOP: boolean;
  MOCK_USER: boolean;
  LOG_REDUX_ACTIONS: boolean;
}

class PaConfigurationValidator extends Validator<PaConfigurationFromFile> {
  constructor() {
    super();
    this.ruleFor('OT_DOMAIN_ID').isString().matches(dataRegex.token);
    this.makeRequired(this.ruleFor('SELFCARE_URL_FE_LOGIN').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('SELFCARE_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.makeRequired(this.ruleFor('API_BASE_URL').isString().matches(dataRegex.htmlPageUrl));
    this.ruleFor('ONE_TRUST_DRAFT_MODE').isBoolean();
    this.ruleFor('ONE_TRUST_PP').isString().matches(dataRegex.token);
  }

  makeRequired(rule: StringRuleValidator<PaConfigurationFromFile, string>): void {
    rule.not().isEmpty().not().isUndefined().not().isNull();
  }
}

export function getConfiguration(): PaConfiguration {
  const configurationFromFile = Configuration.get<PaConfigurationFromFile>();
  const IS_DEVELOP = process.env.NODE_ENV === 'development';
  return {
    ...configurationFromFile,
    OT_DOMAIN_ID: configurationFromFile.OT_DOMAIN_ID || '',
    ONE_TRUST_DRAFT_MODE: !!configurationFromFile.ONE_TRUST_DRAFT_MODE,
    ONE_TRUST_PP: configurationFromFile.ONE_TRUST_PP || '',
    IS_DEVELOP,
    MOCK_USER: IS_DEVELOP,
    LOG_REDUX_ACTIONS: IS_DEVELOP,
  };
}

export async function loadPaConfiguration(): Promise<void> {
  await Configuration.load(new PaConfigurationValidator());
  console.log(getConfiguration());
}
