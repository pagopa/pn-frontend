export interface BasicUser {
  sessionToken: string;
  email: string;
  uid: string;
}

// User info received from Spid / CIE
export interface BasicUserClaims {
  name: string;
  family_name: string;
  fiscal_number: string;
}

export const basicNoLoggedUserData: BasicUser = {
  sessionToken: '',
  email: '',
  uid: '',
};

export interface ConsentUser {
  accepted: boolean;
  isFirstAccept: boolean;
  consentVersion: string;
}
