// aligned with pn-pt-internal-v1 (pn-external-registries): PtDelegationStatus, PtInstitution
export type DelegationStatus = 'ACTIVE' | 'REVOKED';

export type InstitutionRow = {
  institutionId: string;
  institutionName: string;
  institutionTaxCode: string;
  delegationId: string;
  status: DelegationStatus;
  statusChangedAt: string;
};

export type GetInstitutionsParams = {
  search?: string;
  status?: DelegationStatus;
  limit?: number;
  lastKey?: string;
};

export type InstitutionsResponse = {
  items: Array<InstitutionRow>;
  lastKey?: string;
};
