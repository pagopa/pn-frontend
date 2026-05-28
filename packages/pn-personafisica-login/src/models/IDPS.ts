export type IDP = {
  entityID: string;
  pointer: string;
  status: string;
  idpSSOEndpoints: Record<string, string>;
  certificates: Array<string>;
  friendlyName: string;
  active: boolean;
};
