import { UserRole } from '../../models/user';

interface CommonUser {
    sessionToken: string;
    name: string;
    family_name: string;
    fiscal_number: string;
    organization: Organization;
}

export interface Organization {
    id: string;
    role: UserRole;
}

export interface SelfCareUser extends CommonUser {
    groups?: string;
}

export interface User extends CommonUser  {
    groups?: Array<string>;
}