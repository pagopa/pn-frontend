import { AppRouteParams, BasicUser } from '@pagopa-pn/pn-commons';

export interface User extends BasicUser {
  from_aa: boolean;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  source?: UserSource;
}

export enum SourceChannel {
  B2B = 'B2B',
  WEB = 'WEB',
  TPP = 'TPP',
}

export interface UserSource {
  channel: SourceChannel;
  details: string;
  retrievalId: string;
}

export interface BodySourceRequest {
  source?: {
    type: 'TPP' | 'QR';
    id: string;
  };
}

export interface TokenExchangeBody extends BodySourceRequest {
  authorizationToken: string;
}

export interface OneIdentityExchangeCodeBody extends BodySourceRequest {
  code: string;
  state: string;
  nonce: string;
  redirect_uri: string;
}

export interface TokenExchangeRequest {
  spidToken: string;
  rapidAccess?: [AppRouteParams, string];
}

export interface OneIdentityCodeExchangeRequest {
  code: string;
  state: string;
  nonce: string;
  redirectUri: string;
  rapidAccess?: [AppRouteParams, string];
}

export const paramsToSourceType: Record<AppRouteParams, 'TPP' | 'QR'> = {
  [AppRouteParams.AAR]: 'QR',
  [AppRouteParams.RETRIEVAL_ID]: 'TPP',
};
