/* eslint-disable max-classes-per-file */

import { Validator } from "@pagopa-pn/pn-validator";
import { dataRegex } from "../utils";

/* ------------------------------------------------------------------------
   Types for specific attributes
   ------------------------------------------------------------------------ */
export enum DowntimeStatus {
  OK = "OK",
  KO = "KO",
}

export enum KnownFunctionality {
  NotificationCreate = "NOTIFICATION_CREATE",
  NotificationVisualization = "NOTIFICATION_VISUALIZATION",
  NotificationWorkflow = "NOTIFICATION_WORKFLOW",
}

export function isKnownFunctionality(functionality: string): boolean {
  return Object.values(KnownFunctionality).includes(functionality as KnownFunctionality);
}


/* ------------------------------------------------------------------------
   Params for API calls
   ------------------------------------------------------------------------ */
export interface GetDowntimeHistoryParams {
  startDate: string;
  endDate?: string;
  functionality?: Array<KnownFunctionality>;
  page?: string;
  size?: string;
}


/* ------------------------------------------------------------------------
   Internal model
   ------------------------------------------------------------------------ */

export interface Downtime {
  rawFunctionality: string;
  knownFunctionality?: KnownFunctionality;
  status: DowntimeStatus;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

export interface FunctionalityStatus {
  rawFunctionality: string;
  knownFunctionality?: KnownFunctionality;
  isOperative: boolean;
  currentDowntime?: Downtime;
}

export interface AppCurrentStatus {
  appIsFullyOperative: boolean;
  statusByFunctionality: Array<FunctionalityStatus>;
  lastCheckTimestamp: string;
}

export interface DowntimeLogPage {
  downtimes: Array<Downtime>;
  nextPage?: string;
}

// use in internal model the same format for legal fact documents 
// as in the BE response
export interface LegalFactDocumentDetails {
  filename: string;
  contentLength: number;
  url: string;
}


/* ------------------------------------------------------------------------
   BE responses
   ------------------------------------------------------------------------ */

/** 
 * Possible errors
 * - functionality not in the expected set 
 *   (if possible, taken from the response from /downtime/v1/status)
 *   but in order to verify it, I should be able to access the Redux store
 *   (to avoid re-fetching the set of functionalities each time downtimes are retrieved).
 *   Hence I won't validate, and rather indicate "unknown functionality" in the FE.
 * - status not in the DowntimeStatus set
 * - startDate not a valid date
 * - endDate, if present, not a valid date
 */
 export interface DowntimeDTO {
  functionality: string;
  status: string;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

/**
 * Possible errors: just those of open incidents
 */
export interface AppStatusDTO {
  functionalities: Array<string>;
  openIncidents: Array<DowntimeDTO>;
}

export interface DowntimeLogPageDTO {
  result: Array<DowntimeDTO>;
  nextPage?: string;
}



/* ------------------------------------------------------------------------
   validation - custom validators
   ------------------------------------------------------------------------ */
function validateIsoDate(required: boolean) {
  return (value: string | undefined) => {
    const isOK = value 
      ? dataRegex.isoDate.test(value) && !Number.isNaN(Date.parse(value)) 
      : !required;
    return isOK ? null : "A date in ISO format is expected";
  };
}

function validateString(value: string | undefined | null): string | null {
  const isOK = value === undefined || value === null || typeof value === 'string';
  return isOK ? null : "A string is expected";
}

function validateBoolean(value: boolean | undefined | null): string | null {
  const isOK = value === undefined || value === null || typeof value === 'boolean';
  return isOK ? null : "A boolean is expected";
}
    
    
/* ------------------------------------------------------------------------
    validation - BE response validators
    ------------------------------------------------------------------------ */

export class BEDowntimeValidator extends Validator<DowntimeDTO> {
  constructor() {
    super();
    this.ruleFor('functionality').isString().customValidator(validateString).not().isUndefined();
    // this.ruleFor('functionality').isUndefined(true);
    this.ruleFor('status').isString().isOneOf(Object.values(DowntimeStatus) as Array<string>).not().isUndefined();
    this.ruleFor('startDate').isString().customValidator(validateIsoDate(true));
    this.ruleFor('endDate').isString().customValidator(validateIsoDate(false));
    this.ruleFor('legalFactId').isString().customValidator(validateString);
    this.ruleFor('fileAvailable').isBoolean().customValidator(validateBoolean);
  }
}

export class AppStatusDTOValidator extends Validator<AppStatusDTO> {
  constructor() {
    super();
    this.ruleFor("functionalities").isArray().not().isEmpty().forEachElement(rules => rules.isString().customValidator(validateString));
    this.ruleFor("openIncidents").isArray().forEachElement(rules => rules.isObject().setValidator(new BEDowntimeValidator()));
  }
}

export class DowntimeLogPageDTOValidator extends Validator<DowntimeLogPageDTO> {
  constructor() {
    super();
    this.ruleFor('result').isArray().forEachElement(rules => rules.isObject().setValidator(new BEDowntimeValidator())).not().isUndefined();
    this.ruleFor('nextPage').isString().customValidator(validateString);
  }
}


