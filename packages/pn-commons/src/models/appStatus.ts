/* eslint-disable max-classes-per-file */

import { dataRegex } from "@pagopa-pn/pn-commons";
import { Validator } from "@pagopa-pn/pn-validator";

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
 export interface BEDowntime {
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
export interface BEStatus {
  functionalities: Array<string>;
  openIncidents: Array<BEDowntime>;
}

export interface BEDowntimeLogPage {
  result: Array<BEDowntime>;
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

export class BEDowntimeValidator extends Validator<BEDowntime> {
  constructor() {
    super();
    this.ruleFor('functionality').customValidator(validateString).isUndefined(true);
    // this.ruleFor('functionality').isUndefined(true);
    this.ruleFor('status').isOneOf(Object.values(DowntimeStatus) as Array<string>).isUndefined(true);
    this.ruleFor('startDate').customValidator(validateIsoDate(true));
    this.ruleFor('endDate').customValidator(validateIsoDate(false));
    this.ruleFor('legalFactId').customValidator(validateString);
    this.ruleFor('fileAvailable').customValidator(validateBoolean);
  }
}

export class BEStatusValidator extends Validator<BEStatus> {
  constructor() {
    super();
    this.ruleFor("functionalities").isEmpty(true).forEachElement(rules => rules.customValidator(validateString));
    this.ruleFor("openIncidents").forEachElement(rules => rules.setValidator(new BEDowntimeValidator()));
  }
}

export class BEDowntimeLogPageValidator extends Validator<BEDowntimeLogPage> {
  constructor() {
    super();
    this.ruleFor('result').forEachElement(rules => rules.setValidator(new BEDowntimeValidator())).isUndefined(true);
    this.ruleFor('nextPage').customValidator(validateString);
  }
}


