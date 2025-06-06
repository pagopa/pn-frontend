export interface SupportForm {
  email: string;
  confirmEmail: string;
}

export interface ZendeskAuthorizationDTO {
  action_url: string;
  jwt: string;
  return_to: string;
}

export interface ZendeskAuthorizationRequest {
  email: string;
  data?: {
    traceId: string;
  };
}
