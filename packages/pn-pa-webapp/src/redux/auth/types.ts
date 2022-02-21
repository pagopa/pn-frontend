import { UserRole } from '../../models/user';

export interface User {
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