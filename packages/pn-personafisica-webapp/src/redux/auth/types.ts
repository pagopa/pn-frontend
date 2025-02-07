import { BasicUser } from "@pagopa-pn/pn-commons";

export interface User extends BasicUser {
  from_aa: boolean;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
  retrievalId?: string; // TODO verificare il nome
  tppId?: string;       // TODO verificare il nome
}
