export type DelegationParty = { name: string; uniqueIdentifier: string };

export type DelegationData = {
  name: string;
  startDate: string;
  endDate: string;
  visibilityIds: Array<string>;
  status: 'active' | 'pending';
  verificationCode: string;
};

export type DelegationColumnData = DelegationData & { menu: string };
