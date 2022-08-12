export interface BasicUser {
  sessionToken: string;
  name: string;
  family_name: string;
  fiscal_number: string;
  email: string;
  uid: string;
}

export const basicNoLoggedUserData = {
  sessionToken: '',
  name: '',
  family_name: '',
  fiscal_number: '',
  email: '',
  uid: '',
} as BasicUser;
