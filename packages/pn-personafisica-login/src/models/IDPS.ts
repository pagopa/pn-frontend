export type IDP = {
  entityID: string;
  pointer: string;
  status: string;
  idpSSOEndpoints: {
    ['urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST']: string;
  };
  certificates: Array<string>;
  friendlyName: string;
  active: boolean;
};
