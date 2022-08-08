import { BasicUser } from "@pagopa-pn/pn-commons";

export interface User extends BasicUser {
  sessionToken: string;
  name: string;
  family_name: string;
  fiscal_number: string;
  email: string;
  mobile_phone: string;
  from_aa: boolean;
  uid: string;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
}
