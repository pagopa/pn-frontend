export type HTTPStatusCode = number | string;

export type AppResponseOutcome = 'success' | 'error';

/**
 * The following ServerResponse interfaces is used to model DTO
 * received after any webapi call
 */
export interface ServerResponse {
  status?: HTTPStatusCode;
  data?: ServerResponseData;
}

export interface ServerResponseData {
  status?: HTTPStatusCode;
  traceId?: string;
  timestamp?: string;
  errors?: Array<ServerResponseError>;
}

export interface ServerResponseError {
  code: ServerResponseErrorCode;
  /**
   * if present contains a string useful to identify the element
   * that caused the error (can be useful on form submission and
   * other requests having many fields that need to be validated)
   */
  element?: string;
}

export interface AppResponse {
  action: string;
  status?: HTTPStatusCode;
  traceId?: string;
  timestamp?: string;
  errors?: Array<AppResponseError>;
}

export interface AppResponseError {
  code: ServerResponseErrorCode;
  element?: string;
  message: {
    title: string;
    content: string;
  }
}

export interface ErrorMessage {
  title: string;
  content: string;
}

/**
 * These codes have been retrived accessing the source code available
 * inside the exception package of every BE project on github.
 * Currently there's no centralized documentation that explains how
 * and under which circumstances a particular error is thrown.
 * Maurizio Flauti 22.09.2022
 */
export enum ServerResponseErrorCode {
  PN_MANDATE_NOTFOUND = 'PN_MANDATE_NOTFOUND',
  PN_MANDATE_ALREADYEXISTS = 'PN_MANDATE_ALREADYEXISTS',
  PN_MANDATE_NOTACCEPTABLE = 'PN_MANDATE_NOTACCEPTABLE',
  PN_MANDATE_DELEGATEHIMSELF = 'PN_MANDATE_DELEGATEHIMSELF',
  PN_MANDATE_INVALIDVERIFICATIONCODE = 'PN_MANDATE_INVALIDVERIFICATIONCODE',
  
  PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE = 'PN_USERATTRIBUTES_INVALIDVERIFICATIONCODE',
  
  /**
   * The following codes have been reported here for completeness
   * but not yet used to generate a specific message.
   * Both BE documentation and text/copy availability are needed.
   */
  PN_DELIVERY_MANDATENOTFOUND = 'PN_DELIVERY_MANDATENOTFOUND',
  PN_DELIVERY_NOTIFICATIONNOTFOUND = 'PN_DELIVERY_NOTIFICATIONNOTFOUND',
  PN_DELIVERY_FILEINFONOTFOUND = 'PN_DELIVERY_FILEINFONOTFOUND',
  PN_DELIVERY_NOTIFICATIONCOSTNOTFOUND = 'PN_DELIVERY_NOTIFICATIONCOSTNOTFOUND',
  PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT = 'PN_DELIVERY_NOTIFICATIONWITHOUTPAYMENTATTACHMENT',

  PN_DELIVERYPUSH_NOTFOUND = 'PN_DELIVERYPUSH_NOTFOUND',
  PN_DELIVERYPUSH_GETFILEERROR = 'PN_DELIVERYPUSH_GETFILEERROR',
  PN_DELIVERYPUSH_UPLOADFILEERROR = 'PN_DELIVERYPUSH_UPLOADFILEERROR',
  PN_DELIVERYPUSH_UPDATEMETAFILEERROR = 'PN_DELIVERYPUSH_UPDATEMETAFILEERROR',
  PN_DELIVERYPUSH_ERRORCOMPUTECHECKSUM = 'PN_DELIVERYPUSH_ERRORCOMPUTECHECKSUM',
  PN_DELIVERYPUSH_ATTACHMENTCHANGESTATUSFAILED = 'PN_DELIVERYPUSH_ATTACHMENTCHANGESTATUSFAILED',
  PN_DELIVERYPUSH_INVALIDEVENTCODE = 'PN_DELIVERYPUSH_INVALIDEVENTCODE',
  PN_DELIVERYPUSH_INVALIDATTEMPT = 'PN_DELIVERYPUSH_INVALIDATTEMPT',
  PN_DELIVERYPUSH_INVALIDADDRESSSOURCE = 'PN_DELIVERYPUSH_INVALIDADDRESSSOURCE',
  PN_DELIVERYPUSH_SENDDIGITALTIMELINEEVENTNOTFOUND = 'PN_DELIVERYPUSH_SENDDIGITALTIMELINEEVENTNOTFOUND',
  PN_DELIVERYPUSH_DIGITALPROGRESSTIMELINEEVENTNOTFOUND = 'PN_DELIVERYPUSH_DIGITALPROGRESSTIMELINEEVENTNOTFOUND',
  PN_DELIVERYPUSH_SCHEDULEDDIGITALTIMELINEEVENTNOTFOUND = 'PN_DELIVERYPUSH_SCHEDULEDDIGITALTIMELINEEVENTNOTFOUND',
  PN_DELIVERYPUSH_LASTADDRESSATTEMPTNOTFOUND = 'PN_DELIVERYPUSH_LASTADDRESSATTEMPTNOTFOUND',
  PN_DELIVERYPUSH_ERRORCOURTESY = 'PN_DELIVERYPUSH_ERRORCOURTESY',
  PN_DELIVERYPUSH_ERRORCOURTESYIO = 'PN_DELIVERYPUSH_ERRORCOURTESYIO',

  PN_WEBHOOK_UPDATEEVENTSTREAM = 'PN_WEBHOOK_UPDATEEVENTSTREAM',
  PN_WEBHOOK_CONSUMEEVENTSTREAM = 'PN_WEBHOOK_CONSUMEEVENTSTREAM',

  /**
   * Used by AppErrorFactory as default when the received error code
   * has no correspondent subtype to be mapped to
   */
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  
  // GENERIC ERROR
  BAD_REQUEST_ERROR = "BAD_REQUEST_ERROR",
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_SERVER_ERROR = 'SERVER_ERROR',

  // UNHANDLED
  UNHANDLED_ERROR = 'UNHANDLED_ERROR'
}