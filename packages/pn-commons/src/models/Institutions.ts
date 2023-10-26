import { PartyEntity } from '@pagopa/mui-italia';

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

interface AssistanceContacts {
  supportEmail: string;
  supportPhone: string;
}

interface CompanyInformations {
  businessRegisterPlace: string;
  rea: string;
  shareCapital: string;
}

interface DpoData {
  address: string;
  email: string;
  pec: string;
}

interface PspData {
  abiCode: string;
  businessRegisterNumber: string;
  legalRegisterName: string;
  legalRegisterNumber: string;
  vatNumberGroup: boolean;
}

interface RootParent {
  description: string;
  id: string;
}

export interface PartyEntityWithUrl extends PartyEntity {
  entityUrl: string;
}
