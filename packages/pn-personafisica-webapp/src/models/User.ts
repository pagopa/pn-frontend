import { AppRouteParams, BasicUser, BasicUserClaims } from '@pagopa-pn/pn-commons';

export interface User extends BasicUser, BasicUserClaims {
  from_aa: boolean;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  spid_level?: string;
  source?: UserSource;
}

export interface OneIdentityUser extends User {
  idp: string;
  aar?: string;
  retrievalId?: string;
}

export enum SourceChannel {
  B2B = 'B2B',
  WEB = 'WEB',
  TPP = 'TPP',
}

export interface UserSource {
  channel: SourceChannel;
  details: string;
  retrievalId?: string;
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

export interface OneIdentityExchangeCodeBody {
  code: string;
  state: string;
}

export interface TokenExchangeRequest {
  spidToken: string;
  rapidAccess?: [AppRouteParams, string];
}

export interface FimsTokenExchangeRequest {
  fimsToken: string;
}

export const paramsToSourceType: Record<AppRouteParams, 'TPP' | 'QR'> = {
  [AppRouteParams.AAR]: 'QR',
  [AppRouteParams.RETRIEVAL_ID]: 'TPP',
};

export enum LoginProvider {
  SPIDHUB = 'SPIDHUB',
  FIMS = 'FIMS',
  ONEIDENTITY = 'ONEIDENTITY',
}
