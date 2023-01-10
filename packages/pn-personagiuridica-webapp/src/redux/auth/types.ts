import { BasicUser } from "@pagopa-pn/pn-commons";

export interface User extends BasicUser {
  mobile_phone: string;
  from_aa: boolean;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
}
