export type HTTPStatusCode = number;

export enum AppResponseOutcome {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

/**
 * The following ServerResponse interfaces is used to model DTO
 * received after any webapi call
 */
export interface ServerResponse {
  status?: HTTPStatusCode;
  data?: ServerResponseData;
}

export interface ServerResponseError {
  code: string;
  /**
   * if present contains a string useful to identify the element
   * that caused the error (can be useful on form submission and
   * other requests having many fields that need to be validated)
   */
  element?: string;
  detail?: string;
}

export interface AppResponse {
  action: string;
  status?: HTTPStatusCode;
  traceId?: string;
  timestamp?: string;
  errors?: Array<AppResponseError>;
}

export interface AppResponseError {
  code: string;
  element?: string;
  detail?: string;
  permanent: boolean;
  message: {
    title: string;
    content: string;
  };
}

export interface ErrorMessage {
  title: string;
  content: string;
}

export enum ServerResponseErrorCode {
  /**
   * Used by AppErrorFactory as default when the received error code
   * has no correspondent subtype to be mapped to
   */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',

  // GENERIC ERROR
  BAD_REQUEST_ERROR = 'BAD_REQUEST_ERROR',
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
  UNAVAILABLE_FOR_LEGAL_REASONS_ERROR = 'UNAVAILABLE_FOR_LEGAL_REASONS_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_SERVER_ERROR = 'SERVER_ERROR',

  UNHANDLED_ERROR = 'UNHANDLED_ERROR',
  GENERIC_ERROR = 'GENERIC_ERROR',
}

interface ServerResponseData {
  status?: HTTPStatusCode;
  traceId?: string;
  timestamp?: string;
  errors?: Array<ServerResponseError>;
}
