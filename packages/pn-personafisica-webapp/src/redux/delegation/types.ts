import { User } from "../auth/types";

export type UserAndDelegations = User & DelegationsList;

export interface DelegationsList {
    delegators: Array<Delegation>;
    delegations: Array<Delegation>;
    isCompany: boolean;
}

export interface Delegation {
    user: Omit<User, 'uid' | 'exp'>;
    rangeDate: RangeDate;
    delegationRole: 'delegator' | 'delegated';
    delegationStatus: 'pending' | 'accepted' | 'rejected';
    visibilityIds: OrganizationId;
    verificationCode: string;
}

export interface OrganizationId {
    id: string;
    role: 'referente operativo' | 'referente amministrativo';
}

export interface RangeDate {
    startDate: string;
    endDate: string;
}