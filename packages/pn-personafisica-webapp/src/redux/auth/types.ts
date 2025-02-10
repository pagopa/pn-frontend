import { BasicUser } from '@pagopa-pn/pn-commons';

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

export interface UserSource {
  channel: string; // TPP o ??? 
  details: string;
  retrievalId: string;
}
