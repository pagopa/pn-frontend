export interface SupportForm {
  email: string;
  confirmEmail: string;
}

export interface ZendeskAuthorizationDTO {
  action: string;
  jwt: string;
  return_to: string;
}
