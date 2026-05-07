export type OidcAuthorizeParams = {
  entityId: string;
  aar?: string;
  retrievalId?: string;
};

export type OidcAuthorizeResponse = {
  location: string;
};

export type OidcStateDataResponse = {
  nonce: string;
  idp: string;
  aar?: string;
  retrievalId?: string;
};
