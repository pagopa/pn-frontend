import { BasicUser } from "@pagopa-pn/pn-commons";

export interface User extends BasicUser {
  // On 2023.01.19, I tried with several users in DEV and none of them 
  // includes mobile_phone in the response from token exchange.
  // We leave the issue about the need to include this field to further investigation.
  // -----------------------------
  // Carlos Lombardi, 2023.01.19
  mobile_phone: string;
  from_aa: boolean;
  aud: string;
  level: string;
  iat: number;
  exp: number;
  iss: string;
  jti: string;
}
