/* ------------------------------------------------------------------------
   Types for specific attributes
   ------------------------------------------------------------------------ */
export enum DowntimeStatus {
  OK = 'OK',
  KO = 'KO',
}

export enum KnownFunctionality {
  NotificationCreate = 'NOTIFICATION_CREATE',
  NotificationVisualization = 'NOTIFICATION_VISUALIZATION',
  NotificationWorkflow = 'NOTIFICATION_WORKFLOW',
}

export function isKnownFunctionality(functionality: string): boolean {
  return Object.values(KnownFunctionality).includes(functionality as KnownFunctionality);
}

/* ------------------------------------------------------------------------
   Params for API calls
   ------------------------------------------------------------------------ */
export interface GetDowntimeHistoryParams {
  startDate?: string;
  endDate?: string;
  page?: string;
  size?: string;
}

/* ------------------------------------------------------------------------
   Internal model
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
export interface Downtime {
  functionality: KnownFunctionality;
  status: DowntimeStatus;
  startDate: string;
  endDate?: string;
  legalFactId?: string;
  fileAvailable?: boolean;
}

export interface AppCurrentStatus {
  appIsFullyOperative: boolean;
  lastCheckTimestamp: string;
}

export interface DowntimeLogHistory {
  result: Array<Downtime>;
  nextPage?: string;
}

// use in internal model the same format for legal fact documents
// as in the BE response
export interface LegalFactDocumentDetails {
  filename: string;
  contentLength: number;
  url: string;
  retryAfter?: number;
}

export interface AppStatusData {
  currentStatus?: AppCurrentStatus;
  downtimeLogPage?: DowntimeLogHistory;
  pagination: { size: number; page: number; resultPages: Array<string> };
}
