export interface BasicUser {
    sessionToken: string;
    name: string;
    family_name: string;
    fiscal_number: string;
    email: string;
    uid: string;
}
export declare const basicNoLoggedUserData: BasicUser;
export interface ConsentUser {
    accepted: boolean;
    isFirstAccept: boolean;
    consentVersion: string;
}
