/* eslint-disable max-classes-per-file */

import { dataRegex } from "@pagopa-pn/pn-commons";
import { Validator } from "@pagopa-pn/pn-validator";

/* ------------------------------------------------------------------------
   Types for specific attributes
   ------------------------------------------------------------------------ */
export enum IncidentStatus {
  OK = "OK",
  KO = "KO",
}

export enum KnownFunctionality {
  NotificationCreate = "NOTIFICATION_CREATE",
  NotificationVisualization = "NOTIFICATION_VISUALIZZATION",
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

export interface Incident {
  rawFunctionality: string;
  knownFunctionality?: KnownFunctionality;
  status: IncidentStatus;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

export interface FunctionalityStatus {
  rawFunctionality: string;
  knownFunctionality?: KnownFunctionality;
  isOperative: boolean;
  currentIncident?: Incident;
}

export interface AppCurrentStatus {
  appIsFullyOperative: boolean;
  statusByFunctionality: Array<FunctionalityStatus>;
}

export interface IncidentsPage {
  incidents: Array<Incident>;
  nextPage?: string;
}


/* ------------------------------------------------------------------------
   BE responses
   ------------------------------------------------------------------------ */

/** 
 * Possible errors
 * - functionality not in the expected set 
 *   (if possible, taken from the response from /downtime/v1/status)
 *   but in order to verify it, I should be able to access the Redux store
 *   (to avoid re-fetching the set of functionalities each time incidents are retrieved).
 *   Hence I won't validate, and rather indicate "unknown functionality" in the FE.
 * - status not in the IncidentStatus set
 * - startDate not a valid date
 * - endDate, if present, not a valid date
 */
 export interface BEIncident {
  functionality: string;
  status: string;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

/**
 * Possible errors: just those of incidents
 */
export interface BEStatus {
  functionalities: Array<string>;
  openIncidents: Array<BEIncident>;
}

export interface BEDowntimePage {
  result: Array<BEIncident>;
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

function validateString(value: string | undefined): string | null {
  const isOK = value === undefined || typeof value === 'string';
  return isOK ? null : "A string is expected";
}

function validateBoolean(value: boolean | undefined): string | null {
  const isOK = value === undefined || typeof value === 'boolean';
  return isOK ? null : "A boolean is expected";
}
    
    
/* ------------------------------------------------------------------------
    validation - BE response validators
    ------------------------------------------------------------------------ */

export class BEIncidentValidator extends Validator<BEIncident> {
  constructor() {
    super();
    this.ruleFor('functionality').customValidator(validateString).isUndefined(true);
    // this.ruleFor('functionality').isUndefined(true);
    this.ruleFor('status').isOneOf(Object.values(IncidentStatus) as Array<string>).isUndefined(true);
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
    this.ruleFor("openIncidents").forEachElement(rules => rules.setValidator(new BEIncidentValidator()));
  }
}

export class BEDowntimePageValidator extends Validator<BEDowntimePage> {
  constructor() {
    super();
    this.ruleFor('result').forEachElement(rules => rules.setValidator(new BEIncidentValidator())).isUndefined(true);
    this.ruleFor('nextPage').customValidator(validateString);
  }
}


