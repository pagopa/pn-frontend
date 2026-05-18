export type OidcAuthorizeParams = {
  entityId: string;
  aar?: string;
  retrievalId?: string;
};

export type OidcAuthorizeResponse = {
  location: string;
};
