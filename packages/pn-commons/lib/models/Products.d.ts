export interface Product {
    createdAt: Date;
    depictImageUrl: string;
    description: string;
    id: string;
    identityTokenAudience: string;
    logo: string;
    logoBgColor: string;
    parentId: string;
    roleManagementURL: string;
    roleMappings: RoleMappings;
    title: string;
    urlBO: string;
    urlPublic: string;
}
interface RoleMappings {
    additionalProp1: AdditionalProp;
    additionalProp2: AdditionalProp;
    additionalProp3: AdditionalProp;
}
interface AdditionalProp {
    multiroleAllowed: boolean;
    roles: Array<Role>;
}
interface Role {
    code: string;
    description: string;
    label: string;
}
export {};
