/* eslint-disable max-classes-per-file */
import { Validator } from '@pagopa-pn/pn-validator';

import {
  AppCurrentStatus,
  Downtime,
  DowntimeLogHistory,
  DowntimeStatus,
} from '../models/AppStatus';
import { dataRegex } from '../utility/string.utility';

/* ------------------------------------------------------------------------
   validation - custom validators
   ------------------------------------------------------------------------ */
function validateIsoDate(required: boolean) {
  return (value: string | undefined) => {
    const isOK = value
      ? dataRegex.isoDate.test(value) && !Number.isNaN(Date.parse(value))
      : !required;
    return isOK ? null : 'A date in ISO format is expected';
  };
}

function validateString(value: string | undefined | null): string | null {
  const isOK = value === undefined || value === null || typeof value === 'string';
  return isOK ? null : 'A string is expected';
}

function validateBoolean(value: boolean | undefined | null): string | null {
  const isOK = value === undefined || value === null || typeof value === 'boolean';
  return isOK ? null : 'A boolean is expected';
}

/* ------------------------------------------------------------------------
      validation - BE response validators
      ------------------------------------------------------------------------ */

export class BEDowntimeValidator extends Validator<Downtime> {
  constructor() {
    super();
    this.ruleFor('functionality').isString().customValidator(validateString).not().isUndefined();
    this.ruleFor('status').isString().isOneOf(Object.values(DowntimeStatus)).not().isUndefined();
    this.ruleFor('startDate').isString().customValidator(validateIsoDate(true));
    this.ruleFor('endDate').isString().customValidator(validateIsoDate(false));
    this.ruleFor('legalFactId').isString().customValidator(validateString);
    this.ruleFor('fileAvailable').isBoolean().customValidator(validateBoolean);
  }
}

export class AppStatusDTOValidator extends Validator<AppCurrentStatus> {
  constructor() {
    super();
    this.ruleFor('appIsFullyOperative').isBoolean();
    this.ruleFor('lastCheckTimestamp').isString().customValidator(validateIsoDate(true));
  }
}

export class DowntimeLogHistoryDTOValidator extends Validator<DowntimeLogHistory> {
  constructor() {
    super();
    this.ruleFor('result')
      .isArray()
      .forEachElement((rules) => rules.isObject().setValidator(new BEDowntimeValidator()))
      .not()
      .isUndefined();
    this.ruleFor('nextPage').isString().customValidator(validateString);
  }
}
