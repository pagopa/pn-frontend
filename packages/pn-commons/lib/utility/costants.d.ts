/// <reference types="react" />
import { FooterLinksType, Languages, PreLoginFooterLinksType } from '@pagopa/mui-italia';
export declare const LANGUAGES: Languages;
export declare const PRIVACY_LINK_RELATIVE_PATH = "/informativa-privacy";
export declare const TOS_LINK_RELATIVE_PATH = "/termini-di-servizio";
export declare const pagoPALink: () => {
    href: string;
    ariaLabel: string;
};
export declare const companyLegalInfo: () => JSX.Element;
export declare const preLoginLinks: (hasTermsOfService?: boolean, privacyPolicyHref?: string, termsOfServiceHref?: string) => PreLoginFooterLinksType;
export declare const postLoginLinks: (privacyPolicyHref?: string, termsOfServiceHref?: string) => Array<FooterLinksType>;
