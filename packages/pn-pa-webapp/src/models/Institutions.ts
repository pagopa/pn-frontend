export interface Institution {
  address: string;
  aooParentCode: string;
  assistanceContacts: AssistanceContacts;
  companyInformations: CompanyInformations;
  description: string;
  digitalAddress: string;
  dpoData: DpoData;
  externalId: string;
  id: string;
  institutionType: string;
  origin: string;
  originId: string;
  rootParent: RootParent;
  pspData: PspData;
  recipientCode: string;
  status: string;
  subunitCode: string;
  subunitType: string;
  taxCode: string;
  userProductRoles: Array<string>;
  zipCode: string;
}

export interface AssistanceContacts {
  supportEmail: string;
  supportPhone: string;
}

export interface CompanyInformations {
  businessRegisterPlace: string;
  rea: string;
  shareCapital: string;
}

export interface DpoData {
  address: string;
  email: string;
  pec: string;
}

export interface PspData {
  abiCode: string;
  businessRegisterNumber: string;
  legalRegisterName: string;
  legalRegisterNumber: string;
  vatNumberGroup: boolean;
}

export interface RootParent {
  description: string;
  id: string;
}
