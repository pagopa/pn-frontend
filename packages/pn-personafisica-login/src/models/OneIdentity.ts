export type OidcAuthorizeParams = {
  entityId: string;
  aar?: string;
  retrievalId?: string;
};

export type OidcAuthorizeResponse = {
  location: string;
};

/**
 * Error codes the One Identity login error page can receive in the `error` query param.
 */
export enum OneIdentityErrorCode {
  ACCESS_DENIED = 'access_denied',
  INVALID_REQUEST = 'invalid_request',
  INVALID_SCOPE = 'invalid_scope',
  SERVER_ERROR = 'server_error',
  UNSUPPORTED_RESPONSE_TYPE = 'unsupported_response_type',
  /** Internal code (not sent by One Identity): set by the login page when the authorize call fails */
  AUTHORIZE_ERROR = 'authorize_error',
}
